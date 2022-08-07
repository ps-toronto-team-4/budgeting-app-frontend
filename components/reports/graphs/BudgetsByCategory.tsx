import { useMemo } from "react";
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
    // const data = useMemo(() => {
    //     return props.data.map();
    // }, [props.data]);

    return (
        <View>
            <VictoryChart domainPadding={{ x: 25 }}>
                <VictoryAxis crossAxis />

            </VictoryChart>
            {/* {
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
            } */}
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

