import { View, Text, Button } from 'react-native'

const MissingBudget = () => {

    return (<View>
        <Text>
            Wow such emptiness, make a budget for this month
            <Button
                title="New Budget from scratch"
                onPress={() => alert("not implemented")}
            />
            <Button
                title="Copy Last Month's Budget"
                onPress={() => alert("not implemented")}
            />
        </Text>
    </View>)
}

export default MissingBudget