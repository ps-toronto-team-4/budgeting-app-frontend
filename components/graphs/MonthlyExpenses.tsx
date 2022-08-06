import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TouchableHighlight } from "react-native";
import { EventCallbackInterface, StringOrNumberOrList } from "victory-core";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";
import ArrowButton from "../buttons/ArrowButton";

interface MonthlyDatum {
    month: string,
    year: number,
    amountSpent: number,
    id?: number,
}

interface MonthlyExpenseGraphProps {
    data: MonthlyDatum[]
    mainColour?: string,
    highlightColour?: string,
}

const MonthlyExpenseGraph = ({ data, mainColour }: MonthlyExpenseGraphProps) => {
    return (<View>
        <VictoryChart
            width={400}
            theme={VictoryTheme.material}
            domainPadding={30}>
            <VictoryAxis
                style={{
                    grid: { stroke: "none" },
                }}
            />
            <VictoryBar
                name="Bar-1"
                data={data}
                x={(d: any) => { return d?.month.slice(0, 3) }}
                y="amountSpent"
                labels={({ datum }) => datum.amountSpent.toFixed(2)}
                barRatio={0.5}
                style={{ data: { fill: mainColour ? mainColour : "#2e8f48" } }}
            />
        </VictoryChart>
    </View>)
}

interface MonthlyExpenses {
    displayAmount?: number,
    jumpAmount?: number,
    data: MonthlyDatum[],
    monthSelector?: string,
    yearSelector?: number,
}

//TODO - this is repeating in budget, make it is into a component and re-use it
interface HeaderButtonProps {
    direction: 'left' | 'right';
    onPress?: () => void;
    marginLeft?: number;
    marginRight?: number;
}

const monthlyExpenses = ({ displayAmount, jumpAmount, data, monthSelector, yearSelector }: MonthlyExpenses) => {
    const displayAmountNumber = displayAmount ? displayAmount : 5
    const jumpAmountNumber = jumpAmount ? jumpAmount : 3
    const inputData = data.map((ele, index) => { return { ...ele, id: index } })
    const [sliceEnd, setSliceEnd] = useState<number>(inputData.length - displayAmountNumber)


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
    return (<>
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end" }}>
                {showArrows && sliceEnd !== 0 && <ArrowButton direction="left" marginLeft={10} onPress={() => {
                    setSliceEnd(Math.max(0, sliceEnd - jumpAmountNumber))
                }} />}
            </View>
            <View style={{ flex: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MonthlyExpenseGraph
                    data={inputData.length <= displayAmountNumber ? inputData :
                        inputData.slice(sliceEnd, sliceEnd + displayAmountNumber)} />
            </View>
            <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end" }}>
                {showArrows && sliceEnd != inputData.length - displayAmountNumber && <ArrowButton alignItems="flex-start" direction="right" marginLeft={0} onPress={() => {
                    setSliceEnd(Math.min(inputData.length - displayAmountNumber, sliceEnd + jumpAmountNumber))
                }} />}
            </View>
        </View>

    </>)

}

export default monthlyExpenses;