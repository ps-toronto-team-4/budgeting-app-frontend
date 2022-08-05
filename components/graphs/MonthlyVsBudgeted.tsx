import { useEffect, useState } from "react";
import { View, Text } from "react-native"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryStack, VictoryLegend, VictoryLabel } from "victory-native";
import ArrowButton from "../buttons/ArrowButton";


interface GraphDatum {
    amountBudgeted: number,
    amountSpent: number,
    amountSpentPlanned: number,
    amountSpentUnplanned: number,
    month: string,
    year: number
}

interface GraphParameters {
    data: GraphDatum[]
}

const RenderGraph = ({ data }: GraphParameters) => {

    const filteredData = data.map((ele, index) => {
        return {
            ...ele,
            id: index,
            shortMonth: ele.month.substring(0, 3),
            zero: 0,
        }
    })


    const [undefY, setUndefY] = useState<number | undefined>(100)

    const onPressClickHandler = () => {
        return [{
            target: "data",
            mutation: (props: any) => {
                return null
            }
        }];
    }

    //to combat Y being undefined at the start which caused an label error
    useEffect(() => {
        setUndefY(0)
        setTimeout(() => setUndefY(undefined), 100);
    }, [data])

    return (
        <>
            <VictoryChart>
                <VictoryAxis
                    style={{
                        grid: { stroke: "none" },
                    }}
                />
                <VictoryGroup offset={20}
                >
                    <VictoryStack colorScale={['#aa3377', '#e0b4cd']}
                        labels={filteredData.map(ele => '$' + ele.amountSpent.toFixed(2))}
                        labelComponent={<VictoryLabel y={undefY} dx={-20} />}
                    >



                        <VictoryBar
                            categories={{ x: filteredData.map(ele => ele.shortMonth) }}
                            name="bar-1"
                            barWidth={20}
                            data={filteredData.map(ele => {
                                return {
                                    x: ele.shortMonth,
                                    y: ele.amountSpentPlanned
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
                            categories={{ x: filteredData.map(ele => ele.shortMonth) }}
                            name="bar-2"
                            barWidth={20}
                            data={filteredData.map(ele => {
                                return {
                                    x: ele.shortMonth,
                                    y: ele.amountSpentUnplanned,
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
                    <VictoryStack colorScale={['#008866', '#008866']}
                        labels={filteredData.map(ele => '$' + ele.amountBudgeted.toFixed(2))}
                        labelComponent={<VictoryLabel y={undefY} dx={20} />}
                    >


                        <VictoryBar
                            categories={{ x: filteredData.map(ele => ele.shortMonth) }}
                            barWidth={20}
                            data={filteredData.map(ele => {
                                return {
                                    x: ele.shortMonth,
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
                            categories={{ x: filteredData.map(ele => ele.shortMonth) }}
                            barWidth={20}
                            data={filteredData.map(ele => {
                                return {
                                    x: ele.shortMonth,
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
                        // labels={({ datum }) => datum.y.toFixed(2)}
                        />
                    </VictoryStack>
                </VictoryGroup>

            </VictoryChart>
            <VictoryLegend x={75} y={0}
                centerTitle={true}
                orientation="horizontal"
                itemsPerRow={2}
                gutter={20}
                height={60}
                style={{ border: { stroke: "black" } }}
                colorScale={["#aa3377", "#e0b4cd", "#008866"]}
                data={[
                    { name: "Planned Expense" }, { name: "Unplanned Expense" }, { name: "Budgeted" }
                ]}
            />
        </>)
}

interface MonthlyVsBudgetedParameters {
    displayAmount?: number,
    jumpAmount?: number,
    data: GraphDatum[],
    monthSelector?: string,
    yearSelector?: number,
}

const MonthlyVsBudgeted = ({ displayAmount, jumpAmount, data, monthSelector, yearSelector }: MonthlyVsBudgetedParameters) => {
    const displayAmountNumber = displayAmount ? displayAmount : 5
    const jumpAmountNumber = jumpAmount ? jumpAmount : 3
    const inputData = data

    const [sliceEnd, setSliceEnd] = useState(inputData.length - displayAmountNumber)


    useEffect(
        () => {
            const indexOfFoundSelectedTime = data.findIndex(ele => {
                return ele.month == monthSelector && ele.year == yearSelector
            })
            if (indexOfFoundSelectedTime != -1) {
                setSliceEnd(Math.max(0, Math.min(data.length - displayAmountNumber,
                    indexOfFoundSelectedTime - Math.floor(displayAmountNumber / 2))))
            }
        }, [monthSelector, yearSelector, data])

    const showArrows = inputData.length > displayAmountNumber

    return (<View>

        <View style={{ flexDirection: 'row', width: "100%" }}>
            <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end", paddingBottom: 55 }}>
                {showArrows && sliceEnd !== 0 && <ArrowButton direction="left" marginLeft={10} onPress={() => {
                    setSliceEnd(Math.max(0, sliceEnd - jumpAmountNumber))
                }} />}
            </View>
            <View style={{ flex: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <RenderGraph data={inputData.length <= displayAmountNumber ? inputData :
                        inputData.slice(sliceEnd, sliceEnd + displayAmountNumber)} />
                </View>
            </View>

            <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end", paddingBottom: 55 }}>
                {showArrows && sliceEnd != inputData.length - displayAmountNumber && <ArrowButton alignItems='flex-start' direction="right" marginLeft={0} onPress={() => {
                    setSliceEnd(Math.min(inputData.length - displayAmountNumber, sliceEnd + jumpAmountNumber))
                }} />}
            </View>
        </View>
    </View >)
}

export default MonthlyVsBudgeted;