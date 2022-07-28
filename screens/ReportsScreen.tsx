import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import Styles from '../constants/Styles';
import { useQuery } from '@apollo/client';
import { GetMonthBreakdownDocument, GetMonthBreakdownQuery } from '../components/generated';
import ByCategory from '../components/GraphDisplays/byCategory';
import { TopBar } from '../components/budget/TopBar';
import { MONTHS_ORDER } from '../constants/Months';

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
            <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />
            <Text></Text>
            <ByCategory categoryData={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : [{ "category": null, "amountSpent": 0 }]} month={month} year={year}></ByCategory>
        </Screen>
    );
}



const styles = StyleSheet.create({

});
