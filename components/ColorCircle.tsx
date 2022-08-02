import { useMemo } from "react";
import { ColorValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export interface ColorCircleProps {
    color: ColorValue | 'plus';
    /**
     * size === width === height
     */
    size: number;
}

export function ColorCircle({ color, size }: ColorCircleProps) {
    const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
        return {
            backgroundColor: color === 'plus' ? 'black' : color,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
        }
    }, [color, size]);

    if (color === 'plus') {
        return (
            <View style={containerStyle}>
                <AntDesign name="plus" size={size / 2} color="white" />
            </View>
        );
    }
    return (
        <View style={containerStyle} />
    );
}
