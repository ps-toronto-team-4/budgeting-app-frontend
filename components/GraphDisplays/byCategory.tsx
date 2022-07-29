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
                        return props.radius === 100 ? { radius: 120, innerRadius: 90, labelRadius: 120 } : { radius: 100, innerRadius: 70 };
                    } else {
                        return props = { radius: 100, innerRadius: 70 }
                    }

                },
                callback: () => {
                    if (mutations.length === 0) {
                        // console.log("I was in callback.")
                        setMutations([])
                    }
                }
            },
            {
                eventKey: "all",
                target: "labels",
                mutation: (props: any) => {
                    if (id === props.datum.category.id) {
                        return props.text === props.datum.category.name.substring(0, 3) + "..." ? { text: "$" + props.datum.amountSpent.toFixed(2) } : { text: props.datum.category.name.substring(0, 3) + "..." }
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
                setCategory(foundCategory);
                setMutations([]);
                handleCategory(foundCategory.id);
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
                                        colourHex: "#757575",
                                    }
                                }
                            } else {
                                return data
                            }
                        }).filter((data) => data.amountSpent != 0)

                    }
                    labels={({ datum }) => datum.category.name.substring(0, 3) + "..."}
                    y={"amountSpent"}
                    colorScale={categoryData.map((data) => data.category ? "#" + data.category.colourHex : "gray")}
                    width={900}
                    height={300}
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
                categoryData != [] && <VictoryLegend
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
            <GraphDropdownRow
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
            ></GraphDropdownRow>

        </View>


    );

}