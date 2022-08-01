import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Screen } from "../components/Screen";
import MonthlyExpenseGraph from '../components/GraphDisplays/monthlyExpenses';
import { useLazyQuery } from '@apollo/client';
import { GetBudgetsDocument, GetBudgetsQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, MonthType } from '../components/generated';
import ByCategory from '../components/GraphDisplays/byCategory';
import { TopBar } from '../components/budget/TopBar';
import { MONTHS_ORDER } from '../constants/Months';
import MonthlyVsBudgeted from '../components/GraphDisplays/monthlyVsBudgeted';
import { ScrollView } from 'react-native-gesture-handler';
import { useRefresh } from '../hooks/useRefresh';
import Button from '../components/Button';

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
        <Screen>
            <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />
            <ScrollView>

                <View>
                    <MonthlyExpenseGraph
                        data={monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth : []}
                        monthSelector={month}
                        yearSelector={year} />
                    <Button text='View More'></Button>
                </View>
                <View>
                    <MonthlyVsBudgeted
                        data={monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth : []}
                        monthSelector={month}
                        yearSelector={year} />
                    <Button text='View More'></Button>
                </View>

                <View>


                </View>

                <View>
                    <ByCategory categoryData={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []} month={month} year={year}></ByCategory>
                    <Button text='View More'></Button>
                </View>

            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({

});
