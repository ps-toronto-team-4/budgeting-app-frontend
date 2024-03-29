import { View, Text } from "react-native"
import { AntDesign } from "@expo/vector-icons";
import { MONTHS_ORDER } from "../../constants/Months"

export interface TopBarProps {
    month: string,
    year: number,
    setMonth: (newMonth: string) => void;
    setYear: (newYear: number) => void;
}

export function TopBar({ month, year, setMonth, setYear }: TopBarProps) {
    const months = MONTHS_ORDER

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

    return <View style={{ flexBasis: 80, flexDirection: 'row', justifyContent: "space-between", marginTop: -2 }}>
        <AntDesign onPress={backAMonth} style={{ flex: 1 }} name="left" size={32} color="black" />
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
            {month} {year}
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <AntDesign onPress={forwardAMonth} style={{ flex: 1 }} name="right" size={32} color="black" />
        </View>

    </View>

}