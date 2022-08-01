import { useState } from "react";
import { View, Text } from "react-native"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup } from "victory-native";
import ArrowButton from "../ArrowButton";




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
            shortCat: ele.category.name.substring(0, 3) + '..'
        }
    })

    const onPressClickHandler = () => {
        return [{
            target: "data",
            mutation: (props: any) => {
                console.log(props.datum)
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
                x="shortMonth"
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
                x="shortMonth"
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
    displayAmount: number,
    jumpAmount: number,
    data: GraphDatum[]
}

const MonthlyVsBudgeted = ({ displayAmount, jumpAmount, data }: MonthlyVsBudgetedParameters) => {
    const displayAmountNumber = displayAmount ? displayAmount : 5
    const jumpAmountNumber = jumpAmount ? jumpAmount : 1
    const inputData = data

    const [sliceEnd, setSliceEnd] = useState(inputData.length - displayAmountNumber)



    return (<View>

        <View style={{ flexDirection: 'row' }}>
            <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end" }}>
                <ArrowButton direction="left" marginLeft={10} onPress={() => {
                    setSliceEnd(Math.max(0, sliceEnd - jumpAmountNumber))
                }} />
            </View>
            <View style={{ flex: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <RenderGraph data={inputData.length <= displayAmountNumber ? inputData :
                    inputData.slice(sliceEnd, sliceEnd + displayAmountNumber)} />
            </View>

            <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end" }}>
                <ArrowButton direction="right" marginLeft={10} onPress={() => {
                    setSliceEnd(Math.min(inputData.length - displayAmountNumber, sliceEnd + jumpAmountNumber))
                }} />
            </View>
        </View>
    </View >)
}

export default MonthlyVsBudgeted;