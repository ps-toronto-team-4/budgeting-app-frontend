import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Screen } from "../components/Screen";
import Styles from '../constants/Styles';
import { VictoryChart, VictoryLegend, VictoryPie } from 'victory-native';
import { GetCategoriesDocument, GetCategoriesQuery, GetMonthBreakdownQueryVariables, MonthType } from '../components/generated';
import MonthlyExpenseGraph from '../components/GraphDisplays/monthlyExpenses';
import { useLazyQuery } from '@apollo/client';
import { GetMonthBreakdownDocument, GetMonthBreakdownQuery } from '../components/generated';
import ByCategory from '../components/GraphDisplays/byCategory';
import { TopBar } from '../components/budget/TopBar';
import { MONTHS_ORDER } from '../constants/Months';
import MonthlyVsBudgeted from '../components/GraphDisplays/monthlyVsBudgeted';
import { ScrollView } from 'react-native-gesture-handler';
import { useRefresh } from '../hooks/useRefresh';

export default function ReportsScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    const [getMonthlyBreakdown, { data, refetch }] = useLazyQuery<GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables>(GetMonthBreakdownDocument);
    useAuth({
        onRetrieved: (passwordHash) => getMonthlyBreakdown({ variables: { passwordHash, month: month as MonthType, year } }),
        redirect: 'ifUnauthorized',
    });
    useRefresh(refetch);
    const date = new Date();
    const [month, setMonth] = useState(MONTHS_ORDER[date.getMonth()]);
    const [year, setYear] = useState(date.getFullYear());

    return (
        <Screen>
            <ScrollView>
                <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />
                <Text></Text>
                <ByCategory categoryData={data?.monthBreakdown.__typename === "MonthBreakdown" ? data.monthBreakdown.byCategory : [{ "category": null, "amountSpent": 0 }]} month={month} year={year}></ByCategory>
                <MonthlyExpenseGraph />
                <MonthlyVsBudgeted />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({

});
