import { useLazyQuery, useQuery } from "@apollo/client";
import { useState, useEffect, useMemo } from "react";
import { GetExpensesInMonthDocument, GetExpensesInMonthQuery, GetExpensesInMonthQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, GetMonthTotalsQueryVariables, GetUserDocument, GetUserQuery, GetUserQueryVariables } from "../components/generated";
import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import Styles from "../constants/Styles";
import { StyleSheet } from 'react-native';
import { useRefresh } from "../hooks/useRefresh";
import AddButton from "../components/buttons/AddButton";
import { MONTHS_ORDER } from "../constants/Months";
import { ExpenseDisplay } from "../components/ExpenseDisplay";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";

    const ALERT_COLOR = {
        over: {
            backgroundColor: 'hsl(2, 50%, 80%)',
            borderColor: 'hsl(2, 80%, 30%)'
        },
        under: {
            backgroundColor: 'hsl(108, 50%, 80%)',
            borderColor: 'hsl(108, 80%, 30%)'
        }
    }

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
    const [name, setName] = useState('there');
    const [overBudget, setOverBudget] = useState<string[]>([]);
    const [monthData, setMonthData] = useState<{amountSpent: number, amountBudgeted: number}[]>([]);
    const [expenses, setExpenses] = useState<{id: number, amount: number, category?: {name: string, colourHex: string} | null}[]>([]);
    const [upcoming, setUpcoming] = useState<{id: number, amount: number, category?: {name: string, colourHex: string} | null}[]>([]);
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const monthName = MONTHS_ORDER[month].at(0) + MONTHS_ORDER[month].substring(1).toLowerCase();
    const year = date.getFullYear();

    const [getUser, {}] = useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
        onCompleted: (data) => {
            setName(data?.user.__typename === 'User' ? data.user.firstName : 'there');
        }
    })

    const[getMonth, {loading: monthLoading, data: yearData, refetch: monthRefetch}] = useLazyQuery<GetMonthTotalsQuery, GetMonthTotalsQueryVariables>(GetMonthTotalsDocument, {
        onCompleted(data) {
            if (data.monthsTotals.__typename === 'MonthsTotals') {
                setMonthData(data.monthsTotals.byMonth.filter((item) => item.year === year));
        }}
    })

    const {data, loading, refetch} = useQuery<GetExpensesInMonthQuery, GetExpensesInMonthQueryVariables>(GetExpensesInMonthDocument, {
        onCompleted: (data) => {
            if (data.expensesInMonth.__typename === 'ExpensesSuccess') {
                if (data.expensesInMonth.expenses.length) {
                    let tempExpenses = data.expensesInMonth.expenses.slice(); // copy the data since it is read-only
                    setExpenses(tempExpenses.sort((a, b) => b.date.localeCompare(a.date)).slice(0,3))
                }
            }
        }
    })

    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => getUser({ variables: { passwordHash } }),
        redirect: 'ifUnauthorized',
      });
      useRefresh(() => refetch({ passwordHash }));

    useEffect(() => {
        let diff = monthData[month]?.amountBudgeted - monthData[month]?.amountSpent || 0;
        if (diff < 0) {
            setOverBudget(['Total']);
        }
    }, [monthData]);

    function renderItem(item: {id: number, amount: number, category?: {name: string, colourHex: string} | null}) {
        const color = item.category?.colourHex || Colors.light.uncategorizedColor;
        const name = item.category?.name || 'Uncategorized';

        return  <ExpenseDisplay
                    id={item.id}
                    name={name}
                    color={'#' + color}
                    amount={item.amount}
                    onPress={(id) => navigation.navigate('ExpenseDetails', { expenseId: id })}
                />
    }

    const FirstExpense = () => {
        return (
            <Text style={{textAlign: 'center', fontSize: 18, margin: '20%'}}>You have no expenses for {monthName} yet. Try adding some by pressing this button:</Text>
        )
    }

    return (
        <View style={{flex: 1}}>
            <Text style={style.greeting}>Hello, {name}!</Text>
            { overBudget.length ? (
                <View style={[style.alert, ALERT_COLOR.over]}>
                    <Feather name='info' size={24} color={ALERT_COLOR.over.borderColor} style={{margin: 10}}/>
                    <Text style={style.alertText}>Your expenses for the following categories in {monthName} are over-budget: 
                    <strong> {overBudget.toString()}</strong></Text>
                </View>
            ) : (
                <View style={[style.alert, ALERT_COLOR.under]}>
                    <Feather name='info' size={24} color={ALERT_COLOR.under.borderColor} style={{margin: 10}}/>
                    <Text style={style.alertText}>You have no over-bugdet expenses in {monthName} so far</Text>
                </View>
            )}
            <View style={style.summary}>
                <Text style={style.subtitle}>Your activity:</Text>
                {monthLoading ? <ActivityIndicator size='large' /> : (
                    yearData?.monthsTotals.__typename === 'MonthsTotals' ? (
                    <>
                        <View style={style.halfSummary}>
                            <Text style={style.summaryData}>${monthData.at(month)?.amountSpent.toFixed(2)}</Text>
                            <Text>Your total spendings this month so far</Text>
                        </View>
                        <View style={style.halfSummary}>
                            <Text style={style.summaryData}>${yearData.monthsTotals.averageSpent.toFixed(2)}</Text>
                            <Text>Your average monthly spendings this year</Text>
                        </View>
                    </>
                    ) : (
                        <View>
                            <Text style={Styles.alert}>Something went wrong.</Text>
                        </View>
                    )
                )}
            </View>
            
            <View>
                <Text style={style.subtitle}>Latest {MONTHS_ORDER[month]} expenses:</Text>
                { loading ? <ActivityIndicator size='large' /> : (
                    data?.expensesInMonth?.__typename === 'ExpensesSuccess' ? (
                        <FlatList
                            data={expenses}
                            renderItem={({item}) => renderItem(item)}
                            ListEmptyComponent={<FirstExpense/>}
                        />
                    ) : (
                        <Text style={Styles.alert}>Something went wrong.</Text>
                    )
                )}
            </View>
            <View style={style.addBtn}>
                <AddButton size={70} onPress={() => navigation.navigate('CreateExpense')}/>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    greeting: {
        fontSize: 32,
        fontWeight: 'bold',
        marginHorizontal: 25,
        marginTop: 10,
        marginBottom: 20
    },
    alert: {
        maxWidth: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 20,
        borderWidth: 2,
        fontSize: 24
    },
    alertText: {
        fontSize: 16,
        marginHorizontal: 10 
    },
    subtitle: {
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
    summary: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        textAlign: 'center'
    },
    halfSummary: {
        width: '50%',
        marginBottom: 10

    },
    summaryData: {
        fontWeight: 'bold',
        fontSize: 32,
    },
    expenses: {

    },
    addBtn: {
        position: 'absolute',
        right: 15,
        bottom: 15
    },
})
