import { View, Text } from "react-native"
import { AntDesign } from "@expo/vector-icons";

const TopBar = ({ month, year, setMonth, setYear }: { month: string, year: number, setMonth: Function, setYear: Function }) => {

    const months = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
    ]

    const backAMonth = () => {
        const curIndex = months.indexOf(month)
        if (curIndex == 0) {
            setMonth(months[months.length - 1])
            setYear(year - 1)
        } else {
            setMonth(months[curIndex - 1])
        }
    }

    const forwardAMonth = () => {
        const curIndex = months.indexOf(month)
        if (curIndex == months.length - 1) {
            setMonth(months[0])
            setYear(year + 1)
        } else {
            setMonth(months[curIndex + 1])
        }
    }

    return <View style={{ flexBasis: 80, flexDirection: 'row', justifyContent: "space-between" }}>
        <AntDesign onPress={backAMonth} style={{ flex: 1 }} name="left" size={32} color="black" />
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
            Budget of {year} {month}
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <AntDesign onPress={forwardAMonth} style={{ flex: 1 }} name="right" size={32} color="black" />
        </View>

    </View>
}

export default TopBar