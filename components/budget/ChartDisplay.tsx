import { BudgetCategory } from "../generated";
import { View, Text } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryStack } from 'victory-native';

export interface ChartDisplayProps {
    planned: number;
    actualBudgeted: number;
    actualUnbudgeted: number;
    height?: number;
    width?: number;
}

export function ChartDisplay({ planned, actualBudgeted, actualUnbudgeted, height, width }: ChartDisplayProps) {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <VictoryChart width={width || 360} height={height || 200} domainPadding={70} padding={{ top: 0, bottom: 30, left: 50, right: 50 }}>
                <VictoryAxis crossAxis />
                <VictoryStack colorScale={['#aa3377', '#e0b4cd']}>
                    <VictoryBar
                        categories={{ x: ['Total Budgeted', 'Total Spent'] }}
                        data={[
                            { x: 'Total Budgeted', y: planned, label: '$' + planned.toFixed(2), fill: '#4477aa' },
                            { x: 'Total Spent', y: actualBudgeted, fill: '#aa3377' },
                        ]}
                        style={{
                            data:
                            {
                                fill:
                                    ({ datum }) => datum.fill,
                            }
                        }
                        }
                        width={200}
                        barWidth={50} />
                    <VictoryBar
                        categories={{ x: ['Total Budgeted', 'Total Spent'] }}
                        data={[
                            { x: 'Total Budgeted', y: 0 },
                            { x: 'Total Spent', y: actualUnbudgeted, label: `$${(actualBudgeted + actualUnbudgeted).toFixed(2)}` }
                        ]}
                        width={200}
                        barWidth={50} />
                </VictoryStack>
            </VictoryChart>
        </View>

    );
}
