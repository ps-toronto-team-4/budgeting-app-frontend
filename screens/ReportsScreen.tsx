import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Budget, BudgetDetailsByDateDocument, BudgetDetailsByDateQuery, BudgetDetailsByDateQueryVariables, GetBudgetsDocument, GetBudgetsQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, MonthType } from '../components/generated';
import MonthlyExpenseGraph from '../components/graphs/MonthlyExpenses';
import { useLazyQuery } from '@apollo/client';
import ByCategory from '../components/graphs/ByCategory';
import { TopBar } from '../components/budget/TopBar';
import { MONTHS_ORDER } from '../constants/Months';
import MonthlyVsBudgeted from '../components/graphs/MonthlyVsBudgeted';
import { useRefresh } from '../hooks/useRefresh';
import Button from '../components/buttons/Button';
import MonthlyVsBudgetedCategory from '../components/graphs/monthlyVsBudgetedCategory';
import { HeaderButton } from './Budget/BudgetScreen';
import { Form } from '../components/forms/Form';
import { Card } from '../components/reports/Card';
import { VictoryPie } from 'victory-native';
import { ExpensesByMonth } from '../components/reports/graphs/ExpensesByMonth';
import { BudgetsByMonth } from '../components/reports/graphs/BudgetsByMonth';
import { BudgetsByCategory } from '../components/reports/graphs/BudgetsByCategory';


export default function ReportsScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    const date = new Date();
    const [month, setMonth] = useState(MONTHS_ORDER[date.getMonth()]);
    const [year, setYear] = useState(date.getFullYear());
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMonthlyBreakdown()
            getMonthTotals()
            getBudgets()
            getBudgetDetailsByDate({ variables: { passwordHash, month: month as MonthType, year } });
        },
        redirect: 'ifUnauthorized',
    });
    useRefresh(() => {
        monthlyBreakdownRefetch()
        // monthTotalsRefetch()
        budgetsRefetch()
        budgetDetailsRefetch();
    })

    const [getMonthlyBreakdown, { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch }] = useLazyQuery<GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables>(GetMonthBreakdownDocument,
        { variables: { passwordHash, month: month as MonthType, year } });
    const [getMonthTotals, { loading: monthTotalsLoading, data: monthTotalsData, refetch: monthTotalsRefetch }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument,
        { variables: { passwordHash } })
    const [getBudgets, { loading: budgetsLoading, data: budgetsData, refetch: budgetsRefetch }] = useLazyQuery<GetBudgetsQuery>(GetBudgetsDocument, {
        variables: { passwordHash }
    })
    const [getBudgetDetailsByDate, { data: budgetDetailsData, refetch: budgetDetailsRefetch }] = useLazyQuery<BudgetDetailsByDateQuery, BudgetDetailsByDateQueryVariables>(BudgetDetailsByDateDocument);

    function handleSetMonth(newMonth: string) {
        setMonth(newMonth);
    }

    useEffect(() => {
        budgetDetailsRefetch({ passwordHash, month: month as MonthType, year });
    }, [month]);

    const months = MONTHS_ORDER;

    const backAMonth = () => {
        const curIndex = months.indexOf(month)
        if (curIndex === 0) {
            setMonth(months[months.length - 1])
            setYear((prevYear) => prevYear - 1);
        } else {
            setMonth((prevMonth) => months[months.indexOf(prevMonth) - 1]);
        }
    };

    const forwardAMonth = () => {
        const curIndex = months.indexOf(month)
        if (curIndex === months.length - 1) {
            setMonth(months[0]);
            setYear((prevYear) => prevYear + 1);
        } else {
            setMonth((prevMonth) => months[months.indexOf(prevMonth) + 1]);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `${month} ${year}`,
            headerBackVisible: false,
            headerLeft: () => <HeaderButton direction="left" marginLeft={10} onPress={backAMonth} />,
            headerRight: () => <HeaderButton direction="right" marginRight={10} onPress={forwardAMonth} />,
        });
    }, [month]);

    return (
        <ScrollView keyboardShouldPersistTaps="always">
            <Form>
                <Card
                    title='Expenses by Category'
                    graph={
                        <ByCategory
                            categoryData={
                                monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown"
                                    ? monthlyBreakdownData.monthBreakdown.byCategory.slice().sort((a, b) => {
                                        if (!a.category || !b.category) {
                                            return 0;
                                        } else if (a.category.name > b.category.name) {
                                            return 1;
                                        } else if (a.category.name < b.category.name) {
                                            return -1;
                                        } else {
                                            return 0;
                                        }
                                    })
                                    : []
                            }
                            month={month}
                            year={year} />
                    }
                    onViewDetails={() => navigation.navigate('ExpandWheel', { year, month })} />
                <View style={{ zIndex: -1, elevation: -1 }}>
                    <Card
                        title='Expenses by Month'
                        graph={
                            <ExpensesByMonth
                                month={month as MonthType}
                                data={
                                    monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth.map(x => ({ month: x.month, amount: x.amountSpent })) : []
                                } />
                        }
                        onViewDetails={() => navigation.navigate('ExpandExpenses', { year, month })} />
                </View>
                <Card
                    title='Budgets by Month'
                    graph={
                        <BudgetsByMonth
                            month={month as MonthType}
                            data={
                                monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth.map(x => {
                                    return {
                                        month: x.month,
                                        budget: x.amountBudgeted,
                                        spent: {
                                            planned: x.amountSpentPlanned,
                                            unplanned: x.amountSpentUnplanned,
                                        },
                                    }
                                }) : []
                            } />
                    }
                    onViewDetails={() => navigation.navigate('ExpandBudget', { year, month })} />
                {/* <Card
                    // Work in progress
                    title='Budgets by Category'
                    graph={
                        <BudgetsByCategory data={
                            budgetDetailsData?.budgetDetailsByDate.__typename === 'BudgetDetails'
                                ? budgetDetailsData.budgetDetailsByDate.byCategory.map(x => ({
                                    category: x.category.name,
                                    budgeted: x.amountBudgeted,
                                    spent: x.amountActual,
                                }))
                                : []
                        } />
                    }
                    onViewDetails={() => navigation.navigate('ExpandBarCat', { year, month })} /> */}
                <Card
                    title='Budgets by Category'
                    graph={
                        <MonthlyVsBudgetedCategory
                            displayAmount={3}
                            jumpAmount={1}
                            data={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ?
                                monthlyBreakdownData.monthBreakdown.byCategory.filter(ele => {
                                    const foundBudget = budgetsData?.budgets.__typename == 'BudgetsSuccess' ?
                                        budgetsData.budgets.budgets.find(bud => {
                                            return bud.month == month && bud.year == year
                                        }) as Budget : undefined
                                    const foundPair = foundBudget?.budgetCategories?.find(cat => cat.category.name == ele.category?.name)
                                    // console.log("pari", foundPair, ele)
                                    return !(ele.amountSpent == 0 && (foundPair === undefined || foundPair.amount == 0))// && (foundPair === undefined || foundPair.amount == 0)
                                }) : []}
                            budgetReferenceData={budgetsData?.budgets.__typename === 'BudgetsSuccess' ?
                                budgetsData.budgets.budgets.find(ele => {
                                    return ele.month == month && ele.year == year
                                }) as Budget : undefined} />
                    }
                    onViewDetails={() => navigation.navigate('ExpandBarCat', { year, month })} />
            </Form>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    btnContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 50,
        zIndex: -1,
        elevation: -1,
    }
});
