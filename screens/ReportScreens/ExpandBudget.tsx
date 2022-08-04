import { Text, View, StyleSheet, ScrollView } from "react-native";
import { RootStackScreenProps } from "../../types";
import { useState } from "react";
import MonthlyVsBudgeted from '../../components/graphs/MonthlyVsBudgeted';
import { useAuth } from "../../hooks/useAuth";
import { TopBar } from '../../components/budget/TopBar';
import { useLazyQuery } from "@apollo/client";
import { GetMonthTotalsDocument, GetMonthTotalsQuery } from "../../components/generated";



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
            return <Text style={staticStyles.text}>Your {name} is unchanged from last month</Text>
        } else if (changeFactor > 1) {
            return <Text style={staticStyles.text}>Your {name} has increased by {((changeFactor - 1) * 100).toFixed()}% from last month</Text>
        } else {
            return <Text style={staticStyles.text}>Your {name} has decreased by {((changeFactor) * 100).toFixed()}% from last month</Text>
        }
    }

    function budgetVSSpendingInsight(changeFactor: number | undefined) {
        if (changeFactor === undefined || changeFactor === 1) {
            return <Text style={staticStyles.text}>Your expense match you budget</Text>
        } else if (changeFactor > 1) {
            return <Text style={staticStyles.text}>Your expense are {((changeFactor - 1) * 100).toFixed()}% in excess of your budget</Text>
        } else {
            return <Text style={staticStyles.text}>Your expense are {((changeFactor) * 100).toFixed()}% under your budget</Text>
        }
    }


    return (<View style={staticStyles.screen}>
        <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />

        <ScrollView>

            <View>
                <Text style={{ fontSize: 36, textAlign: 'center' }}>Expenditure VS Budgeted by Month</Text>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 70 }}>
                <MonthlyVsBudgeted
                    data={monthTotalsData?.monthsTotals.__typename == "MonthsTotals" ? monthTotalsData.monthsTotals.byMonth : []}
                    monthSelector={month}
                    yearSelector={year} />
            </View>
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
                    < View style={[staticStyles.textContainer]}>
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