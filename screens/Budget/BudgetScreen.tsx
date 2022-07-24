import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Budget, BudgetCategory, Category, GetBudgetsDocument, GetBudgetsQuery, GetExpensesDocument, GetExpensesQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery } from "../../components/generated";
import { Button, Modal, Pressable, SafeAreaView, StatusBar } from "react-native"

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChartDisplay from "./components/chartDisplay";
import ShowBudgets from "./components/budgetList";
import MissingBudget from "./components/missingBudget";
import TopBar from "./components/topBar";


export default function BudgetScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const [passwordHash, setpasswordHash] = React.useState("");
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

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('passwordHash')
            if (value != null) {
                setpasswordHash(value);
            }
        } catch (e) {
            setpasswordHash('undefined');
        }
    }

    const selectedBudget = budgetData?.budgets.__typename == 'BudgetsSuccess' ? budgetData.budgets.budgets.find(bud => (bud.month == month && bud.year == year)) : undefined

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <TopBar month={month} year={year} setMonth={setMonth} setYear={setYear} />
                {(selectedBudget &&
                    <>
                        <ChartDisplay data={selectedBudget.budgetCategories as BudgetCategory[]} />
                        <Button
                            title="Add new Budget"
                            onPress={() => navigation.navigate("CreateBudget")}
                        />
                        <ScrollView>
                            <ShowBudgets data={selectedBudget.budgetCategories as BudgetCategory[]} monthlyData={monthData} />
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
