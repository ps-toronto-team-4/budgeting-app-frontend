import { TouchableHighlight, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export interface TrashButtonProps {
    onPress: () => void;
}

export function TrashButton({ onPress }: TrashButtonProps) {
    return (
        <TouchableHighlight style={styles.container} onPress={onPress} underlayColor="rgba(0,0,0,0.1)">
            <AntDesign name="delete" size={24} color="red" />
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
