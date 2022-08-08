import { Text, View, StyleSheet, ScrollView } from "react-native";
import { RootStackScreenProps } from "../../types";
import { useState } from "react";
import MonthlyVsBudgeted from '../../components/graphs/MonthlyVsBudgeted';
import { useAuth } from "../../hooks/useAuth";
import { TopBar } from '../../components/budget/TopBar';
import { useLazyQuery } from "@apollo/client";
import { GetMonthTotalsDocument, GetMonthTotalsQuery, MonthType } from "../../components/generated";
import { Card } from "../../components/reports/Card";
import { BudgetsByMonth } from "../../components/reports/graphs/BudgetsByMonth";



export default function ExpandExpense({ navigation, route }: RootStackScreenProps<'ExpandExpenses'>) {

    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMonthTotals()
        },
        redirect: 'ifUnauthorized',
    });
    const [month, setMonth] = useState(route.params.month)
    const [year, setYear] = useState(route.params.year)

    const [getMonthTotals, { loading: monthTotalsLoading, data: monthTotalsData, refetch: monthTotalsRefetch }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument,
        { variables: { passwordHash } })



    const indexOfCurrentMonth = monthTotalsData?.monthsTotals.__typename == 'MonthsTotals' ?
        monthTotalsData.monthsTotals.byMonth.findIndex(ele => ele.month == month && ele.year == year) : -1

    let currentMonth = undefined
    let lastMonth = undefined
    let deltaInSpending: undefined | number;
    let deltaInBudget;
    let budgetDelta;
    if (indexOfCurrentMonth > 0 && monthTotalsData?.monthsTotals.__typename == 'MonthsTotals') {
        currentMonth = monthTotalsData.monthsTotals.byMonth[indexOfCurrentMonth]
        lastMonth = monthTotalsData.monthsTotals.byMonth[indexOfCurrentMonth - 1]

        deltaInSpending = lastMonth.amountSpent !== 0 ? currentMonth.amountSpent / lastMonth.amountSpent : 1
        deltaInBudget = lastMonth.amountBudgeted !== 0 ? currentMonth.amountBudgeted / lastMonth.amountBudgeted : 1
        budgetDelta = currentMonth.amountBudgeted !== 0 ? currentMonth.amountSpent / currentMonth.amountBudgeted : 1

    }

    function spendingInsight(changeFactor: number | undefined, name: string) {
        if (changeFactor === undefined || changeFactor === 1) {
            return (
                <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                            <Text style={staticStyles.text}>Your </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{name}</Text>
                            <Text style={staticStyles.text}> is unchanged from last month</Text>
                        </Text>
                    </View>
                </View>
            );
        } else if (changeFactor > 1) {
            return (
                <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                            <Text style={staticStyles.text}>Your </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{name}</Text>
                            <Text style={staticStyles.text}> has increased by </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>${((changeFactor - 1) * 100).toFixed()}</Text>
                            <Text style={staticStyles.text}> from last month</Text>
                        </Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                            <Text style={staticStyles.text}>Your </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{name}</Text>
                            <Text style={staticStyles.text}> has decreased by </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{((changeFactor) * 100).toFixed()}%</Text>
                            <Text style={staticStyles.text}> from last month</Text>
                        </Text>
                    </View>
                </View>

            );
        }
    }

    function budgetVSSpendingInsight(changeFactor: number | undefined) {
        if (changeFactor === undefined || changeFactor === 1) {
            return (
                <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                            <Text style={staticStyles.text}>Your </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>expenses</Text>
                            <Text> matches your budget</Text>
                        </Text>
                    </View>
                </View>
            );
        } else if (changeFactor > 1) {
            return (
                <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                            <Text style={staticStyles.text}>Your </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>expenses</Text>
                            <Text style={staticStyles.text}> are </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{((changeFactor - 1) * 100).toFixed()}%</Text>
                            <Text style={staticStyles.text}> in excess of your budget</Text>
                        </Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                            <Text style={staticStyles.text}>Your </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>expenses</Text>
                            <Text style={staticStyles.text}> are </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{((changeFactor) * 100).toFixed()}%</Text>
                            <Text style={staticStyles.text}> under your budget</Text>
                        </Text>
                    </View>
                </View>
            );
        }
    }


    return (<View style={staticStyles.screen}>

        <ScrollView>
            <Card
                title={`Budgets for ${month.slice(0, 3)} ${year}`}
                graph={
                    <BudgetsByMonth
                        month={month as MonthType}
                        data={
                            monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth.map(x => {
                                return {
                                    month: x.month,
                                    budget: x.amountBudgeted,
                                    spent: {
                                        planned: x.amountSpentPlanned,
                                        unplanned: x.amountSpentUnplanned,
                                    },
                                }
                            }) : []
                        } />
                } />
            {currentMonth &&
                <View style={[staticStyles.textContainer]}>
                    {budgetVSSpendingInsight(budgetDelta)}
                </View>
            }
            {currentMonth && lastMonth &&
                <>
                    < View style={[staticStyles.textContainer]}>
                        {spendingInsight(deltaInSpending, 'spending')}
                    </View>
                    < View style={[staticStyles.textContainer, { paddingBottom: 70 }]}>
                        {spendingInsight(deltaInBudget, 'budget')}
                    </View>
                </>
            }
        </ScrollView >
    </View >)
}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 26,
        textAlign: 'center'
    },
    textContainer: {
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 75,
        marginRight: 75
    }
})