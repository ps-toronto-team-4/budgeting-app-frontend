import { ReactElement } from "react";
import { ColorValue, StyleSheet, TouchableHighlight } from "react-native";
import { View, Text } from "../Themed";

export interface RowProps {
    /**
     * Makes the row touchable.
     */
    onPress?: () => void;
    topBorder?: boolean;
    bottomBorder?: boolean;
    children?: ReactElement<any, any> | ReactElement<any, any>[];
    backgroundColor?: ColorValue;
}

export function Row({ onPress, topBorder, bottomBorder, children, backgroundColor }: RowProps) {
    const dynamicStyles = StyleSheet.create({
        row: {
            alignItems: 'center',
            borderTopColor: 'rgba(0,0,0,0.1)',
            borderBottomColor: 'rgba(0,0,0,0.1)',
            borderTopWidth: topBorder ? 1 : 0,
            borderBottomWidth: bottomBorder ? 1 : 0,
            paddingVertical: 15,
            backgroundColor: backgroundColor || 'white',
        },
    });

    return (
        <TouchableHighlight
            style={dynamicStyles.row}
            underlayColor="rgba(0,0,0,0.1)"
            onPress={onPress}>
            <View style={staticStyles.contentContainer}>
                {children}
            </View>
        </TouchableHighlight>
    );
}

const staticStyles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 320,
        backgroundColor: 'rgba(0,0,0,0)',
    },
});
