import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend, VictoryStack } from "victory-native";
import { SliderButton } from "../../buttons/SliderButton";

type BudgetsByCategoryDatum = {
    category: string,
    budgeted: number,
    spent: number,
};

export interface BudgetsByCategoryProps {
    data: BudgetsByCategoryDatum[];
}

export function BudgetsByCategory(props: BudgetsByCategoryProps) {
    const [endIndex, setEndIndex] = useState(props.data.length > 2 ? 3 : props.data.length + 1);
    const sortedData = useMemo(() => {
        return props.data.sort((a, b) => {
            if (a.category > b.category) {
                return 1;
            } else if (a.category < b.category) {
                return -1;
            } else {
                return 0;
            }
        });
    }, [props.data]);
    const slicedData = useMemo(() => {
        if (sortedData.length <= 2) {
            return sortedData.slice();
        }
        return sortedData.slice(endIndex - 3, endIndex);
    }, [sortedData, endIndex]);
    const [undefY, setUndefY] = useState<number | undefined>(0);

    useEffect(() => {
        setEndIndex(props.data.length > 2 ? 3 : props.data.length + 1);
    }, [props.data]);

    // It is disgusting that this is necessary.
    // Counter of dev hours wasted trying to fix this: 3
    // Needed because VictoryLabel needs a non-undefined y prop on initialization
    // when part of a VictoryGroup.
    useEffect(() => {
        setUndefY(0);
        setTimeout(() => setUndefY(undefined), 100);
    }, [slicedData])

    const incrementEndIndex = useCallback(() => {
        setEndIndex(oldEndIndex => {
            if (oldEndIndex < sortedData.length) {
                return oldEndIndex + 1;
            } else {
                return oldEndIndex;
            }
        });
    }, [sortedData]);

    const decrementEndIndex = useCallback(() => {
        setEndIndex(oldEndIndex => {
            if (oldEndIndex > 3) {
                return oldEndIndex - 1;
            } else {
                return oldEndIndex;
            }
        });
    }, [sortedData]);

    return (
        <View>
            <VictoryChart domainPadding={{ x: 25 }}>
                <VictoryAxis crossAxis />
                <VictoryGroup offset={20}>
                    <VictoryStack>
                        <VictoryBar
                            data={slicedData.map(x => {
                                return {
                                    x: x.category.slice(0, 6) + (x.category.length <= 6 ? '' : '..'),
                                    y: x.budgeted,
                                    label: x.budgeted ? '$' + x.budgeted.toFixed(2) : null,
                                };
                            })}
                            labelComponent={<VictoryLabel dx={-20} />}
                            barWidth={20}
                            style={{ data: { fill: '#4477aa' } }} />
                        <VictoryBar
                            data={slicedData.map(x => {
                                return {
                                    x: x.category.slice(0, 6) + (x.category.length <= 6 ? '' : '..'),
                                    y: 0,
                                };
                            })}
                            barWidth={20}
                            style={{ data: { fill: 'rgba(0,0,0,0)' } }} />
                    </VictoryStack>
                    <VictoryStack>
                        <VictoryBar
                            data={slicedData.map(x => {
                                return {
                                    x: x.category.slice(0, 6) + (x.category.length <= 6 ? '' : '..'),
                                    y: x.spent,
                                };
                            })}
                            barWidth={20}
                            style={{ data: { fill: ({ datum }) => datum.budgeted ? '#aa3377' : '#e0b4cd' } }} />
                        <VictoryBar
                            data={slicedData.map(x => {
                                return {
                                    x: x.category.slice(0, 6) + (x.category.length <= 6 ? '' : '..'),
                                    y: x.spent,
                                    label: x.spent ? '$' + x.spent.toFixed(2) : null,
                                };
                            })}
                            labelComponent={<VictoryLabel y={undefY} dx={20} />}
                            barWidth={20}
                            style={{ data: { fill: ({ datum }) => datum.budgeted ? '#aa3377' : '#e0b4cd' } }} />
                    </VictoryStack>
                </VictoryGroup>
            </VictoryChart>
            {
                endIndex > 3 &&
                <View style={styles.leftSliderContainer}>
                    <SliderButton direction="left" size={40} onPress={decrementEndIndex} />
                </View>
            }
            {
                endIndex < sortedData.length &&
                <View style={styles.rightSliderContainer}>
                    <SliderButton direction="right" size={40} onPress={incrementEndIndex} />
                </View>
            }
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

