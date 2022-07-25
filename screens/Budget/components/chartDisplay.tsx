import { BudgetCategory } from "../../../components/generated"
import { View, Text } from "react-native"
import { VictoryBar, VictoryChart } from 'victory-native'



const ChartDisplay = ({ planned, actual }: { planned: number, actual: number }) => {
    const height = 250
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexBasis: height }}>
            <VictoryChart domainPadding={50} height={height} padding={{ top: 0, bottom: 50, left: 50, right: 50 }}>
                <VictoryBar
                    categories={{ x: ["Planned", "Actual"] }}
                    data={[
                        { x: "Planned", y: planned, label: "$" + planned, fill: "purple" },
                        { x: "Actual", y: actual, label: "$" + actual, fill: "black" },

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

export default ChartDisplay