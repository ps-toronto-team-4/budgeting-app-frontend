import { Text, View, StyleSheet, ScrollView } from "react-native";
import { RootStackScreenProps } from "../../types";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRefresh } from "../../hooks/useRefresh";
import Button from "../../components/buttons/Button";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthTotalsDocument, GetMonthTotalsQuery } from "../../components/generated";
import MonthlyExpenseGraph from '../../components/graphs/MonthlyExpenses';
import { TopBar } from "../../components/budget/TopBar";

export default function ExpandExpense({ navigation, route }: RootStackScreenProps<'ExpandExpenses'>) {
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMonthTotals();
            getTopMerchant();
        },
        redirect: 'ifUnauthorized',
    });
    const [percent, setPercent] = useState<string>();
    const [moreOrLess, setMoreOrLess] = useState(false);
    const [moreThanOne, setMoreThanOne] = useState(false);
    const [merchantExist, setMerchantExist] = useState(true);
    const [topMerchant, setTopMerchant] = useState<string | undefined>("");
    const [getMonthTotals, { loading: monthTotalsLoading, data: monthTotalsData, refetch: monthTotalsRefetch }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument,
        { variables: { passwordHash } });

    const [getTopMerchant, { loading: monthBreakdownLoading, data: monthBreakdownData }] = useLazyQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument,
        {
            variables: { passwordHash, month: route.params.month, year: route.params.year },
        });


    // useRefresh(() => {
    //     monthTotalsRefetch();
    // })

    useEffect(() => {
        if (monthTotalsData?.monthsTotals.__typename === "MonthsTotals") {
            if (monthTotalsData.monthsTotals.byMonth.length >= 2) {
                setMoreThanOne(true);
            }
        }

        if (monthBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
            if (monthBreakdownData.monthBreakdown.topMerchant?.merchant === undefined) {
                setMerchantExist(false);
            } else {
                setMerchantExist(true);
            }
        }
    }, [monthTotalsData]);

    useEffect(() => {
        if (!monthBreakdownLoading && monthBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
            setTopMerchant(monthBreakdownData.monthBreakdown.topMerchant?.merchant?.name);
        } else {
            setTopMerchant(undefined);
        }
    }, [monthBreakdownData]);

    useEffect(() => {
        if (monthTotalsData?.monthsTotals.__typename === "MonthsTotals" && monthTotalsData.monthsTotals.byMonth.length >= 2) {
            let previousMonthIndex = monthTotalsData.monthsTotals.byMonth.findIndex(e => e.month === route.params.month) - 1;
            let currentMonthSpent = monthTotalsData.monthsTotals.byMonth[previousMonthIndex + 1].amountSpent;
            let previousMonthSpent = monthTotalsData.monthsTotals.byMonth[previousMonthIndex].amountSpent;
            let delta = (currentMonthSpent) - (previousMonthSpent); //193.68
            let avg = (currentMonthSpent + previousMonthSpent) / (2); //563.18
            let division = delta / avg;

            if (delta > 0) {
                setMoreOrLess(true);
                setPercent(Math.abs((100 * (division))).toFixed(1));
            } else {
                setPercent(Math.abs((100 * (division))).toFixed(1));
            }

        }
    }, [monthTotalsData])

    return <View style={staticStyles.screen}>
        <ScrollView>
            <View>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
                    Monthly Expenses for {route.params.month.charAt(0) + route.params.month.substring(1, route.params.month.length).toLowerCase()} {route.params.year}
                </Text>
            </View>
            <View>
                <MonthlyExpenseGraph
                    data={monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth : []}
                    monthSelector={route.params.month}
                    yearSelector={route.params.year} />
            </View>
            {
                merchantExist && <>

                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50, marginHorizontal: 60 }}>
                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{topMerchant} </Text>
                                <Text style={{ paddingLeft: 5, width: 300, fontSize: 26 }}>is your top spending Merchant</Text>
                            </Text>
                        </View>
                    </View>
                </>
            }
            {
                moreThanOne && <>
                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50, marginHorizontal: 60, paddingBottom: 50 }}>
                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                                <Text style={{ paddingLeft: 5, width: 300, fontSize: 26 }}>You spent </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{percent}% {moreOrLess ? "more" : "less"}</Text>
                                <Text style={{ paddingLeft: 5, width: 300, fontSize: 26 }}> this month than the previous month</Text>
                            </Text>
                        </View>
                    </View>
                </>
            }
        </ScrollView>
    </View >
}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
})
