import { useLazyQuery } from "@apollo/client";
import { useState, useMemo } from "react";
import { GetExpensesInMonthDocument, GetExpensesInMonthQuery, GetExpensesInMonthQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, GetMonthTotalsQueryVariables, GetUserDocument, GetUserQuery, GetUserQueryVariables, HomePageDataDocument, HomePageDataQuery, HomePageDataQueryVariables, MonthType } from "../components/generated";
import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
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
    const [expanded, setExpanded] = useState(false);
    const [expenses, setExpenses] = useState<{ id: number, amount: number, date: string, category?: { name: string, colourHex: string } | null }[]>([]);
    const date = new Date();
    const month = date.getMonth();
    const monthName = MONTHS_ORDER[month][0] + MONTHS_ORDER[month].substring(1).toLowerCase();
    const year = date.getFullYear();

    const upcoming = useMemo(() => {
        return expenses.filter(item => item.date.substring(0, 10) > date.toJSON().substring(0, 10));
    }, [expenses]);

    const [getUser] = useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
        onCompleted: (data) => {
            setName(data?.user.__typename === 'User' ? data.user.firstName : 'there');
        }
    })

    const [getAvg, { data: avgData, refetch: avgRefetch }] = useLazyQuery<GetMonthTotalsQuery, GetMonthTotalsQueryVariables>(GetMonthTotalsDocument)

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
            getAvg({ variables: { passwordHash } });
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
        avgRefetch({ passwordHash });
        homePageDataRefetch({ passwordHash });
    });

    const homeQueryData = useMemo(() => {
        let overBudgetCategories: string[] = [];
        let monthTotal = 0;
        if (homePageData?.budgetDetailsByDate.__typename === 'BudgetDetails' ) {
            monthTotal = homePageData.budgetDetailsByDate.totalActual;
            overBudgetCategories = homePageData.budgetDetailsByDate.byCategory.filter(budgetCategory => {
                return (budgetCategory.amountActual > budgetCategory.amountBudgeted);
            }).map((item) => item.category.name);
        }
        return {monthTotal, overBudgetCategories};
    }, [homePageData]);

    const averageData = useMemo(() => {
        let yearAvg = 0;
        if (avgData?.monthsTotals.__typename === 'MonthsTotals' && avgData.monthsTotals.averageSpent) {
            yearAvg = avgData.monthsTotals.averageSpent;
        }
        return yearAvg;
    }, [avgData]);

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
            {homeQueryData.overBudgetCategories.length ? (
                <View style={[style.alert, ALERT_COLOR.over]}>
                    <Feather name='info' size={24} color={ALERT_COLOR.over.borderColor} style={{ margin: 10 }} />
                    <Text style={style.alertText}>You are over budget in these categories for the month of {monthName}:
                        {homeQueryData.overBudgetCategories.map((x, i) => <Text style={{fontWeight: 'bold'}} key={i}>{' ' + x + (i < homeQueryData.overBudgetCategories.length - 1 ? ',' : '')}</Text>)}</Text>
                </View>
            ) : (
                <View style={[style.alert, ALERT_COLOR.under]}>
                    <Feather name='info' size={24} color={ALERT_COLOR.under.borderColor} style={{ margin: 10 }} />
                    <Text style={style.alertText}>You have no over-budget categories in {monthName} so far</Text>
                </View>
            )}
            <Text style={style.subtitle}>Your activity:</Text>
            <View style={style.summary}>
                <View style={style.halfSummary}>
                    <View style={style.dateContainer}>
                        <Text style={style.dateText}>{MONTHS_ORDER[month]}</Text>
                    </View>
                    <View style={style.summaryDataContainer}>
                        <Text style={style.summaryData}>${homeQueryData.monthTotal.toFixed(2)}</Text>
                        <Text style={style.summaryText}>Your total spendings this month so far</Text>
                    </View>
                </View>
                <View style={style.halfSummary}>
                    <View style={style.dateContainer}>
                        <Text style={style.dateText}>{year}</Text>
                    </View>
                    <View style={style.summaryDataContainer}>
                        <Text style={style.summaryData}>${averageData.toFixed(2)}</Text>
                        <Text style={style.summaryText}>Your average monthly spendings this year</Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                <View style={style.expenses}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={style.subtitle}>Upcoming Expenses:</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 15 }}>
                            <View style={{ backgroundColor: 'rgb(22, 89, 193)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 90, marginRight: 15 }}>
                                <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', textAlignVertical: 'center'}}>
                                {upcoming.length}
                                </Text>
                            </View>
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
        padding: 15,
        fontWeight: 'bold',
        fontSize: 18,
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center'
    },
    halfSummary: {
        width: '45%',
        maxWidth: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    summaryData: {
        fontWeight: 'bold',
        fontSize: 28,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    summaryText: {
        fontSize: 14,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    summaryDataContainer: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        padding: 10,
        width: '100%'
    },
    dateContainer: {
        backgroundColor: 'rgba(173, 124, 237, 0.7)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '100%'
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    expenses: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        marginTop: 15,
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
