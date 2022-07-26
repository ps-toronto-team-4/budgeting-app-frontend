import React, { useState } from "react";
import { View, Button } from "react-native";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

interface MonthlyExpenseGraphProps {
    data: any
}

const dumpy = [
    { year: '2011-10', earnings: 13000, month: "JAN" },
    { year: '2011-11', earnings: 16500, month: "FEB" },
    { year: '2011-12', earnings: 14250, month: "MAR" },
    { year: '2012-01', earnings: 19000, month: "APR" },
    { year: '2012-01', earnings: 16000, month: "MAY" },
    { year: '2012-01', earnings: 14000, month: "JUN" },
    { year: '2012-01', earnings: 12000, month: "JUL" },
    { year: '2012-01', earnings: 16000, month: "AUG" },
    { year: '2012-01', earnings: 14000, month: "SEP" },
    { year: '2012-01', earnings: 17000, month: "OCT" },
    { year: '2012-01', earnings: 21000, month: "NOV" },
    { year: '2012-01', earnings: 19000, month: "DEC" },
];

const MonthlyExpenseGraph = ({ data }: MonthlyExpenseGraphProps) => {

    // const [data, setData] = useState(dumpy)


    return (<View>
        <VictoryChart width={350} theme={VictoryTheme.material} domainPadding={20}>
            <VictoryBar
                data={data}
                x="month"
                y="earnings"
                animate={{
                    onLoad: { duration: 1000 },
                    duration: 500,
                    easing: "bounce"
                }}

            />
        </VictoryChart>

    </View>)
}

interface MonthlyExpenses {
    displayAmount?: number,
    jumpAmount?: number,
    data: any
}

const monthlyExpenses = ({ displayAmount, jumpAmount, data }: MonthlyExpenses) => {
    const displayAmountNumber = displayAmount ? displayAmount : 5
    const jumpAmountNumber = jumpAmount ? jumpAmount : 3
    const [sliceEnd, setSliceEnd] = useState(dumpy.length - displayAmountNumber)

    const inputData = data ? data : dumpy


    return (<>
        <MonthlyExpenseGraph
            data={inputData.length <= displayAmountNumber ? inputData :
                inputData.slice(sliceEnd, sliceEnd + displayAmountNumber)} />

        < Button title="Backwards" onPress={() => {
            setSliceEnd(Math.max(0, sliceEnd - jumpAmountNumber))
        }}></Button >

        < Button title="Forwards" onPress={() => {
            setSliceEnd(Math.min(inputData.length - displayAmountNumber, sliceEnd + jumpAmountNumber))
        }}></Button >
    </>)

}

export default monthlyExpenses;