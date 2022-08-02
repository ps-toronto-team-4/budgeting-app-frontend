import { useEffect, useState } from "react";
import { View, Text } from "react-native"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup } from "victory-native";
import ArrowButton from "../ArrowButton";
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
            shortCat: ele.category.name.substring(0, 5) + '..'
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
        <VictoryGroup offset={20}
            colorScale={['red', 'lime']}

        >

            <VictoryBar
                name="bar-1"
                barWidth={20}
                data={filteredData}
                y="amountSpent"
                x="shortCat"
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
                barWidth={20}
                data={filteredData}
                y="amountBudgeted"
                x="shortCat"
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