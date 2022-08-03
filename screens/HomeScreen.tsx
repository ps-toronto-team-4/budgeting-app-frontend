import { useLazyQuery, useQuery } from "@apollo/client";
import { useState, useEffect, useMemo } from "react";
import { GetExpensesInMonthDocument, GetExpensesInMonthQuery, GetExpensesInMonthQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, GetMonthTotalsQueryVariables, GetUserDocument, GetUserQuery, GetUserQueryVariables, HomePageDataDocument, HomePageDataQuery, HomePageDataQueryVariables, MonthType } from "../components/generated";
import React from 'react';
import { View, Text, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import Styles from "../constants/Styles";
import { StyleSheet } from 'react-native';
import { useRefresh } from "../hooks/useRefresh";
import AddButton from "../components/buttons/AddButton";
import { MONTHS_ORDER } from "../constants/Months";
import { ExpenseDisplay } from "../components/ExpenseDisplay";
import Colors from "../constants/Colors";
import { AntDesign, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";

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
    const [monthData, setMonthData] = useState<{ amountSpent: number, amountBudgeted: number }[]>([]);
    const [expenses, setExpenses] = useState<{ id: number, amount: number, date: string, category?: { name: string, colourHex: string } | null }[]>([]);
    const [expanded, setExpanded] = useState(false);
    const date = new Date();
    const upcoming = useMemo(() => {
        return expenses.filter(item => item.date.substring(0, 10) > date.toJSON().substring(0, 10));
    }, [expenses]);
    const day = date.getDate();
    const month = date.getMonth();
    const monthName = MONTHS_ORDER[month][0] + MONTHS_ORDER[month].substring(1).toLowerCase();
    const year = date.getFullYear();

    const [getUser, { }] = useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
        onCompleted: (data) => {
            setName(data?.user.__typename === 'User' ? data.user.firstName : 'there');
        }
    })

    const [getMonth, { loading: monthLoading, data: yearData, refetch: monthRefetch }] = useLazyQuery<GetMonthTotalsQuery, GetMonthTotalsQueryVariables>(GetMonthTotalsDocument, {
        onCompleted(data) {
            if (data.monthsTotals.__typename === 'MonthsTotals') {
                setMonthData(data.monthsTotals.byMonth.filter((item) => item.year === year));
            }
        }
    })

    const [getExpenses, { data, loading, refetch }] = useLazyQuery<GetExpensesInMonthQuery, GetExpensesInMonthQueryVariables>(GetExpensesInMonthDocument, {
        onCompleted: (data) => {
            if (data.expensesInMonth.__typename === 'ExpensesSuccess') {
                if (data.expensesInMonth.expenses.length) {
                    let tempExpenses = data.expensesInMonth.expenses.slice(); // copy the data since it is read-only
                    setExpenses(tempExpenses.sort((a, b) => b.date.localeCompare(a.date)));
                }
            }
        }
    })

    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getUser({ variables: { passwordHash } });
            getMonth({ variables: { passwordHash } });
            getExpenses({ variables: { passwordHash, month: MonthType.August, year } });
            getHomePageData();
        },
        redirect: 'ifUnauthorized',
    });
    const [getHomePageData, { data: homePageData, refetch: homePageDataRefetch }] = useLazyQuery<HomePageDataQuery, HomePageDataQueryVariables>(HomePageDataDocument, {
        variables: {
            passwordHash,
            month: MONTHS_ORDER[month] as MonthType,
            year,
        },
    });
    useRefresh(() => {
        refetch({ passwordHash });
        monthRefetch({ passwordHash });
        homePageDataRefetch({ passwordHash });
    });

    // Jeremie thinks this function is super bad, and I agrees, especially given the
    // fact there is a query that does exactly this already. Basically, TODO: fix this
    const overBudgetedCategories: string[] = useMemo(() => {
        if (homePageData?.budgetByDate.__typename === 'BudgetSuccess') {
            if (!homePageData.budgetByDate.budget.budgetCategories) return [];
            const overBudgetedCategoryNames = homePageData.budgetByDate.budget.budgetCategories.map(budgetCategory => {
                let sum = 0;
                if (budgetCategory.category.expenses) {
                    sum = budgetCategory.category.expenses
                        .map(expense => {
                            const expenseDate = moment(expense.date);
                            if (expenseDate.year() !== year || expenseDate.month() !== month) return 0;
                            return expense.amount;
                        })
                        .reduce((partialSum, amnt) => partialSum + amnt, 0);
                }
                if (sum > budgetCategory.amount) {
                    return budgetCategory.category.name;
                } else {
                    return false;
                }
            })
            let onlyNames: string[] = [];
            for (let x of overBudgetedCategoryNames) {
                if (x) onlyNames.push(x);
            }
            return onlyNames;
        } else {
            return [];
        }
    }, [homePageData]);

    function renderItem(item: { id: number, amount: number, category?: { name: string, colourHex: string } | null }) {
        const color = item.category?.colourHex || Colors.light.uncategorizedColor;
        const name = item.category?.name || 'Uncategorized';

        return <ExpenseDisplay
            key={item.id}
            id={item.id}
            name={name}
            color={'#' + color}
            amount={item.amount}
            onPress={(id) => navigation.navigate('ExpenseDetails', { expenseId: id })}
        />
    }

    const FirstExpense = () => {
        return (
            <Text style={style.noExpense}>You have no expenses for {monthName} yet. Try adding some by pressing this button:</Text>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Text style={style.greeting}>Hello, {name}!</Text>
            {overBudgetedCategories ? (
                <View style={[style.alert, ALERT_COLOR.over]}>
                    <Feather name='info' size={24} color={ALERT_COLOR.over.borderColor} style={{ margin: 10 }} />
                    <Text style={style.alertText}>You are over budget in these categories for the month of {monthName}:
                        {overBudgetedCategories.map((x, i) => <Text key={i}>{' ' + x + (i < overBudgetedCategories.length - 1 ? ',' : '')}</Text>)}</Text>
                </View>
            ) : (
                <View style={[style.alert, ALERT_COLOR.under]}>
                    <Feather name='info' size={24} color={ALERT_COLOR.under.borderColor} style={{ margin: 10 }} />
                    <Text style={style.alertText}>You have no over-budget categories in {monthName} so far</Text>
                </View>
            )}
            <View style={style.summary}>
                <Text style={style.subtitle}>Your activity:</Text>
                {monthLoading ? <ActivityIndicator size='large' /> : (
                    yearData?.monthsTotals.__typename === 'MonthsTotals' ? (
                        <>
                            <View style={style.halfSummary}>
                                <Text style={style.summaryData}>${monthData[month]?.amountSpent.toFixed(2)}</Text>
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
            <Text style={{ fontWeight: 'bold', fontSize: 24, paddingLeft: 20 }}>{MONTHS_ORDER[month]}</Text>
            <ScrollView>
                <View style={style.expenses}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={style.subtitle}>Upcoming Expenses:</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                            <Text style={{ fontSize: 16, backgroundColor: '#2424a8', color: 'white', paddingHorizontal: 9, paddingVertical: 3, textAlign: 'center', textAlignVertical: 'center', borderRadius: 90, marginRight: 15 }}>
                                {upcoming.length}
                            </Text>
                            <AntDesign
                                name={expanded ? 'up' : 'down'}
                                size={20}
                                color="black"
                                onPress={() => setExpanded(!expanded)} />
                        </View>
                    </View>
                    <View>
                        {expanded ? (
                            upcoming.length > 0 ? (
                                upcoming.map((item) => renderItem(item))
                            ) : (
                                <Text style={style.noExpense}>You have no upcoming expenses for this month.</Text>
                            )) : (<></>)
                        }
                    </View>
                </View>
                <View style={style.expenses}>
                    <Text style={style.subtitle}>Latest Expenses:</Text>
                    {loading ? <ActivityIndicator size='large' /> : (
                        data?.expensesInMonth?.__typename === 'ExpensesSuccess' ? (
                            expenses.length === 0 ?
                                <FirstExpense />
                                :
                                expenses.slice(upcoming.length, upcoming.length + 3).map(expense => {
                                    return renderItem(expense);
                                })
                        ) : (
                            <Text style={Styles.alert}>Something went wrong.</Text>
                        )
                    )}
                </View>
            </ScrollView >
            <View style={style.addBtn}>
                <AddButton size={70} onPress={() => navigation.navigate('CreateExpense')} />
            </View>
        </SafeAreaView>
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
        marginHorizontal: 10,
        maxWidth: '80%'
    },
    subtitle: {
        padding: 10,
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
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        marginTop: 15,
        padding: 15
    },
    noExpense: {
        fontSize: 18,
        margin: 10
    },
    addBtn: {
        position: 'absolute',
        right: 15,
        bottom: 15
    },
})
