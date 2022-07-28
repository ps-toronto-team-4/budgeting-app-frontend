import { ReactElement, useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Row, RowProps } from "./Row";
import { View, Text } from "./Themed";

export type InputRowProps = Omit<RowProps, 'children'> & {
    label: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    disabled?: boolean;
    wrap?: boolean;
    error?: string;
};

/**
 * Not tested for the case where the `wrap` prop changes over component lifecycle. So keep `wrap` static to be safe.
 */
export function InputRow({ label, placeholder, value, onChangeText, wrap, error, disabled, ...otherProps }: InputRowProps) {
    const [inputHeight, setInputHeight] = useState(20);

    return (
        <Row {...otherProps}>
            <View style={styles.container}>
                <View style={styles.labelAndInput}>
                    <Text style={styles.label}>
                        {label}
                    </Text>
                    <TextInput
                        style={[styles.input, { height: inputHeight }]}
                        placeholderTextColor="black"
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        editable={disabled !== true}
                        multiline={wrap}
                        scrollEnabled={false}
                        textAlignVertical="top"
                        onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)} />
                </View>
                {
                    error &&
                    <Text style={styles.error}>
                        {error}
                    </Text>
                }
            </View>
        </Row>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0)',
    },
    labelAndInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 280,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 15,
        width: 100,
    },
    input: {
        fontSize: 15,
        width: 180,
        padding: 2,
        color: 'black',
    },
    error: {
        paddingTop: 10,
        color: 'red',
        alignSelf: 'center',
    },
});
