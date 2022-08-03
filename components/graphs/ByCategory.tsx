import React from "react";
import { View, Text } from "react-native";
import { VictoryLegend, VictoryPie } from "victory-native";
import { useAuth } from "../../hooks/useAuth";
import { MonthBreakdownCategory } from "../generated";

type byCategoryProps = {
    categoryData: MonthBreakdownCategory[];
    month: string;
    year: number;
}

export default function ByCategory({ categoryData, month, year }: byCategoryProps) {

    const passwordHash = useAuth();


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
                                                return props.radius === 100 ? { radius: 120, innerRadius: 90 } : { radius: 100 };
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
                    height={200}
                />
            }

        </View>


    );

}