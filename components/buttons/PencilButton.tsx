import { ColorValue, StyleSheet, TouchableHighlight } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface PencilButtonProps {
    onPress: () => void;
    color?: ColorValue;
}

export function PencilButton(props: PencilButtonProps) {
    return (
        <TouchableHighlight style={styles.container} onPress={props.onPress}
            underlayColor="rgba(0,0,0,0.1)">
            <Feather name="edit-2" size={24} color={props.color || 'orange'} />
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
    },
});
