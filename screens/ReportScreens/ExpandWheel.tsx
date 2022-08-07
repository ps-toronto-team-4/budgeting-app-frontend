import { Text, View, StyleSheet, Alert, ScrollView } from "react-native";
import { RootStackScreenProps } from "../../types";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Category, GetBudgetsDocument, GetBudgetsQuery, GetCategoriesDocument, GetCategoriesQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, MonthBreakdownCategory, MonthType } from "../../components/generated";
import { useLazyQuery, useQuery } from "@apollo/client";
import Button from "../../components/buttons/Button";
import { DropdownRow } from "../../components/forms/DropdownRow";
import { VictoryLegend, VictoryPie } from "victory-native";
import { EventCallbackInterface, StringOrNumberOrList } from "victory-core";
import { DropdownField } from "../../components/forms/DropdownField";
import ByCategory from "../../components/graphs/ByCategory";
import { Form } from "../../components/forms/Form";
import { Card } from "../../components/reports/Card";

type ByCategoryProps = {
    categoryData: MonthBreakdownCategory[];
    month: string;
    year: number;
}

type PercentProps = {
    categoryName: string;
}

type RetrieveAmountProps = {
    categoryData: MonthBreakdownCategory[];
    categoryName: string;
}


interface ExternalMutation {
    target: string,
    eventKey: string,
    mutation: Function,
    callback: Function
}

export default function ExpandExpense({ navigation, route }: RootStackScreenProps<'ExpandExpenses'>) {
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMonthlyBreakdown()

        },
        redirect: 'ifUnauthorized',
    });
    const [month, setMonth] = useState(route.params.month);
    const [year, setYear] = useState(route.params.year);
    const [percent, setPercent] = useState("");
    const [categoryExpense, setCategoryExpense] = useState<string>();
    const [selectedCategory, setSelectedCategory] = useState<{ id: number, name: string } | undefined>(undefined);
    const [getMonthlyBreakdown, { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch }] = useLazyQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument,
        { variables: { passwordHash, month: month as MonthType, year } });



    const retrieveAmountSpent = (categoryName: string) => {
        if (monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
            let categoryIndex = monthlyBreakdownData.monthBreakdown.byCategory.findIndex(e => e.category?.name === categoryName);
            let currentCategorySpent = monthlyBreakdownData.monthBreakdown.byCategory[categoryIndex].amountSpent;

            if (currentCategorySpent > 0) {
                setCategoryExpense(currentCategorySpent.toFixed(2));
            } else {
                setCategoryExpense("");
            }
        } else {
            console.log("Error");
        }

    }

    const percentOfTotal = (categoryName: string) => {
        if (monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
            let totalSpent = monthlyBreakdownData.monthBreakdown.totalSpent;
            let categoryIndex = monthlyBreakdownData.monthBreakdown.byCategory.findIndex(e => e.category?.name === categoryName);
            let currentCategorySpent = monthlyBreakdownData.monthBreakdown.byCategory[categoryIndex].amountSpent;
            let delta = (currentCategorySpent) / (totalSpent);

            if (delta > 0) {
                setPercent(Math.abs((100 * (delta))).toFixed(1) + "%");
            } else {
                setPercent("");
            }
        }
    }

    const handleCategoryChange = (newCategory: { id: number, name: string } | undefined) => {
        setSelectedCategory(newCategory);
        if (newCategory) {
            retrieveAmountSpent(newCategory.name);
            percentOfTotal(newCategory.name);
        }
    }

    useEffect(() => {
    }, [selectedCategory])


    return (
        <ScrollView keyboardShouldPersistTaps="always" style={staticStyles.screen}>
            <Card
                title='Expenses by Category'
                graph={
                    <ByCategory
                        categoryData={
                            monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown"
                                ? monthlyBreakdownData.monthBreakdown.byCategory.slice().sort((a, b) => {
                                    if (!a.category || !b.category) {
                                        return 0;
                                    } else if (a.category.name > b.category.name) {
                                        return 1;
                                    } else if (a.category.name < b.category.name) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                })
                                : []
                        }
                        month={month}
                        year={year}
                        onChangeCategory={setSelectedCategory} />
                } />
            <View style={staticStyles.insightsContainer}>
                {
                    selectedCategory !== undefined &&
                    <>
                        <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50, marginHorizontal: 80 }}>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 26 }}>${categoryExpense}</Text>
                                    <Text style={{ fontSize: 26 }}> spent on </Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{selectedCategory?.name}</Text>
                                </Text>
                            </View>
                        </View>

                        <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50, marginHorizontal: 100 }}>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{percent}</Text>
                                    <Text style={{ fontSize: 26 }}> of your {month.charAt(0) + month.substring(1, month.length).toLowerCase()} expenses</Text>
                                </Text>
                            </View>
                        </View>
                    </>
                }
            </View>
        </ScrollView>
    );

}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    graphContainer: {
        alignItems: 'center',
    },
    insightsContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 500,
        zIndex: -1,
        elevation: -1,
    },
})