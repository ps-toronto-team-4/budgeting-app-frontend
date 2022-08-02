import { useState } from "react";
import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import { CategoryColor, colorsList } from "../../constants/CategoryColors";
import Forms from "../../constants/Forms";
import { ColorCircle } from "../ColorCircle";

export interface ColorItemProps {
    color: CategoryColor;
    selected?: boolean;
}

export function ColorItem(props: ColorItemProps) {
    return (
        <TouchableHighlight style={styles.colorItemContainer} underlayColor="rgba(0,0,0,0.2)" onPress={() => { }}>
            <ColorCircle color={props.color} size={24} />
        </TouchableHighlight>
    );
}

export interface ColorFieldProps {
    label: string;
    defaultColor?: CategoryColor;
}

export function ColorField({ label, defaultColor }: ColorFieldProps) {
    const [selectedColor, setSelectedColor] = useState(defaultColor);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.colorsContainer}>
                    {
                        colorsList.map((color, i) =>
                            <ColorItem color={color} key={i} selected={color === defaultColor} />
                        )
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingVertical: Forms.verticalSpacing,
        alignItems: 'center',
        zIndex: -1,
        elevation: -1,
    },
    content: {
        width: 320,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: Forms.fontSize,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'right',
        paddingRight: Forms.horizontalSpacing,
    },
    colorsContainer: {
        width: 220,
        flexDirection: 'row',
        flexWrap: "wrap",
    },
    colorItemContainer: {
        height: 35,
        width: 35,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
