import { ColorValue, TouchableHighlight, View, Text } from "react-native";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export interface ExpenseDisplayProps {
    id: number;
    color: ColorValue;
    name: string;
    amount: number;
    onPress: (id: number) => void;
}

export function ExpenseDisplay({ id, color, name, amount, onPress }: ExpenseDisplayProps) {
    const dynamicStyles = useMemo(() => {
        return StyleSheet.create({
            coloredBar: {
                backgroundColor: color,
                width: 15,
            }
        });
    }, [color]);

    return (
        <TouchableHighlight style={staticStyles.container} onPress={() => onPress(id)} underlayColor="rgba(0,0,0,0.2)">
            <>
                <View style={dynamicStyles.coloredBar}></View>
                <View style={staticStyles.contentContainer}>
                    <View style={staticStyles.content}>
                        <Text style={staticStyles.itemName}>{name}</Text>
                        <Text style={staticStyles.amount}>${amount.toFixed(2)}</Text>
                    </View>
                </View>
            </>
        </TouchableHighlight>
    );
}

const staticStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        flex: 1,
        borderTopWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    content: {
        width: 300,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    amount: {
        fontSize: 22,
    },
});
