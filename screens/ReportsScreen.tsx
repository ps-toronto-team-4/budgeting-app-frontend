import React, { useEffect, useState } from 'react';
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
import { HeaderButton } from './Budget/BudgetScreen';


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

    function handleSetMonth(newMonth: string) {
        setMonth(newMonth);
    }

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
        <View style={styles.screen}>
            {/* <TopBar month={month} year={year} setMonth={handleSetMonth} setYear={setYear} /> */}
            <ScrollView keyboardShouldPersistTaps="always">
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
                        displayAmount={3}
                        jumpAmount={1}
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
                        displayAmount={3}
                        jumpAmount={1}
                        data={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ?
                            monthlyBreakdownData.monthBreakdown.byCategory.filter(ele => {
                                const foundBudget = budgetsData?.budgets.__typename == 'BudgetsSuccess' ?
                                    budgetsData.budgets.budgets.find(bud => {
                                        return bud.month == month && bud.year == year
                                    }) as Budget : undefined

                                const foundPair = foundBudget?.budgetCategories?.find(cat => cat.category.name == ele.category?.name)
                                console.log("pari", foundPair, ele)
                                return !(ele.amountSpent == 0 && (foundPair === undefined || foundPair.amount == 0))// && (foundPair === undefined || foundPair.amount == 0)
                            }) : []}
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
                <ByCategory
                    categoryData={
                        monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []
                    }
                    month={month}
                    year={year} />
                <View style={styles.btnContainer}>
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
    btnContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 500,
        zIndex: -1,
        elevation: -1,
    }
});
