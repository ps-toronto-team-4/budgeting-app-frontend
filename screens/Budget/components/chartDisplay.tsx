import { BudgetCategory } from "../../../components/generated"
import { View, Text } from "react-native"
import { VictoryBar, VictoryChart } from 'victory-native'



const ChartDisplay = ({ planned, actual, height }: { planned: number, actual: number, height?: number }) => {
    const chartHeight = height === undefined ? 250 : height
    return (
        <View style={{ justifyContent: "center", alignItems: "center", flexBasis: chartHeight }}>
            <VictoryChart domainPadding={50} height={chartHeight} padding={{ top: 0, bottom: 50, left: 50, right: 50 }}>
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

export default ChartDisplay