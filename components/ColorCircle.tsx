import { useMemo } from "react";
import { ColorValue, StyleSheet, View } from "react-native";

export interface ColorCircleProps {
    color: ColorValue;
    /**
     * size === width === height
     */
    size: number;
}

export function ColorCircle({ color, size }: ColorCircleProps) {
    const style = useMemo(() => {
        return {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 0.5,
        }
    }, [color, size]);

    return (
        <View style={style} />
    );
}
