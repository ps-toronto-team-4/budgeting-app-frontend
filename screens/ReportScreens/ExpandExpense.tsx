import { Screen } from "../../components/Screen";
import { Text, View } from "react-native";
import { RootStackScreenProps } from "../../types";
import { useState } from "react";



export default function ExpandExpense({ navigation, route }: RootStackScreenProps<'ExpandExpenses'>) {

    const [month, setMonth] = useState(route.params.month)
    const [year, setYear] = useState(route.params.year)

    return <Screen>
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
    </Screen >
}