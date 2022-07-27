import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { View, Text } from "react-native";
import Svg from "react-native-svg";
import { VictoryChart, VictoryLabel, VictoryLegend, VictoryPie } from "victory-native";
import { useAuth } from "../../hooks/useAuth";
import { useRefresh } from "../../hooks/useRefresh";
import { Category, GetCategoriesDocument, GetCategoriesQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery, MonthBreakdown, MonthBreakdownCategory } from "../generated";

type byCategoryProps = {
    categoryData: MonthBreakdownCategory[];
    month: string;
    year: number;
}

export default function byCategory({ categoryData, month, year }: byCategoryProps) {

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
                        })

                    }
                    labels={({ datum }) => datum.category.name.substring(0, 3) + "..."}
                    y={"amountSpent"}
                    colorScale={categoryData.map((data) => data.category ? "#" + data.category.colourHex : "gray")}
                    width={900}
                    height={200}
                    events={
                        [{
                            target: "data",
                            eventHandlers: {
                                onClick: () => {
                                    return (
                                        {
                                            target: "labels",
                                            mutation: (props) => {
                                                console.log(props);
                                                return props.text === "$" + props.datum.amountSpent ? null : { text: "$" + props.datum.amountSpent.toFixed(2) };
                                            }
                                        }
                                    );
                                }
                            }
                        }]}
                />

            </View>
            <VictoryLegend
                centerTitle={true}
                orientation="horizontal"
                colorScale={categoryData.map((data) => data.category ? "#" + data.category.colourHex : "gray")}
                data={
                    categoryData.map((data) => {
                        if (data.category === null) {
                            return {
                                name: "Uncategorized",
                                symbol: {
                                    fill: "#757575",
                                }
                            }
                        }
                        else {
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
            />
        </View>



        // <View>
        //     <VictoryPie
        //         padAngle={({ datum }) => datum.y}
        //         innerRadius={100}
        //         data={
        //             [

        //             ]
        //         }

        //     />
        // </View>
    );

}