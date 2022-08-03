import { Text, View, StyleSheet } from "react-native";
import { RootStackScreenProps } from "../../types";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRefresh } from "../../hooks/useRefresh";
import Button from "../../components/buttons/Button";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthTotalsDocument, GetMonthTotalsQuery } from "../../components/generated";
import MonthlyExpenseGraph from '../../components/graphs/MonthlyExpenses';
import { TopBar } from "../../components/budget/TopBar";


interface MonthlyDatum {
    month: string,
    year: number,
    amountSpent: number,
    id?: number,
}




export default function ExpandExpense({ navigation, route }: RootStackScreenProps<'ExpandExpenses'>) {
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMonthTotals();
            getTopMerchant();
        },
        redirect: 'ifUnauthorized',
    });
    const [month, setMonth] = useState(route.params.month);
    const [year, setYear] = useState(route.params.year);
    const [percent, setPercent] = useState<string>();
    const [moreOrLess, setMoreOrLess] = useState(false);
    const [topMerchant, setTopMerchant] = useState<string | undefined>("");
    const [getMonthTotals, { loading: monthTotalsLoading, data: monthTotalsData, refetch: monthTotalsRefetch }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument,
        { variables: { passwordHash } });

    const [getTopMerchant, { loading: monthBreakdownLoading, data: monthBreakdownData }] = useLazyQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument,
        {
            variables: { passwordHash, month, year },
        });


    useRefresh(() => {
        monthTotalsRefetch();
    })


    const RetrieveTopMerchant = () => {
        if (!monthBreakdownLoading && monthBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
            setTopMerchant(monthBreakdownData.monthBreakdown.topMerchant?.merchant?.name);
        } else {
            setTopMerchant("Undefined");
        }

        return (
            <Text style={{ fontWeight: 'bold' }}>{topMerchant}</Text>
        );
    }

    const PercentCalculation = () => {
        if (monthTotalsData?.monthsTotals.__typename === "MonthsTotals" && monthTotalsData.monthsTotals.byMonth.length >= 2) {
            let previousMonthIndex = monthTotalsData.monthsTotals.byMonth.findIndex(e => e.month === month) - 1;
            let currentMonthSpent = monthTotalsData.monthsTotals.byMonth[previousMonthIndex + 1].amountSpent;
            let previousMonthSpent = monthTotalsData.monthsTotals.byMonth[previousMonthIndex].amountSpent;
            let delta = (currentMonthSpent - previousMonthSpent) / (previousMonthSpent);

            if (delta > 0) {
                setMoreOrLess(true)
            }

            setPercent(Math.abs((100 * (delta))).toFixed(1))
            console.log();
        }


        return (
            <Text style={{ fontWeight: 'bold' }}>{percent}% {moreOrLess ? "more" : "less"}</Text>
        );
    }

    return <View style={staticStyles.screen}>

        <View>
            <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
                Monthly Expenses for {month.charAt(0) + month.substring(1, month.length).toLowerCase()} {year}
            </Text>
        </View>

        <View>
            <MonthlyExpenseGraph
                data={monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth : []}
                monthSelector={month}
                yearSelector={year} />
        </View>

        <View style={{ justifyContent: "center", alignContent: 'center' }}>
            <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                <RetrieveTopMerchant />
                <Text style={{ paddingLeft: 5, flexWrap: 'wrap', width: 200 }}>is your top spending Merchant</Text>
            </View>
            {/* <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                <Text style={{ fontWeight: 'bold', paddingLeft: 5 }}>Merchant</Text>
            </View> */}
        </View>

        <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                <Text>You spent </Text>
                <PercentCalculation />
            </View>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: "center" }}>
            <Text> this month than the previous month</Text>
        </View>
    </View >
}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
})