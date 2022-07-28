import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
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
    { year: 2020, amount: 13000, month: "JAN", id: 1 },
    { year: 2020, amount: 16500, month: "FEB", id: 2 },
    { year: 2020, amount: 14250, month: "MAR", id: 3 },
    { year: 2020, amount: 19000, month: "APR", id: 4 },
    { year: 2020, amount: 16000, month: "MAY", id: 5 },
    { year: 2020, amount: 14000, month: "JUN", id: 6 },
    { year: 2020, amount: 12000, month: "JUL", id: 7 },
    { year: 2020, amount: 16000, month: "AUG", id: 8 },
    { year: 2020, amount: 14000, month: "SEP", id: 9 },
    { year: 2020, amount: 17000, month: "OCT", id: 10 },
    { year: 2020, amount: 21000, month: "NOV", id: 11 },
    { year: 2020, amount: 19000, month: "DEC", id: 12 },
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
                            label: 'hi',
                            style: {
                                fill: highlightColour ? highlightColour : "#3dbf60",
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
            },
            {
                eventKey: "all",
                target: "labels",
                mutation: (props: any) => {
                    if (id === props.datum.id) {
                        return { text: props.datum.amount.toFixed(2) }
                    } else {
                        return { text: "" }
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

    const onPressClickHandler = () => {
        return [{
            target: "data",
            mutation: (props: any) => {
                setSelectedMonth(props.datum.id)
                handleClick(props.datum.id)
                if (monthSelectedCallback !== undefined) {
                    monthSelectedCallback(props.datum)
                }
                return null
            }
        }];
    }

    return (<View>
        {/* <Svg height={400}> */}
        <VictoryChart
            width={400}
            theme={VictoryTheme.material}
            domainPadding={30}>
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
                labels={({ datum }) => datum.amount}
                barRatio={0.5}
                style={{ data: { fill: mainColour ? mainColour : "#2e8f48" } }}
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
        </VictoryChart>
        {/* </Svg> */}
    </View>)
}

interface MonthlyExpenses {
    displayAmount?: number,
    jumpAmount?: number,
    data: MonthlyDatum[]
}

//TODO - this is repeating in budget, make it is into a component and re-use it
interface HeaderButtonProps {
    direction: 'left' | 'right';
    onPress?: () => void;
    marginLeft?: number;
    marginRight?: number;
}

function HeaderButton({ direction, onPress, marginLeft, marginRight }: HeaderButtonProps) {
    return (
        <TouchableHighlight onPress={onPress} style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: marginLeft,
            marginRight: marginRight,
            width: 50,
            height: 50,
            borderRadius: 25,
        }} underlayColor="rgba(0,0,0,0.2)">
            <AntDesign name={direction} size={32} color="black" />
        </TouchableHighlight>
    );
}

const monthlyExpenses = ({ displayAmount, jumpAmount, data }: MonthlyExpenses) => {
    const displayAmountNumber = displayAmount ? displayAmount : 5
    const jumpAmountNumber = jumpAmount ? jumpAmount : 3
    const [sliceEnd, setSliceEnd] = useState(dumpy.length - displayAmountNumber)

    const inputData = data ? data : dumpy as MonthlyDatum[]


    return (<>
        <MonthlyExpenseGraph
            data={inputData.length <= displayAmountNumber ? inputData :
                inputData.slice(sliceEnd, sliceEnd + displayAmountNumber)} />

        <View style={{ flexDirection: 'row', maxHeight: 50 }}>
            <View style={{ flexBasis: 50 }}>
                <HeaderButton direction="left" marginLeft={10} onPress={() => {
                    setSliceEnd(Math.max(0, sliceEnd - jumpAmountNumber))
                }} />
            </View>
            <View style={{ flex: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>stuff</Text>
            </View>

            <View style={{ flexBasis: 50 }}>
                <HeaderButton direction="right" marginLeft={10} onPress={() => {
                    setSliceEnd(Math.min(inputData.length - displayAmountNumber, sliceEnd + jumpAmountNumber))
                }} />
            </View>
        </View>

    </>)

}

export default monthlyExpenses;