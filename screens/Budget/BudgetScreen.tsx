import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Budget, BudgetCategory, GetBudgetsDocument, GetBudgetsQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery } from "../../components/generated";
import { Button, SafeAreaView, StatusBar } from "react-native"

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../../types";
import { ChartDisplay } from "../../components/budget/ChartDisplay";
import { BudgetList } from "../../components/budget/BudgetList";
import { MissingBudget } from "../../components/budget/MissingBudget";
import { TopBar } from "../../components/budget/TopBar";
import { useRefresh } from "../../hooks/useRefresh";
import { useAuth } from "../../hooks/useAuth";


export default function BudgetScreen({ navigation, route }: RootTabScreenProps<'Budget'>) {
    const passwordHash = useAuth();
    const [month, setMonth] = useState("JULY")
    const [year, setYear] = useState(2022)

    const { data: budgetData, loading: budgetLoading, refetch: budgetRefetch } = useQuery<GetBudgetsQuery>(GetBudgetsDocument, {
        variables: { passwordHash }
    })
    const { data: monthData, loading: monthLoading, refetch: monthRefetch } = useQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument, {
        variables: {
            passwordHash,
            month,
            year
        }
    })


    useRefresh(() => {
        budgetRefetch()
        monthRefetch()
    }, [passwordHash])


    const selectedBudget = budgetData?.budgets.__typename == 'BudgetsSuccess' ? budgetData.budgets.budgets.find(bud => (bud.month == month && bud.year == year)) : undefined
    const plannedAmount = selectedBudget === undefined ? 0 :
        selectedBudget.budgetCategories?.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0)

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />
                {(selectedBudget &&
                    <>
                        <ChartDisplay
                            planned={plannedAmount ? plannedAmount : 0}
                            actual={monthData?.monthBreakdown.__typename == 'MonthBreakdown' ? monthData.monthBreakdown.totalSpent : 0} />
                        <Button
                            title="Add new Budget"
                            onPress={() => navigation.navigate("CreateBudget", { budget: selectedBudget as Budget })}
                        />
                        <ScrollView>
                            <BudgetList
                                data={selectedBudget.budgetCategories as BudgetCategory[]}
                                monthlyData={monthData}
                                updateCallback={(budCat: BudgetCategory) => {
                                    navigation.navigate("UpdateBudget", { budgetCategory: budCat })
                                }} />
                        </ScrollView>
                    </>)
                    || <MissingBudget
                        otherBudgets={budgetData}
                        passwordHash={passwordHash}
                        triggerRefetch={() => { budgetRefetch(); monthRefetch(); }}
                        year={year}
                        month={month} />

                }
            </SafeAreaView>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemSeparator: {
        flex: 1,
        height: 3,
        flexBasis: 3,
        backgroundColor: '#969696',
    },


    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
