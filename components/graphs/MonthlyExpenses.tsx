import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TouchableHighlight } from "react-native";
import { EventCallbackInterface, StringOrNumberOrList } from "victory-core";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

interface MonthlyDatum {
    month: string,
    year: number,
    amountSpent: number,
    id?: number,
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
                    if (mutations.length !== 0) {
                        setMutations([])
                    }
                }
            },
            {
                eventKey: "all",
                target: "labels",
                mutation: (props: any) => {
                    if (id === props.datum.id) {
                        return { text: props.datum.amountSpent.toFixed(2) }
                    } else {
                        return { text: "" }
                    }
                },
                callback: () => {
                    if (mutations.length !== 0) {
                        setMutations([])
                    }
                }
            }
        ])
    }

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
            {/* <VictoryAxis
                style={{
                    grid: { stroke: "none" },
                }}
                dependentAxis={true}
            /> */}
            <VictoryAxis
                style={{
                    grid: { stroke: "none" },
                }}
            />
            <VictoryBar
                externalEventMutations={mutations as unknown as EventCallbackInterface<string | string[], StringOrNumberOrList>[]}
                name="Bar-1"
                data={data}
                x={(d: any) => { return d?.month.slice(0, 3) }}
                y="amountSpent"
                labels={({ datum }) => datum.amountSpent}
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

const monthlyExpenses = ({ displayAmount, jumpAmount, data, monthSelector, yearSelector }: MonthlyExpenses) => {
    const displayAmountNumber = displayAmount ? displayAmount : 5
    const jumpAmountNumber = jumpAmount ? jumpAmount : 3
    const inputData = data.map((ele, index) => { return { ...ele, id: index } })
    const [sliceEnd, setSliceEnd] = useState(inputData.length - displayAmountNumber)

    useEffect(
        () => {
            setSliceEnd(inputData.length - displayAmountNumber)
        }
        , [data])


    useEffect(
        () => {
            const indexOfFoundSelectedTime = data.findIndex(ele => {
                return ele.month == monthSelector && ele.year == yearSelector
            })
            if (indexOfFoundSelectedTime != -1) {
                setSliceEnd(Math.max(0, Math.min(data.length - displayAmountNumber,
                    indexOfFoundSelectedTime - Math.floor(displayAmountNumber / 2))))
            }
        }, [monthSelector, yearSelector])


    return (<>
        <View style={{ flexDirection: 'row' }}>
            {/* <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end" }}>
                <HeaderButton direction="left" marginLeft={10} onPress={() => {
                    setSliceEnd(Math.max(0, sliceEnd - jumpAmountNumber))
                }} />
            </View> */}
            <View style={{ flex: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MonthlyExpenseGraph
                    data={inputData.length <= displayAmountNumber ? inputData :
                        inputData.slice(sliceEnd, sliceEnd + displayAmountNumber)} />
            </View>
            {/* <View style={{ flexBasis: 50, zIndex: 10, justifyContent: "flex-end" }}>
                <HeaderButton direction="right" marginLeft={10} onPress={() => {
                    setSliceEnd(Math.min(inputData.length - displayAmountNumber, sliceEnd + jumpAmountNumber))
                }} />
            </View> */}
        </View>

    </>)

}

export default monthlyExpenses;