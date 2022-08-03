import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableHighlight, View, Text, TextInput, TouchableOpacity } from "react-native";
import Forms from "../../constants/Forms";

export interface InputFieldProps {
    label: string;
    placeholder: string;
    defaultValue?: string;
    onChange: (value: string) => void;
    /**
     * The error message is fully controlled by the parent.
     */
    errorMessage?: string;
}

export function InputField({ label, placeholder, defaultValue, onChange, errorMessage }: InputFieldProps) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const backgroundColor = focused ? 'rgba(0,0,0,0.1)' : 'white';
    const containerStyle = useMemo(() => {
        return [styles.container, { backgroundColor }]
    }, [backgroundColor]);

    useEffect(() => {
        if (focused) inputRef.current?.focus();
    }, [focused]);

    return (
        <TouchableHighlight style={containerStyle} onPress={() => setFocused(true)} underlayColor="rgba(0,0,0,0.1)">
            <>
                <View style={styles.content}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        defaultValue={defaultValue || ''}
                        editable={focused}
                        ref={inputRef}
                        onBlur={() => setFocused(false)}
                        onChangeText={onChange}
                        pointerEvents="none" />
                </View>
                {
                    errorMessage !== undefined && errorMessage.length > 0 &&
                    <Text style={styles.error}>{errorMessage}</Text>
                }
            </>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
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
    input: {
        width: 220,
        fontSize: Forms.fontSize,
        color: 'black',
    },
    error: {
        paddingTop: 10,
        color: 'red',
        alignSelf: 'center',
        fontSize: Forms.errorFontSize,
    },
});
