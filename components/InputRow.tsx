import { StyleSheet, TextInput } from "react-native";
import { Row, RowProps } from "./Row";
import { View, Text } from "./Themed";

export type InputRowProps = Omit<RowProps, 'children'> & {
    label: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    disabled?: boolean;
};

export function InputRow({ label, placeholder, value, onChangeText, disabled, ...otherProps }: InputRowProps) {
    return (
        <Row {...otherProps}>
            <View style={styles.labelAndInput}>
                <Text style={styles.label}>
                    {label}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    editable={disabled !== true} />
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
        backgroundColor: 'rgba(0,0,0,0)'
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
