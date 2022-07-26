import { useQuery } from "@apollo/client";
import React from "react";
import { View, Text } from "react-native";
import Svg from "react-native-svg";
import { VictoryChart, VictoryLabel, VictoryLegend, VictoryPie } from "victory-native";
import { useAuth } from "../../hooks/useAuth";
import { useRefresh } from "../../hooks/useRefresh";
import { Category, GetCategoriesDocument, GetCategoriesQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery, MonthBreakdown, MonthBreakdownCategory } from "../generated";

type byCategoryProps = {
    CategoryData: MonthBreakdownCategory[];
    Month: string;
    Year: number;
}

export default function byCategory({ CategoryData, Month, Year }: byCategoryProps) {

    const passwordHash = useAuth();
    const [month, setMonth] = React.useState("JULY");
    const [year, setYear] = React.useState("2022");
    const listOfAmountAndCategories: MonthBreakdownCategory[] = [];
    const listofCategories: Category[] = [];
    const [listofMonthNames, setListOfMonthNames] = React.useState([]);

    const { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch } = useQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument,
        { variables: { passwordHash: passwordHash, month: month, year: year } }
    )

    const { loading: categoriesLoading, data: categoriesData, refetch: categoriesRefetch } = useQuery<GetCategoriesQuery>(GetCategoriesDocument,
        {
            variables: { passwordHash: passwordHash }
        })

    useRefresh(() => {
        monthlyBreakdownRefetch();
    }, [passwordHash]);

    function getMonthNames() {
        if (categoriesData?.categories.__typename === "CategoriesSuccess") {

        }
    }

    // Function to get Month Names in an array format for categories attribute

    // Constant to return data dynamically so that I do not have to manually insert each data point 
    // (returns {x: Name, y: Value, fill: "#colorHex", label: "$" + Value})

    return (

        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View>
                <View style={{ position: "absolute", height: '100%', width: '100%', justifyContent: "center", alignItems: "center" }}>
                    <Text>{year}</Text>
                    <Text>{month}</Text>
                </View>
                <VictoryPie
                    padAngle={3}
                    innerRadius={100}
                    data={
                        CategoryData.map((data) => {
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
                    x={"category.name"}
                    y={"amountSpent"}
                    colorScale={CategoryData.map((data) => data.category ? "#" + data.category.colourHex : "gray")}
                    width={600}
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
                colorScale={CategoryData.map((data) => data.category ? "#" + data.category.colourHex : "gray")}
                data={
                    CategoryData.map((data) => {
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
                gutter={50}
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