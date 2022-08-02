import { Text, View, StyleSheet } from "react-native";
import { RootStackScreenProps } from "../../types";
import { useState } from "react";



export default function ExpandExpense({ navigation, route }: RootStackScreenProps<'ExpandExpenses'>) {

    const [month, setMonth] = useState(route.params.month)
    const [year, setYear] = useState(route.params.year)

    return <View style={staticStyles.screen}>
        <View>

            <Text>
                Your month is :{month}

            </Text>
        </View>

        <View>
            <Text>
                Your year is :{year}
            </Text>
        </View>
    </View >
}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
})