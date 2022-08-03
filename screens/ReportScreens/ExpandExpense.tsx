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

    useEffect(() => {
        console.log(monthBreakdownData?.monthBreakdown.__typename);
        if (!monthBreakdownLoading && monthBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
            setTopMerchant(monthBreakdownData.monthBreakdown.topMerchant?.merchant?.name);
        } else {
            setTopMerchant("Undefined");
        }
    })
    // const RetreiveTopMerchant = () => {
    //     console.log(monthBreakdownData?.monthBreakdown.__typename);
    //     if (!monthBreakdownLoading && monthBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
    //         setTopMerchant(monthBreakdownData.monthBreakdown.topMerchant?.merchant?.name);
    //     } else {
    //         setTopMerchant("Undefined");
    //     }

    //     return (
    //         <Text>{topMerchant}</Text>
    //     );
    // }

    return <View style={staticStyles.screen}>

        {/* <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} /> */}

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

        <View style={{ justifyContent: "center" }}>
            {/* <RetreiveTopMerchant></RetreiveTopMerchant> */}
            <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
                {topMerchant} is your top spending Merchant
            </Text>
        </View>
    </View >
}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
})