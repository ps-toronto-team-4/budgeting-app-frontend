import { BudgetCategory } from "../../../components/generated"
import { View, Text } from "react-native"


const ChartDisplay = ({ data }: { data: Array<BudgetCategory> }) => {
    const widthAndHeight = 250
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
    return <View>
        <Text>chart</Text>
    </View>
}

export default ChartDisplay