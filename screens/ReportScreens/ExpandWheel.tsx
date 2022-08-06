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
        <Form>
            <ScrollView keyboardShouldPersistTaps="always">
                <View>
                    <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', marginVertical: 20, marginHorizontal: 40, fontSize: 26 }}>
                        Monthly Expenses By Category for {month.charAt(0) + month.substring(1, month.length).toLowerCase()} {year}
                    </Text>
                </View>

                <View>
                    <ByCategory categoryData={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []} month={month} year={year} onChangeCategory={handleCategoryChange}></ByCategory>
                </View>

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
        </Form>
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