
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { RootStackScreenProps } from "../../types";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLazyQuery } from '@apollo/client';
import { Budget, GetBudgetsDocument, GetBudgetsQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, MonthType } from "../../components/generated";
import MonthlyVsBudgetedCategory from '../../components/graphs/monthlyVsBudgetedCategory';
import { AntDesign } from "@expo/vector-icons";

export default function ExpandExpense({ navigation, route }: RootStackScreenProps<'ExpandExpenses'>) {

    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMonthlyBreakdown()
            getBudgets()
        },
        redirect: 'ifUnauthorized',
    });

    const [month, setMonth] = useState(route.params.month)
    const [year, setYear] = useState(route.params.year)

    const [getMonthlyBreakdown, { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch }] = useLazyQuery<GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables>(GetMonthBreakdownDocument,
        { variables: { passwordHash, month: month as MonthType, year } });
    const [getBudgets, { loading: budgetsLoading, data: budgetsData, refetch: budgetsRefetch }] = useLazyQuery<GetBudgetsQuery>(GetBudgetsDocument, {
        variables: { passwordHash }
    })

    let highestExpense: string = 'N/A'
    let lowestExpense: string = 'N/A'
    if (monthlyBreakdownData?.monthBreakdown.__typename == 'MonthBreakdown') {
        highestExpense = '$' + Math.max(...monthlyBreakdownData.monthBreakdown.byCategory.map(ele => ele.amountSpent)).toFixed(2)
        lowestExpense = '$' + Math.min(...monthlyBreakdownData.monthBreakdown.byCategory.map(ele => ele.amountSpent)).toFixed(2)
    }

    const currentBudget: Budget | undefined = budgetsData?.budgets.__typename === 'BudgetsSuccess' ?
        budgetsData.budgets.budgets.find(ele => {
            return ele.month == month && ele.year == year
        }) as Budget : undefined



    const overBudgetedCategories = monthlyBreakdownData?.monthBreakdown.__typename == 'MonthBreakdown' ?
        monthlyBreakdownData.monthBreakdown.byCategory.filter(ele => {
            const curBudget = currentBudget ? currentBudget.budgetCategories?.find(x => x.category.name == ele.category?.name) : undefined
            const delta = curBudget ? curBudget.amount - ele.amountSpent : -ele.amountSpent
            return delta < 0
        }) : []

    const totalCategories = monthlyBreakdownData?.monthBreakdown.__typename == 'MonthBreakdown' ? monthlyBreakdownData.monthBreakdown.byCategory.length : 0


    return <View style={staticStyles.screen}>
        <ScrollView>
            <View>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', marginVertical: 20, marginHorizontal: 20, fontSize: 26 }}>
                    Budgeted and Planned Comparison By Category for {month.charAt(0) + month.substring(1, month.length).toLowerCase()} {year}
                </Text>
            </View>
            <MonthlyVsBudgetedCategory
                displayAmount={3}
                jumpAmount={1}
                data={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []}
                budgetReferenceData={currentBudget} />
            <View>
                <View style={{ flex: 1, marginTop: 55, marginBottom: 5, marginLeft: 60, marginRight: 60 }}>
                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                        {
                            overBudgetedCategories.length === 0 || totalCategories === 0 ?
                                <>
                                    <View style={{ justifyContent: "center" }}>
                                        <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                                            <Text style={{ textAlign: 'center' }}>Congratulations! None of your budgets were exceeded</Text>
                                        </Text>
                                    </View>

                                </> :
                                <>
                                    <View style={{ justifyContent: "center" }}>
                                        <Text style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{((100 * overBudgetedCategories.length / totalCategories).toFixed(1))}%</Text>
                                            <Text style={{ fontSize: 26 }}> of your categories were </Text>
                                            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>over </Text>
                                            <Text style={{ fontSize: 26 }}>budget</Text>
                                        </Text>
                                    </View>

                                </>
                            // <><PercentOverBudget></PercentOverBudget><Text> of your categories were over budget</Text></>

                        }
                    </View>
                </View>
                <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', alignItems: 'center' }}>

                    {overBudgetedCategories.length !== 0 &&
                        <View style={{ flex: 1, marginTop: 50, marginBottom: 50, marginLeft: 60, marginRight: 60 }}>
                            <Text style={{ paddingBottom: 10 }}>
                                <Text style={{ fontSize: 26, textAlign: 'center' }}>You are </Text>
                                <Text style={{ fontSize: 26, fontWeight: 'bold' }}>over </Text>
                                <Text style={{ fontSize: 26, textAlign: 'center' }}> budget in..</Text>
                            </Text>

                            {overBudgetedCategories.map((ele, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <AntDesign name='right' size={32} color="black" />
                                        <Text style={{ fontSize: 26 }}>{ele.category?.name || 'Uncategorized'}</Text>
                                    </View>
                                )
                            })}
                        </View>}

                </View>
            </View>
        </ScrollView>

    </View >
}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
})