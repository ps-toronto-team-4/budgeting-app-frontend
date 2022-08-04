
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { RootStackScreenProps } from "../../types";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { TopBar } from '../../components/budget/TopBar';
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

    const PercentOverBudget = () => {
        return (
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{((100 * overBudgetedCategories.length / totalCategories).toFixed(1))}%</Text>
        );
    }

    return <View style={staticStyles.screen}>
        <ScrollView>

            <MonthlyVsBudgetedCategory
                data={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []}
                budgetReferenceData={currentBudget} />
            <View>
                <View style={{ flex: 1, marginTop: 55, marginBottom: 5, marginLeft: 90, marginRight: 90 }}>
                    <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                        {
                            overBudgetedCategories.length === 0 || totalCategories === 0 ?
                                <Text style={{ textAlign: 'center' }}>Congratulations! None of your budgets were exceeded</Text> :
                                <><PercentOverBudget></PercentOverBudget><Text> of your categories were over budget</Text></>

                        }
                    </View>
                </View>
                <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', alignItems: 'center' }}>

                    {overBudgetedCategories.length !== 0 &&
                        <View style={{ flex: 1, marginTop: 5, marginBottom: 5, marginLeft: 75, marginRight: 75 }}>
                            <Text style={{ fontSize: 26, textAlign: 'center' }}>You are over budget in..</Text>

                            {overBudgetedCategories.map((ele, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <AntDesign name='right' size={32} color="black" />
                                        <Text style={{ fontSize: 16 }}>{ele.category?.name || 'Uncategorized'}</Text>
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