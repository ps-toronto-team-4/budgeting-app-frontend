import { useEffect, useState } from "react";
import { View, Text } from "react-native"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLegend, VictoryStack } from "victory-native";
import ArrowButton from "../buttons/ArrowButton";
import { Budget, BudgetCategory } from "../generated";




interface GraphDatum {
    "amountSpent": number,
    "amountBudgeted": number,
    "category": {
        "colourHex": string,
        "name": string
    }
}

interface GraphParameters {
    data: GraphDatum[]
}

const RenderGraph = ({ data }: GraphParameters) => {

    const filteredData = data.map((ele, index) => {
        return {
            ...ele,
            id: index,
            shortCat: ele.category.name.substring(0, 5) + '..',
            amountUnplanned: ele.amountBudgeted === 0 ? ele.amountSpent : 0,
            amountPlanned: ele.amountBudgeted !== 0 ? ele.amountSpent : 0,
            zero: 0
        }
    })

    const onPressClickHandler = () => {
        return [{
            target: "data",
            mutation: (props: any) => {
                return null
            }
        }];
    }

    return (<VictoryChart>
        <VictoryAxis
            style={{
                grid: { stroke: "none" },
            }}
        />
        <VictoryLegend x={25} y={10}
            orientation="horizontal"
            gutter={20}
            style={{ border: { stroke: "black" } }}
            colorScale={["#aa3377", "#e0b4cd", "#008866"]}
            data={[
                { name: "Planned Expense" }, { name: "Unplanned Expense" }, { name: "Budgeted" }
            ]}
        />
        <VictoryGroup offset={20}
        >
            <VictoryStack colorScale={['#aa3377', '#e0b4cd']}>


                <VictoryBar
                    categories={{ x: filteredData.map(ele => ele.shortCat) }}
                    name="bar-1"
                    barWidth={20}
                    data={filteredData.map(ele => {
                        return {
                            x: ele.shortCat,
                            y: ele.amountPlanned
                        }
                    })}
                    events={[
                        {
                            target: "data",
                            eventHandlers: {
                                onClick: onPressClickHandler,
                                onPressIn: onPressClickHandler,

                            }
                        }
                    ]}

                />
                <VictoryBar
                    categories={{ x: filteredData.map(ele => ele.shortCat) }}
                    name="bar-2"
                    barWidth={20}
                    data={filteredData.map(ele => {
                        return {
                            x: ele.shortCat,
                            y: ele.amountUnplanned
                        }
                    })}
                    events={[
                        {
                            target: "data",
                            eventHandlers: {
                                onClick: onPressClickHandler,
                                onPressIn: onPressClickHandler,

                            }
                        }
                    ]}

                />
            </VictoryStack>
            <VictoryStack colorScale={['#008866', '#008866']}>


                <VictoryBar
                    categories={{ x: filteredData.map(ele => ele.shortCat) }}
                    barWidth={20}
                    data={filteredData.map(ele => {
                        return {
                            x: ele.shortCat,
                            y: ele.amountBudgeted
                        }
                    })}
                    events={[
                        {
                            target: "data",
                            eventHandlers: {
                                onClick: onPressClickHandler,
                                onPressIn: onPressClickHandler,

                            }
                        }
                    ]}

                />
                <VictoryBar
                    categories={{ x: filteredData.map(ele => ele.shortCat) }}
                    barWidth={20}
                    data={filteredData.map(ele => {
                        return {
                            x: ele.shortCat,
                            y: ele.zero
                        }
                    })}
                    events={[
                        {
                            target: "data",
                            eventHandlers: {
                                onClick: onPressClickHandler,
                                onPressIn: onPressClickHandler,

                            }
                        }
                    ]}
                />
            </VictoryStack>
        </VictoryGroup>
    </VictoryChart>)
}

interface MonthlyVsBudgetedParameters {
    displayAmount?: number,
    jumpAmount?: number,
    data: {
        "amountSpent": number,
        "category"?: {
            "colourHex": string,
            "name": string
        } | null
    }[],
    budgetReferenceData: Budget | undefined,
}

const MonthlyVsBudgetedCategory = ({ displayAmount, jumpAmount, data, budgetReferenceData }: MonthlyVsBudgetedParameters) => {
    const displayAmountNumber = displayAmount ? displayAmount : 5
    const jumpAmountNumber = jumpAmount ? jumpAmount : 3
    const inputData = data.map((ele, index) => {
        const curCat = ele.category?.name
        const curBud: BudgetCategory | undefined = budgetReferenceData?.budgetCategories?.find(ele => ele.category.name == curCat)
        return {
            amountSpent: ele.amountSpent,
            category: ele.category ? ele.category : {
                colourHex: "gray",
                name: "Uncategorized"
            },
            index,
            amountBudgeted: curBud ? curBud.amount : 0
        }
    }) as GraphDatum[]

    const [sliceEnd, setSliceEnd] = useState(inputData.length - displayAmountNumber)

    useEffect(
        () => {
            setSliceEnd(inputData.length - displayAmountNumber)
        }
        , [data])


    return (<View>

        <View style={{ flexDirection: 'row' }}>
            <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end" }}>
                <ArrowButton direction="left" marginLeft={10} onPress={() => {
                    const newSpot = sliceEnd - jumpAmountNumber
                    setSliceEnd(newSpot < 0 ? newSpot + inputData.length : newSpot)
                }} />
            </View>
            <View style={{ flex: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <RenderGraph data={inputData.length <= displayAmountNumber ? inputData :
                    sliceEnd + displayAmountNumber > inputData.length ? inputData.slice(sliceEnd).concat(
                        (inputData.slice(0, (sliceEnd + displayAmountNumber) - (inputData.length)))
                    ) :
                        inputData.slice(sliceEnd, sliceEnd + displayAmountNumber)


                } />
            </View>

            <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end" }}>
                <ArrowButton direction="right" marginLeft={10} onPress={() => {
                    const newSpot = sliceEnd + jumpAmountNumber
                    setSliceEnd(newSpot % inputData.length)
                }} />
            </View>
        </View>
    </View >)
}

export default MonthlyVsBudgetedCategory;