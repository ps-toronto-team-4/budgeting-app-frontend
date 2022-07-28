import { BudgetCategory } from "../generated";
import { View, Text } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory-native';

export interface ChartDisplayProps {
    planned: number;
    actual: number;
    height?: number;
    width?: number;
}

export function ChartDisplay({ planned, actual, height, width }: ChartDisplayProps) {
    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <VictoryChart width={width || 360} height={height || 200} domainPadding={70} padding={{ top: 0, bottom: 30, left: 50, right: 50 }}>
                <VictoryAxis crossAxis />
                <VictoryBar
                    categories={{ x: ["Planned", "Actual"] }}
                    data={[
                        { x: "Planned", y: planned, label: "$" + planned.toFixed(2), fill: "purple" },
                        { x: "Actual", y: actual, label: "$" + actual.toFixed(2), fill: "black" },
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

            </VictoryChart>
        </View>

    );
}
