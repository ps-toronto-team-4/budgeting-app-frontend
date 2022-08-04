import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Budget, GetBudgetsDocument, GetBudgetsQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, MonthType } from '../components/generated';
import MonthlyExpenseGraph from '../components/graphs/MonthlyExpenses';
import { useLazyQuery } from '@apollo/client';
import ByCategory from '../components/graphs/ByCategory';
import { TopBar } from '../components/budget/TopBar';
import { MONTHS_ORDER } from '../constants/Months';
import MonthlyVsBudgeted from '../components/graphs/MonthlyVsBudgeted';
import { useRefresh } from '../hooks/useRefresh';
import Button from '../components/buttons/Button';
import MonthlyVsBudgetedCategory from '../components/graphs/monthlyVsBudgetedCategory';

export default function ReportsScreen({ navigation }: RootTabScreenProps<'Reports'>) {


    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMonthlyBreakdown()
            getMonthTotals()
            getBudgets()
        },
        redirect: 'ifUnauthorized',
    });

    const date = new Date();
    const [month, setMonth] = useState(MONTHS_ORDER[date.getMonth()]);
    const [year, setYear] = useState(date.getFullYear());
    useRefresh(() => {
        monthlyBreakdownRefetch()
        monthTotalsRefetch()
        budgetsRefetch()
    })
    const [getMonthlyBreakdown, { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch }] = useLazyQuery<GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables>(GetMonthBreakdownDocument,
        { variables: { passwordHash, month: month as MonthType, year } });
    const [getMonthTotals, { loading: monthTotalsLoading, data: monthTotalsData, refetch: monthTotalsRefetch }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument,
        { variables: { passwordHash } })
    const [getBudgets, { loading: budgetsLoading, data: budgetsData, refetch: budgetsRefetch }] = useLazyQuery<GetBudgetsQuery>(GetBudgetsDocument, {
        variables: { passwordHash }
    })



    return (
        <View style={styles.screen}>
            <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />
            <ScrollView>
                <View>
                    <Text style={{ fontSize: 36, textAlign: 'center' }}>Expenses by Months</Text>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 70 }}>
                    <MonthlyExpenseGraph
                        data={monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth : []}
                        monthSelector={month}
                        yearSelector={year} />
                    <Button text='View More' onPress={() => navigation.navigate('ExpandExpenses', { year, month })}></Button>
                </View>
                <View>
                    <Text style={{ fontSize: 36, textAlign: 'center' }}>Budget and Expenses by Month</Text>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 70 }}>
                    <MonthlyVsBudgeted
                        data={monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth : []}
                        monthSelector={month}
                        yearSelector={year} />
                    <Button text='View More' onPress={() => navigation.navigate('ExpandBudget', { year, month })}></Button>
                </View>
                <View>
                    <Text style={{ fontSize: 36, textAlign: 'center' }}>Budget and Expenses by Category</Text>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 70 }}>
                    <MonthlyVsBudgetedCategory
                        data={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []}
                        budgetReferenceData={budgetsData?.budgets.__typename === 'BudgetsSuccess' ?
                            budgetsData.budgets.budgets.find(ele => {
                                return ele.month == month && ele.year == year
                            }) as Budget : undefined} />
                    <View style={{ height: 20 }}></View>
                    <Button text='View More' onPress={() => navigation.navigate('ExpandBarCat', { year, month })}></Button>
                </View>
                <View>
                    <Text style={{ fontSize: 36, textAlign: 'center' }}>Total Expenses by Category</Text>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 70 }}>
                    <ByCategory categoryData={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []} month={month} year={year}></ByCategory>
                    <Button text='View More' onPress={() => navigation.navigate('ExpandWheel', { year, month })}></Button>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
});
