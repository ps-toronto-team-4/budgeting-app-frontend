import { useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import { VictoryLegend, VictoryPie } from "victory-native";
import { EventCallbackInterface, StringOrNumberOrList } from "victory-core";
import { useAuth } from "../../hooks/useAuth";
import { RootStackScreenProps } from "../../types";
import { GetCategoriesDocument, GetCategoriesQuery, MonthBreakdownCategory } from "../generated";
import { DropdownRow } from "../forms/DropdownRow";
import { DropdownField, DropdownItem } from "../forms/DropdownField";

type byCategoryProps = {
    categoryData: MonthBreakdownCategory[];
    month: string;
    year: number;
    onChangeCategory?: (newCategory?: { id: number, name: string }) => void;
}

export default function ByCategory({ categoryData, month, year, onChangeCategory }: byCategoryProps, { navigation }: RootStackScreenProps<'CreateMerchant'>) {
    const passwordHash = useAuth();
    const [category, setCategory] = useState<{ id: number, name: string }>();
    const [selectedMonth, setSelectedMonth] = useState("");

    const { data: categoriesData, refetch } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
        variables: { passwordHash: passwordHash },
        onError: (error => {
            Alert.alert(error.message);
        }),
    });

    useEffect(() => {
        setCategory(undefined);
    }, [month]);

    useEffect(() => {
        if (onChangeCategory) {
            onChangeCategory(category);
        }
    }, [category])

    const filteredCategoryData = useMemo(() => {
        return categoryData.slice().filter(x => !!x.category && x.amountSpent > 0);
    }, [categoryData]);

    function handleCategorySelect(categoryId: string | undefined) {
        if (categoryId === '-1') setCategory({ id: -1, name: 'Uncategorized' })
        if (categoriesData?.categories.__typename == "CategoriesSuccess") {
            const foundCategory = categoriesData.categories.categories.find(x => x.id.toString() == categoryId);

            if (foundCategory !== undefined) {
                setCategory(foundCategory);
            }
        }
    }

    return (
        <>
            <View style={styles.graphContainer}>
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

const styles = StyleSheet.create({
    graphContainer: {
        alignItems: 'center',
    }
});
