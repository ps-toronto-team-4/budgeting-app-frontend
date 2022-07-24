import { StyleSheet, TextInput } from "react-native";
import { Row } from "./Row";
import { View, Text } from "./Themed";

export interface InputRowProps {
    label: string;
    placeholder?: string;
    topBorder?: boolean;
    bottomBorder?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
}

export function InputRow({ label, placeholder, topBorder, bottomBorder, value, onChangeText }: InputRowProps) {
    return (
        <Row topBorder={topBorder} bottomBorder={bottomBorder}>
            <View style={styles.labelAndInput}>
                <Text style={styles.label}>
                    {label}
                </Text>
                <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={onChangeText} />
            </View>
        </Row>
    );
}

const styles = StyleSheet.create({
    labelAndInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 280,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 15,
        width: 100,
    },
    input: {
        fontSize: 15,
        width: 180
    },
});
