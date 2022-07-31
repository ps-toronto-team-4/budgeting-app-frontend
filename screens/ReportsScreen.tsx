import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Screen } from "../components/Screen";
import MonthlyExpenseGraph from '../components/GraphDisplays/monthlyExpenses';
import { useLazyQuery } from '@apollo/client';
import { GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, MonthType } from '../components/generated';
import ByCategory from '../components/GraphDisplays/byCategory';
import { TopBar } from '../components/budget/TopBar';
import { MONTHS_ORDER } from '../constants/Months';
import MonthlyVsBudgeted from '../components/GraphDisplays/monthlyVsBudgeted';
import { ScrollView } from 'react-native-gesture-handler';
import { useRefresh } from '../hooks/useRefresh';

export default function ReportsScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    const [getMonthlyBreakdown, { data, refetch }] = useLazyQuery<GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables>(GetMonthBreakdownDocument);
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => getMonthlyBreakdown({ variables: { passwordHash, month: month as MonthType, year } }),
        redirect: 'ifUnauthorized',
    });
    const date = new Date();
    const [month, setMonth] = useState(MONTHS_ORDER[date.getMonth()]);
    const [year, setYear] = useState(date.getFullYear());
    useRefresh(() => refetch({ passwordHash, month: month as MonthType, year }), [month, year]);


    // useUnauthRedirect();

    const [runFetchMontlyBreakdown, { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch }] = useLazyQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument,
        { variables: { passwordHash: passwordHash, month: month, year: year } }
    )

    const [startQuery, { }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument)




    return (
        <Screen>
            <ScrollView>
                <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />
                <Text></Text>
                <ByCategory categoryData={data?.monthBreakdown.__typename === "MonthBreakdown" ? data.monthBreakdown.byCategory : [{ "category": null, "amountSpent": 0 }]} month={month} year={year}></ByCategory>

                <MonthlyExpenseGraph />
                <MonthlyVsBudgeted />
                <ByCategory categoryData={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : [{ "category": null, "amountSpent": 0 }]} month={month} year={year}></ByCategory>

            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({

});
