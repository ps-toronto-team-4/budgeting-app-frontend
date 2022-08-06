import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryStack } from "victory-native";
import { MONTHS_ORDER } from "../../../constants/Months";
import { MonthType } from "../../generated";
import { SliderButton } from "../../buttons/SliderButton"

export type ExpensesByMonthDatum = { month: MonthType, amount: number };

type DomainEnd = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

function calcDomainEnd(month: MonthType): DomainEnd {
    return (
        MONTHS_ORDER.indexOf(month) < 3
            ? 5
            : MONTHS_ORDER.indexOf(month) > 8
                ? 12
                : MONTHS_ORDER.indexOf(month) + 3
    ) as DomainEnd;
}

export interface ExpensesByMonthProps {
    data: ExpensesByMonthDatum[];
    month: MonthType;
}

export function ExpensesByMonth(props: ExpensesByMonthProps) {
    const [domainEnd, setDomainEnd] = useState<DomainEnd>(calcDomainEnd(props.month));
    const highestAmount = useMemo(() => {
        let highest = 0;
        for (let i = 0; i < props.data.length; i++) {
            if (props.data[i].amount > highest) highest = props.data[i].amount;
        }
        return highest;
    }, [props.data]);
    const data: ExpensesByMonthDatum[] = useMemo(() => {
        return MONTHS_ORDER.map(month => {
            return {
                month: month as MonthType,
                amount: props.data.find(datum => datum.month === month)?.amount || 0,
            };
        });
    }, [props.data]);
    const slicedData: ExpensesByMonthDatum[] = useMemo(() => {
        return data.slice(domainEnd - 5, domainEnd);
    }, [data, domainEnd]);
    // Need to pad the data so that bar size doesn't change as range of months changes.
    const padData: ExpensesByMonthDatum[] = useMemo(() => {
        return slicedData.map(datum => {
            return {
                month: datum.month,
                amount: highestAmount - datum.amount,
            };
        });
    }, [slicedData]);

    useEffect(() => {
        setDomainEnd(calcDomainEnd(props.month));
    }, [props.month]);

    const incrementDomainEnd = useCallback(() => {
        setDomainEnd(oldDomainEnd => {
            if (oldDomainEnd < 12) {
                return oldDomainEnd + 1 as DomainEnd;
            } else {
                return oldDomainEnd as DomainEnd;
            }
        });
    }, []);

    const decrementDomainEnd = useCallback(() => {
        setDomainEnd(oldDomainEnd => {
            if (oldDomainEnd > 5) {
                return oldDomainEnd - 1 as DomainEnd;
            } else {
                return oldDomainEnd as DomainEnd;
            }
        });
    }, []);

    return (
        <View>
            <VictoryChart domainPadding={{ x: 20 }}>
                <VictoryAxis crossAxis />
                <VictoryStack colorScale={['black', 'rgba(0,0,0,0)']}>
                    <VictoryBar
                        data={slicedData}
                        x={(datum: object) => (datum as ExpensesByMonthDatum).month.slice(0, 3)}
                        y={(datum: object) => (datum as ExpensesByMonthDatum).amount}
                        labels={({ datum }: { datum: ExpensesByMonthDatum }) => datum.amount.toFixed(2)}
                        barRatio={0.7} />
                    <VictoryBar
                        data={padData}
                        x={(datum: object) => (datum as ExpensesByMonthDatum).month.slice(0, 3)}
                        y={(datum: object) => (datum as ExpensesByMonthDatum).amount}
                        barRatio={0.7} />
                </VictoryStack>
            </VictoryChart>
            {
                domainEnd > 5 &&
                <View style={styles.leftSliderContainer}>
                    <SliderButton direction="left" size={40} onPress={decrementDomainEnd} />
                </View>
            }
            {
                domainEnd < 12 &&
                <View style={styles.rightSliderContainer}>
                    <SliderButton direction="right" size={40} onPress={incrementDomainEnd} />
                </View>
            }
        </View>
    );
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
