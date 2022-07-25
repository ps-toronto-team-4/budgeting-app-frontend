import { ColorValue, StyleSheet, TouchableHighlight } from "react-native";
import { View, Text } from "./Themed";
import { Entypo } from '@expo/vector-icons'; 

export interface BudgetCategoryProps {
    category: string;
    color: ColorValue;
    planned: number;
    actual: number;
    onPressDots: () => void;
    topBorder?: boolean;
    bottomBorder?: boolean;
}

export function BudgetCategory({category, color, planned, actual, onPressDots, topBorder, bottomBorder}: BudgetCategoryProps) {
    const dynamicStyles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            borderTopWidth: topBorder ? 1 : 0,
            borderBottomWidth: bottomBorder ? 1 : 0,
            borderColor: 'rgba(0,0,0,0.1)',
        },
        coloredBar: {
            backgroundColor: color,
            width: 10,
        },
    });

    return (
        <View style={dynamicStyles.container}>
            <View style={dynamicStyles.coloredBar}></View>
            <View style={staticStyles.contentContainer}>
                <View style={staticStyles.content}>
                    <View style={staticStyles.header}>
                        <Text style={staticStyles.headerText}>
                            {category}
                        </Text>
                        <TouchableHighlight onPress={onPressDots} style={staticStyles.iconContainer} underlayColor="rgba(0,0,0,0.2)">
                            <Entypo name="dots-three-horizontal" size={16} color="black" />
                        </TouchableHighlight>
                    </View>
                    <View style={staticStyles.body}>
                        <View style={staticStyles.amntDisplayContainer}>
                            <View style={staticStyles.amntTitleContainer}>
                                <Text style={staticStyles.amntTitle}>Planned</Text>
                            </View>
                            <Text style={staticStyles.amntText}>
                                ${planned}
                            </Text>
                        </View>
                        <View style={staticStyles.amntDisplayContainer}>
                            <View style={staticStyles.amntTitleContainer}>
                                <Text style={staticStyles.amntTitle}>Actual</Text>
                            </View>
                            <Text style={staticStyles.amntText}>
                                ${actual}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const staticStyles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: 300,
        paddingTop: 20,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
    },
    iconContainer: {
        height: 40,
        width: 40,
        borderRadius: 40/2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amntDisplayContainer: {
        width: 120,
        borderWidth: 1,
        borderColor: 'black',
        paddingLeft: 20,
        justifyContent: 'center',
        paddingVertical: 12,
    },
    amntText: {
        fontSize: 20,
    },
    amntTitleContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 3,
        position: 'absolute',
        top: -10,
        left: 10,
    },
    amntTitle: {
        fontSize: 15,
    },
});