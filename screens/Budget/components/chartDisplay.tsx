import { BudgetCategory } from "../../../components/generated"
import { View, Text } from "react-native"
import { VictoryBar } from 'victory-native'



const ChartDisplay = ({ planned, actual }: { planned: number, actual: number }) => {
    const widthAndHeight = 250
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
    return <View>
        <Text>chart</Text>
        <VictoryBar
            categories={{ x: ["Planned", "Actual"] }}
            data={[
                { x: "Planned", y: planned, label: "$" + planned, fill: "purple" },
                { x: "Actual", y: actual, label: "$" + actual, fill: "blue" },
            ]} />
    </View>
}

export default ChartDisplay