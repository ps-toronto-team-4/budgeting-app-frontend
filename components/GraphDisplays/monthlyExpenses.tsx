import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import { EventCallbackInterface, StringOrNumberOrList } from "victory-core";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

interface MonthlyDatum {
    month: string,
    year: number,
    amount: number,
    id: number,
}

interface MonthlyExpenseGraphProps {
    data: MonthlyDatum[]
    monthSelectedCallback?: (datum: MonthlyDatum) => null,
    mainColour?: string,
    highlightColour?: string,
}

interface ExteralMutation {
    target: string,
    eventKey: string,
    mutation: Function,
    callback: Function
}

const dumpy = [
    { year: '2011-10', amount: 13000, month: "JAN", id: 1 },
    { year: '2011-11', amount: 16500, month: "FEB", id: 2 },
    { year: '2011-12', amount: 14250, month: "MAR", id: 3 },
    { year: '2012-01', amount: 19000, month: "APR", id: 4 },
    { year: '2012-01', amount: 16000, month: "MAY", id: 5 },
    { year: '2012-01', amount: 14000, month: "JUN", id: 6 },
    { year: '2012-01', amount: 12000, month: "JUL", id: 7 },
    { year: '2012-01', amount: 16000, month: "AUG", id: 8 },
    { year: '2012-01', amount: 14000, month: "SEP", id: 9 },
    { year: '2012-01', amount: 17000, month: "OCT", id: 10 },
    { year: '2012-01', amount: 21000, month: "NOV", id: 11 },
    { year: '2012-01', amount: 19000, month: "DEC", id: 12 },
];

const MonthlyExpenseGraph = ({ data, monthSelectedCallback, mainColour, highlightColour }: MonthlyExpenseGraphProps) => {

    const [mutations, setMutations] = useState<Array<ExteralMutation>>([])
    const [selectedMonth, setSelectedMonth] = useState(undefined)

    useEffect(() => {
        handleClick(selectedMonth ? selectedMonth : -1)
    }, [data])

    const handleClick = (id: number) => {
        setMutations([
            {
                target: "data",
                eventKey: "all",
                mutation: (props: any) => {
                    if (id == props.datum.id) {
                        return {
                            barRatio: 1,
                            text: 'hi',
                            style: {
                                fill: highlightColour ? highlightColour : "#3dbf60",
                                text: 'bye'
                            }
                        }
                    } else {
                        return {
                            barRatio: 0.5,
                            style: {
                                fill: highlightColour ? highlightColour : "#2e8f48"
                            }
                        }
                    }
                },
                callback: () => {
                    if (mutations !== []) {
                        setMutations([])
                    }
                }
            }
        ])
    }

    // const [data, setData] = useState(dumpy)


    return (<View>
        <VictoryChart
            width={350}
            theme={VictoryTheme.material}
            domainPadding={20}>
            <VictoryAxis
                style={{
                    grid: { stroke: "none" },
                }}
                dependentAxis={true}
            />
            <VictoryAxis
                style={{
                    grid: { stroke: "none" },
                }}
            // dependentAxis={true}
            />
            <VictoryBar
                externalEventMutations={mutations as unknown as EventCallbackInterface<string | string[], StringOrNumberOrList>[]}
                name="Bar-1"
                data={data}
                x="month"
                y="amount"
                // animate={{
                //     onLoad: { duration: 1000 },
                //     duration: 500,
                //     easing: "bounce"
                // }}
                barRatio={0.5}
                style={{ data: { fill: mainColour ? mainColour : "#2e8f48" } }}
                events={[
                    {
                        target: "data",
                        eventHandlers: {
                            onClick: () => {
                                return [{
                                    target: "data",
                                    mutation: (props) => {
                                        setSelectedMonth(props.datum.id)
                                        handleClick(props.datum.id)
                                        if (monthSelectedCallback !== undefined) {
                                            monthSelectedCallback(props.datum)
                                        }
                                        return null
                                    }
                                }];
                            }
                        }
                    }
                ]}
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