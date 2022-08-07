import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend, VictoryStack } from "victory-native";
import ArrowButton from "../buttons/ArrowButton";
import { SliderButton } from "../buttons/SliderButton";
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
    data: GraphDatum[];
    onPressLeft?: () => void;
    onPressRight?: () => void;
}

const RenderGraph = ({ data, onPressLeft, onPressRight }: GraphParameters) => {
    const filteredData = data.map((ele, index) => {
        return {
            ...ele,
            id: index,
            shortCat: ele.category.name.substring(0, 5) + '..',
            amountUnplanned: ele.amountBudgeted === 0 ? ele.amountSpent : 0,
            amountPlanned: ele.amountBudgeted !== 0 ? ele.amountSpent : 0,
            zero: 0
        }
    });

    const [undefY, setUndefY] = useState<number | undefined>(100)
    //to combat Y being undefined at the start which caused an label error
    useEffect(() => {
        setUndefY(0)
        setTimeout(() => setUndefY(undefined), 100);
    }, [data])

    return (<>
        <VictoryChart>
            <VictoryAxis style={{ grid: { stroke: "none" } }} />
            <VictoryGroup offset={20}>
                <VictoryStack colorScale={['#4477aa', '#4477aa']}
                    labelComponent={<VictoryLabel y={undefY} dx={-20} />}>
                    <VictoryBar
                        categories={{ x: filteredData.map(ele => ele.shortCat) }}
                        barWidth={20}
                        data={filteredData.map(ele => {
                            return {
                                x: ele.shortCat,
                                y: ele.amountBudgeted,
                                label: ele.amountBudgeted ? '$' + ele.amountBudgeted.toFixed(2) : null
                            }
                        })} />
                    <VictoryBar
                        categories={{ x: filteredData.map(ele => ele.shortCat) }}
                        barWidth={20}
                        data={filteredData.map(ele => {
                            return {
                                x: ele.shortCat,
                                y: ele.zero
                            }
                        })} />
                </VictoryStack>
                <VictoryStack colorScale={['#aa3377', '#e0b4cd']}
                    labelComponent={<VictoryLabel y={undefY} dx={20} />}>
                    <VictoryBar
                        categories={{ x: filteredData.map(ele => ele.shortCat) }}
                        name="bar-1"
                        barWidth={20}
                        data={filteredData.map(ele => {
                            return {
                                x: ele.shortCat,
                                y: ele.amountPlanned
                            }
                        })} />
                    <VictoryBar
                        categories={{ x: filteredData.map(ele => ele.shortCat) }}
                        name="bar-2"
                        barWidth={20}
                        data={filteredData.map(ele => {
                            return {
                                x: ele.shortCat,
                                y: ele.amountUnplanned,
                                label: ele.amountSpent ? '$' + ele.amountSpent.toFixed(2) : null,
                            }
                        })} />
                </VictoryStack>
            </VictoryGroup>
        </VictoryChart>
        <View style={styles.leftSliderContainer}>
            <SliderButton direction="left" size={40} onPress={onPressLeft} />
        </View>
        <View style={styles.rightSliderContainer}>
            <SliderButton direction="right" size={40} onPress={onPressRight} />
        </View>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <VictoryLegend
                height={55}
                colorScale={['#4477aa', '#aa3377', '#e0b4cd']}
                data={[{ name: 'Budgeted' }, { name: 'Planned Expenses' }, { name: 'Unplanned Expenses' }]}
                width={320}
                orientation="horizontal"
                itemsPerRow={2}
                padding={20}
                gutter={0} />
        </View>
    </>)
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

    const showArrows = inputData.length > displayAmountNumber
    return (<View>

        <View style={{ flexDirection: 'row', width: "100%" }}>
            <View style={{ flex: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <RenderGraph data={inputData.length <= displayAmountNumber ? inputData :
                        sliceEnd + displayAmountNumber > inputData.length ? inputData.slice(sliceEnd).concat(
                            (inputData.slice(0, (sliceEnd + displayAmountNumber) - (inputData.length)))
                        ) :
                            inputData.slice(sliceEnd, sliceEnd + displayAmountNumber)
                    }
                        onPressLeft={() => {
                            const newSpot = sliceEnd - jumpAmountNumber
                            setSliceEnd(newSpot < 0 ? newSpot + inputData.length : newSpot)
                        }}
                        onPressRight={() => {
                            const newSpot = sliceEnd + jumpAmountNumber
                            setSliceEnd(newSpot % inputData.length)
                        }} />
                </View>
            </View>
        </View>
    </View >)
}

const styles = StyleSheet.create({
    leftSliderContainer: {
        position: 'absolute',
        top: 245,
        left: 8,
    },
    rightSliderContainer: {
        position: 'absolute',
        top: 245,
        right: 8,
    },
});

export default MonthlyVsBudgetedCategory;