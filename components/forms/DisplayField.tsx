import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import Forms from "../../constants/Forms";

export interface DisplayFieldProps {
    label: string;
    value: string;
    onPress?: () => void;
}

/**
 * A simple field for displaying text. It can be interactive or non-interactive
 * depending on whether onPress is defined.
 */
export function DisplayField({ label, value, onPress }: DisplayFieldProps) {
    return (
        <TouchableHighlight
            style={onPress ? styles.interactiveContainer : styles.uninteractiveContainer}
            onPress={onPress}
            underlayColor="rgba(0,0,0,0.1)">
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    uninteractiveContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingVertical: Forms.verticalSpacing,
        alignItems: 'center',
    },
    interactiveContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingVertical: Forms.verticalSpacing,
        alignItems: 'center',
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
    value: {
        width: 220,
        fontSize: Forms.fontSize,
    },
});
