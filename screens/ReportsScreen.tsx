import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Screen } from "../components/forms/Screen";
import Styles from '../constants/Styles';
import { VictoryChart, VictoryLegend, VictoryPie } from 'victory-native';
import { GetCategoriesDocument, GetCategoriesQuery, GetMonthBreakdownQueryVariables, MonthType } from '../components/generated';
import MonthlyExpenseGraph from '../components/graphs/MonthlyExpenses';
import { useLazyQuery } from '@apollo/client';
import { GetMonthBreakdownDocument, GetMonthBreakdownQuery } from '../components/generated';
import ByCategory from '../components/graphs/ByCategory';
import { TopBar } from '../components/budget/TopBar';
import { MONTHS_ORDER } from '../constants/Months';
import MonthlyVsBudgeted from '../components/graphs/MonthlyVsBudgeted';
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

    return (
        <View style={styles.screen}>
            <ScrollView>
                <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />
                <Text></Text>
                <ByCategory categoryData={data?.monthBreakdown.__typename === "MonthBreakdown" ? data.monthBreakdown.byCategory : [{ "category": null, "amountSpent": 0 }]} month={month} year={year}></ByCategory>
                <MonthlyExpenseGraph />
                <MonthlyVsBudgeted />
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
