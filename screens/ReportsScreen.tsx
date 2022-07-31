import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import MonthlyExpenseGraph from '../components/GraphDisplays/monthlyExpenses';
import { useQuery } from '@apollo/client';
import { GetMonthBreakdownDocument, GetMonthBreakdownQuery } from '../components/generated';
import ByCategory from '../components/GraphDisplays/byCategory';
import { TopBar } from '../components/budget/TopBar';
import { MONTHS_ORDER } from '../constants/Months';
import MonthlyVsBudgeted from '../components/GraphDisplays/monthlyVsBudgeted';
import { ScrollView } from 'react-native-gesture-handler';

export default function ReportsScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    const passwordHash = useAuth();
    const date = new Date();
    const [month, setMonth] = useState(MONTHS_ORDER[date.getMonth()]);
    const [year, setYear] = useState(date.getFullYear());


    useUnauthRedirect();

    const { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch } = useQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument,
        { variables: { passwordHash: passwordHash, month: month, year: year } }
    )


    return (
        <Screen>
            <ScrollView>
                <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />

                <MonthlyExpenseGraph />
                <MonthlyVsBudgeted />
                <ByCategory categoryData={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : [{ "category": null, "amountSpent": 0 }]} month={month} year={year}></ByCategory>

            </ScrollView>
        </Screen>
    );
}



const styles = StyleSheet.create({

});
