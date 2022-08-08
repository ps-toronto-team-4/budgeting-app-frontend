import { ColorValue, StyleSheet, TouchableHighlight } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface FilterButtonProps {
    onPress: () => void;
}

export function FilterButton(props: FilterButtonProps) {
    return (
        <TouchableHighlight style={styles.container} onPress={props.onPress}
            underlayColor="rgba(0,0,0,0.1)">
            <Feather name="filter" size={24} color="black" />
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
