import { Text, View, StyleSheet, Alert } from "react-native";
import { RootStackScreenProps } from "../../types";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Category, GetBudgetsDocument, GetBudgetsQuery, GetCategoriesDocument, GetCategoriesQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, GetMonthTotalsDocument, GetMonthTotalsQuery, MonthBreakdownCategory, MonthType } from "../../components/generated";
import { useLazyQuery, useQuery } from "@apollo/client";
import Button from "../../components/buttons/Button";
import { DropdownRow } from "../../components/forms/DropdownRow";
import { VictoryLegend, VictoryPie } from "victory-native";
import { EventCallbackInterface, StringOrNumberOrList } from "victory-core";

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

    const RetrieveAmountSpent = (categoryData: MonthBreakdownCategory[], categoryName: string) => {
        if (categoryData.map((data) => { data.category?.name === categoryName })) {

            setCategoryExpense(categoryData.find(e => e.category?.name === categoryName)?.amountSpent.toFixed(2));
        }

    }

    const PercentOfTotal = ({ categoryData, categoryName }: PercentProps) => {
        if (monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown") {
            let totalSpent = monthlyBreakdownData.monthBreakdown.totalSpent;
            let categoryIndex = categoryData.findIndex(e => e.category?.name === categoryName);
            let currentCategorySpent = categoryData[categoryIndex].amountSpent;
            let delta = (currentCategorySpent) / (totalSpent);

            if (delta > 0) {
                setExisting(true);
                setPercent(Math.abs((100 * (delta))).toFixed(1) + "%");
            } else {
                setExisting(false);
                setPercent("");
            }
        }

        return (
            <Text style={{ fontWeight: 'bold' }}>{percent}</Text>
        );


    }


    const ByCategory = ({ categoryData, year, month }: ByCategoryProps) => {
        const passwordHash = useAuth();
        const [category, setCategory] = useState<{ id: number, name: string } | undefined>();
        const [categoryOpen, setCategoryOpen] = useState(false);
        const [mutations, setMutations] = useState<Array<ExternalMutation>>([])
        const [selectedMonth, setSelectedMonth] = useState("");


        const { data: categoriesData, refetch } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
            variables: { passwordHash: passwordHash },
            onError: (error => {
                Alert.alert(error.message);
            }),
        });




        const handleCategory = (id: number) => {
            setMutations([
                {
                    target: "data",
                    eventKey: "all",
                    mutation: (props: any) => {
                        if (id === props.datum.category.id) {
                            return props = { radius: 120, innerRadius: 90, labelRadius: 120 };
                        } else {
                            return props = { radius: 100, innerRadius: 70 }
                        }

                    },
                    callback: () => {
                        if (mutations.length === 0) {
                            setMutations([])
                        }
                    }
                },
                {
                    eventKey: "all",
                    target: "labels",
                    mutation: (props: any) => {
                        if (id === props.datum.category.id) {
                            return props = { text: "$" + props.datum.amountSpent.toFixed(2) };
                        } else {
                            return props = { text: props.datum.category.name.substring(0, 3) + "..." };
                        }


                    },
                    callback: () => {
                        if (mutations.length === 0) {
                            setMutations([])
                        }
                    }
                }
            ])
        }


        function handleCategorySelect(categoryName: string | undefined) {
            if (categoriesData?.categories.__typename == "CategoriesSuccess") {
                const foundCategory = categoriesData.categories.categories.find(x => x.name == categoryName);

                if (foundCategory !== undefined) {
                    handleCategory(foundCategory.id);
                    setSelectedMonth(month);
                    setCategory(foundCategory);
                    setSelectedCategory(foundCategory);
                    RetrieveAmountSpent(categoryData, foundCategory.name);
                }
            }
        }



        return (

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View>
                    <View style={{ position: "absolute", height: '100%', width: '100%', justifyContent: "center", alignItems: "center" }}>
                        <Text>{year}</Text>
                        <Text>{month}</Text>
                    </View>
                    <VictoryPie
                        padAngle={2}
                        labelRadius={135}
                        innerRadius={70}
                        data={
                            categoryData.map((data) => {
                                if (data.category === null) {
                                    return {
                                        amountSpent: data.amountSpent,
                                        category: {
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
                        externalEventMutations={mutations as EventCallbackInterface<string | string[], StringOrNumberOrList>[]}
                        events={
                            [{
                                target: "data",
                                eventHandlers: {
                                    onPressIn: () => {
                                        return (
                                            [{
                                                target: "labels",
                                                mutation: (props) => {
                                                    return props.text.charAt(0) === "$" ? null : { text: "$" + props.datum.amountSpent.toFixed(2) };
                                                }
                                            },
                                            {
                                                target: "data",
                                                mutation: (props) => {
                                                    return props.radius === 100 ? { radius: 120, innerRadius: 90 } : { radius: 100, innerRadius: 70 };
                                                }
                                            }
                                            ]
                                        );
                                    },
                                    onClick: () => {
                                        return (
                                            [{
                                                target: "labels",
                                                mutation: (props) => {
                                                    return props.text === "$" + props.datum.amountSpent ? null : { text: "$" + props.datum.amountSpent.toFixed(2) };
                                                }
                                            },
                                            {
                                                target: "data",
                                                mutation: (props) => {
                                                    return props.radius === 100 ? { radius: 120, innerRadius: 90, labelRadius: 120 } : { radius: 100 };
                                                }
                                            }
                                            ]
                                        );
                                    }
                                }
                            }
                            ]}
                    />

                </View>
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
                <DropdownRow
                    label="Category"
                    data={
                        categoriesData?.categories.__typename == "CategoriesSuccess" ?
                            categoriesData.categories.categories.map(x => { return { id: x.id, name: x.name } }) : []
                    }
                    onSelect={handleCategorySelect}
                    expanded={categoryOpen}
                    onExpand={() => setCategoryOpen(true)}
                    onCollapse={() => setCategoryOpen(false)}
                    topBorder
                    bottomBorder={!categoryOpen}
                    createLabel="Category"
                    defaultValue={category?.name}
                />

            </View>


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
                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                            <Text style={{ fontWeight: 'bold' }}>${categoryExpense}</Text>
                            <Text> spent on</Text>
                        </View>

                    </View>

                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                            <Text style={{ fontWeight: 'bold' }}>{selectedCategory?.name}</Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: "center", alignContent: 'center', paddingTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                            {
                                existing == true && <>
                                    <PercentOfTotal categoryData=
                                        {monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []}
                                        categoryName={selectedCategory.name} />
                                    <Text> of your {month.charAt(0) + month.substring(1, month.length).toLowerCase()} expenses</Text>

                                </>
                            }
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
})