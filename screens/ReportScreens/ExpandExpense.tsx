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
    const [month, setMonth] = useState(route.params.month);
    const [year, setYear] = useState(route.params.year);
    const [percent, setPercent] = useState<string>();
    const [moreOrLess, setMoreOrLess] = useState(false);
    const [moreThanOne, setMoreThanOne] = useState(false);
    const [merchantExist, setMerchantExist] = useState(true);
    const [topMerchant, setTopMerchant] = useState<string | undefined>("");
    const [getMonthTotals, { loading: monthTotalsLoading, data: monthTotalsData, refetch: monthTotalsRefetch }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument,
        { variables: { passwordHash } });

    const [getTopMerchant, { loading: monthBreakdownLoading, data: monthBreakdownData }] = useLazyQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument,
        {
            variables: { passwordHash, month, year },
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
    });


    useEffect(() => {
        // console.log(percent);
    }, [percent]);

    const RetrieveTopMerchant = () => {
        if (!monthBreakdownLoading && monthBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
            setTopMerchant(monthBreakdownData.monthBreakdown.topMerchant?.merchant?.name);
        } else {
            setTopMerchant(undefined);
        }

        return (
            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{topMerchant} </Text>
        );

    }

    const PercentCalculation = () => {
        if (monthTotalsData?.monthsTotals.__typename === "MonthsTotals" && monthTotalsData.monthsTotals.byMonth.length >= 2) {
            let previousMonthIndex = monthTotalsData.monthsTotals.byMonth.findIndex(e => e.month === month) - 1;
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



        return (
            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{percent}% {moreOrLess ? "more" : "less"}</Text>
        );
    }

    return <View style={staticStyles.screen}>
        <ScrollView>

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

            {
                merchantExist && <>

                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50, marginHorizontal: 60 }}>
                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
                                <RetrieveTopMerchant />
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
                                <PercentCalculation />
                                <Text style={{ paddingLeft: 5, width: 300, fontSize: 26 }}> this month than the previous month</Text>
                            </Text>
                        </View>
                    </View>
                </>
            }
        </ScrollView>


        {/* <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: "center", marginRight: 50, flexWrap: 'wrap' }}>
                
            </View>

        </View> */}
    </View >
}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
})