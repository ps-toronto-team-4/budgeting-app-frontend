import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Rect, VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryStack } from "victory-native";
import { MONTHS_ORDER } from "../../../constants/Months";
import { SliderButton } from "../../buttons/SliderButton";
import { MonthType } from "../../generated";

type BudgetsByMonthDatum = {
    month: MonthType,
    budget: number,
    spent: {
        planned: number,
        unplanned: number,
    },
};

type DomainEnd = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

function calcDomainEnd(month: MonthType): DomainEnd {
    return (
        MONTHS_ORDER.indexOf(month) < 2
            ? 3
            : MONTHS_ORDER.indexOf(month) > 9
                ? 12
                : MONTHS_ORDER.indexOf(month) + 2
    ) as DomainEnd;
}

export interface BudgetsByMonthProps {
    data: BudgetsByMonthDatum[];
    month: MonthType;
}

export function BudgetsByMonth(props: BudgetsByMonthProps) {
    const [domainEnd, setDomainEnd] = useState<DomainEnd>(calcDomainEnd(props.month));
    const highestBudget = useMemo(() => {
        let highest = 0;
        for (let i = 0; i < props.data.length; i++) {
            if (props.data[i].budget > highest) highest = props.data[i].budget;
        }
        return highest;
    }, [props.data]);
    const data: (BudgetsByMonthDatum & { totalSpent: number })[] = useMemo(() => {
        return MONTHS_ORDER.map(month => {
            const datum = props.data.find(datum => datum.month === month);
            return {
                month: month as MonthType,
                budget: datum?.budget || 0,
                spent: datum?.spent || { planned: 0, unplanned: 0 },
                totalSpent: datum ? datum.spent.planned + datum.spent.unplanned : 0,
            };
        });
    }, [props.data]);
    const slicedData: (BudgetsByMonthDatum & { totalSpent: number })[] = useMemo(() => {
        return data.slice(domainEnd - 3, domainEnd);
    }, [data, domainEnd]);
    const padData: (BudgetsByMonthDatum & { totalSpent: number })[] = useMemo(() => {
        return slicedData.map(datum => {
            return {
                month: datum.month,
                budget: highestBudget - datum.budget,
                spent: datum.spent,
                totalSpent: datum.totalSpent,
            };
        });
    }, [slicedData]);
    const [undefY, setUndefY] = useState<number | undefined>(0);

    useEffect(() => {
        setDomainEnd(calcDomainEnd(props.month));
    }, [props.month]);

    // It is disgusting that this is necessary.
    // Counter of dev hours wasted trying to fix this: 3
    // Needed because VictoryLabel needs a non-undefined y prop on initialization
    // when part of a VictoryGroup.
    useEffect(() => {
        setUndefY(0);
        setTimeout(() => setUndefY(undefined), 100);
    }, [slicedData])

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
            if (oldDomainEnd > 3) {
                return oldDomainEnd - 1 as DomainEnd;
            } else {
                return oldDomainEnd as DomainEnd;
            }
        });
    }, []);

    return (
        <View>
            <VictoryChart domainPadding={{ x: 25 }}>
                <VictoryAxis crossAxis />
                <VictoryGroup offset={20}>
                    <VictoryStack>
                        <VictoryBar
                            data={slicedData.map(x => {
                                return {
                                    x: x.month.slice(0, 3),
                                    y: x.budget,
                                    label: x.budget ? '$' + x.budget.toFixed(2) : null,
                                };
                            })}
                            labelComponent={<VictoryLabel dx={-20} />}
                            barWidth={20}
                            style={{ data: { fill: '#4477aa' } }} />
                        <VictoryBar
                            data={padData.map(x => {
                                return {
                                    x: x.month.slice(0, 3),
                                    y: x.budget,
                                };
                            })}
                            barWidth={20}
                            style={{ data: { fill: 'rgba(0,0,0,0)' } }} />
                    </VictoryStack>
                    <VictoryStack>
                        <VictoryBar
                            data={slicedData.map(x => {
                                return {
                                    x: x.month.slice(0, 3),
                                    y: x.spent.planned,
                                };
                            })}
                            barWidth={20}
                            style={{ data: { fill: '#aa3377' } }} />
                        <VictoryBar
                            data={slicedData.map(x => {
                                return {
                                    x: x.month.slice(0, 3),
                                    y: x.spent.unplanned,
                                    label: x.totalSpent ? '$' + x.totalSpent.toFixed(2) : null,
                                };
                            })}
                            labelComponent={<VictoryLabel y={undefY} dx={20} />}
                            barWidth={20}
                            style={{ data: { fill: '#e0b4cd' } }} />
                    </VictoryStack>
                </VictoryGroup>
            </VictoryChart>
            {
                domainEnd > 3 &&
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
