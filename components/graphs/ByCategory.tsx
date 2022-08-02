import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { VictoryLegend, VictoryPie } from "victory-native";
import { EventCallbackInterface, StringOrNumberOrList } from "victory-core";
import { useAuth } from "../../hooks/useAuth";
import { RootStackScreenProps } from "../../types";
import Button from "../Button";
import { GetCategoriesDocument, GetCategoriesQuery, MonthBreakdownCategory } from "../generated";
import { GraphDropdownRow } from "../GraphDropdownRow";
import { DropdownRow } from "../DropdownRow";

type byCategoryProps = {
    categoryData: MonthBreakdownCategory[];
    month: string;
    year: number;
}

interface ExternalMutation {
    target: string,
    eventKey: string,
    mutation: Function,
    callback: Function
}

export default function ByCategory({ categoryData, month, year }: byCategoryProps, { navigation }: RootStackScreenProps<'CreateMerchant'>) {

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

    useEffect(() => {
        if (month !== selectedMonth) {
            console.log("Clearing mutations.")
            clearMutations();
        }
    }, [categoryData])

    const clearMutations = () => {
        setMutations([
            {
                target: "data",
                eventKey: "all",
                mutation: (props: any) => {
                    return props = { radius: 100, innerRadius: 70 }
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
                    return props = { text: props.datum.category.name.substring(0, 3) + "..." };
                },
                callback: () => {
                    if (mutations.length === 0) {
                        setMutations([])
                    }
                }
            }
        ])
    }

    const handleCategory = (id: number) => {
        setMutations([
            {
                target: "data",
                eventKey: "all",
                mutation: (props: any) => {
                    if (id === props.datum.category.id) {
                        console.log(id + " AND " + props.datum.category.id);
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

    const onPressClickHandler = () => {
        return [{
            target: "data",
            mutation: (props: any) => {
                handleCategory(props.datum.category.id);
                return null;
            }
        }]
    }

    function handleCategorySelect(categoryName: string | undefined) {
        console.log("I got into handleCategorySelect after clicking on category");
        if (categoriesData?.categories.__typename == "CategoriesSuccess") {
            const foundCategory = categoriesData.categories.categories.find(x => x.name == categoryName);

            if (foundCategory !== undefined) {
                console.log(foundCategory?.name);
                handleCategory(foundCategory.id);
                setSelectedMonth(month);
                setCategory(foundCategory);
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
                onSelect={month === selectedMonth ? handleCategorySelect : (name: string) => { }}
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