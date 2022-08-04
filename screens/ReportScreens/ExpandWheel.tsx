import { Text, View, StyleSheet, Alert } from "react-native";
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

type ByCategoryProps = {
    categoryData: MonthBreakdownCategory[];
    month: string;
    year: number;
}

type PercentProps = {
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
            getMonthTotals()

        },
        redirect: 'ifUnauthorized',
    });
    const [month, setMonth] = useState(route.params.month);
    const [year, setYear] = useState(route.params.year);
    const [existing, setExisting] = useState(true);
    const [percent, setPercent] = useState("");
    const [categoryExpense, setCategoryExpense] = useState<string>();
    const [selectedCategory, setSelectedCategory] = useState<{ id: number, name: string } | undefined>();
    const [getMonthlyBreakdown, { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch }] = useLazyQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument,
        { variables: { passwordHash, month: month as MonthType, year } });
    const [getMonthTotals, { loading: monthTotalsLoading, data: monthTotalsData, refetch: monthTotalsRefetch }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument,
        { variables: { passwordHash } })
    const { data: categoriesData, refetch } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
        variables: { passwordHash: passwordHash },
        onError: (error => {
            Alert.alert(error.message);
        }),
    });



    const ByCategory = ({ categoryData, year, month }: ByCategoryProps) => {
        const passwordHash = useAuth();
        const [category, setCategory] = useState<{ id: number, name: string }>();
        const [categoryName, setCategoryName] = useState<string | undefined>("");
        const [selectedMonth, setSelectedMonth] = useState("");

        const { data: categoriesData, refetch } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
            variables: { passwordHash: passwordHash },
            onError: (error => {
                Alert.alert(error.message);
            }),
        });

        useEffect(() => {
            setCategory(undefined);
            setSelectedCategory(category);
        }, [month]);

        const filteredCategoryData = useMemo(() => {
            return categoryData.slice().filter(x => !!x.category && x.amountSpent > 0);
        }, [categoryData]);

        const retrieveAmountSpent = () => {
            if (categoryData.map((data) => { data.category?.name === categoryName })) {

                setCategoryExpense(categoryData.find(e => e.category?.name === categoryName)?.amountSpent.toFixed(2));
            }

        }

        const percentOfTotal = () => {
            if (monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
                let totalSpent = monthlyBreakdownData.monthBreakdown.totalSpent;
                let categoryIndex = categoryData.findIndex(e => e.category?.name === categoryName);
                let currentCategorySpent = categoryData[categoryIndex].amountSpent;
                let delta = (currentCategorySpent) / (totalSpent);

                if (delta > 0) {
                    setPercent(Math.abs((100 * (delta))).toFixed(1) + "%");
                } else {
                    setPercent("");
                }
            }




        }


        function handleCategorySelect(categoryId: string | undefined) {
            console.log("I got into handleCategorySelect!");
            if (categoryId === '-1') setCategory({ id: -1, name: 'Uncategorized' })
            if (categoriesData?.categories.__typename == "CategoriesSuccess") {
                const foundCategory = categoriesData.categories.categories.find(x => x.id.toString() == categoryId);

                if (foundCategory !== undefined) {
                    setCategory(foundCategory);
                    setSelectedCategory(foundCategory);
                    setCategoryName(foundCategory.name);
                    retrieveAmountSpent();
                    percentOfTotal();
                }

                console.log(selectedCategory);
            }
        }

        return (
            <>
                <View style={staticStyles.graphContainer}>
                    <View style={{ position: "absolute", height: '100%', width: '100%', justifyContent: "center", alignItems: "center" }}>
                        <Text>{year}</Text>
                        <Text>{month}</Text>
                    </View>
                    <VictoryPie
                        padAngle={2}
                        labelRadius={135}
                        radius={({ datum }) => datum.category.name === category?.name ? 120 : 100}
                        innerRadius={({ datum }) => datum.category.name === category?.name ? 90 : 70}
                        data={
                            categoryData.map((data) => {
                                if (data.category === null) {
                                    return {
                                        amountSpent: data.amountSpent,
                                        category: {
                                            id: -1,
                                            name: "Uncategorized",
                                            colourHex: "757575",
                                        }
                                    }
                                } else {
                                    return data
                                }
                            }).filter((data) => data.amountSpent != 0)

                        }
                        labels={({ datum }) => (datum.category.name.length < 5) ? datum.category.name : datum.category.name.substring(0, 4) + "..."}
                        y={"amountSpent"}
                        width={900}
                        height={300}
                        style={{
                            data:
                                { fill: (d) => "#" + d.datum.category.colourHex }
                        }}
                        events={
                            [{
                                target: "data",
                                eventHandlers: {
                                    onPress: () => {
                                        return (
                                            [
                                                {
                                                    target: "data",
                                                    mutation: (props) => {
                                                        setCategory({ id: props.datum.category.id, name: props.datum.category.name });
                                                    }
                                                }
                                            ]
                                        );
                                    },
                                    onClick: () => {
                                        return (
                                            [
                                                {
                                                    target: "data",
                                                    mutation: (props) => {
                                                        setCategory({ id: props.datum.category.id, name: props.datum.category.name });
                                                    }
                                                }
                                            ]
                                        );
                                    }
                                }
                            }
                            ]}
                    />

                </View >
                {
                    categoryData.length !== 0 && <VictoryLegend
                        centerTitle={true}
                        orientation="horizontal"
                        colorScale={categoryData.map((data) => data.category ? "#" + data.category.colourHex : "gray")}
                        data={
                            categoryData.filter((data) => data.amountSpent != 0).map((data) => {
                                if (data.category === null) {
                                    return {
                                        name: "Uncategorized",
                                        symbol: {
                                            fill: "#757575",
                                        }
                                    }
                                } else {
                                    return {
                                        name: data.category?.name,
                                        symbol: {
                                            fill: "#" + data.category?.colourHex
                                        }
                                    }
                                }
                            })
                        }
                        itemsPerRow={3}
                        gutter={20}
                        height={100}
                    />
                }

                <DropdownField
                    label="Category"
                    placeholder="choose a category"
                    data={
                        [...filteredCategoryData.map(x => {
                            return { id: x.category?.id.toString() || '-2', value: x.category?.name || '' }
                        }), { id: '-1', value: 'Uncategorized' }]
                    }
                    onChange={handleCategorySelect}
                    cachedValue={category?.name} />
            </>
        );
    }

    return (
        <View style={staticStyles.screen}>
            <View>
                <ByCategory categoryData={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []} month={month} year={year}></ByCategory>
            </View>

            {
                selectedCategory !== undefined &&
                <>
                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>${categoryExpense}</Text>
                                <Text style={{ fontSize: 26 }}> spent on </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{selectedCategory?.name}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 50 }}>
                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>{percent}</Text>
                                <Text style={{ fontSize: 26 }}> of your {month.charAt(0) + month.substring(1, month.length).toLowerCase()} expenses</Text>
                            </Text>
                        </View>
                    </View>
                </>

            }
        </View >
    );

}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    graphContainer: {
        alignItems: 'center',
    }
})