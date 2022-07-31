import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableHighlight, View, Text, TextInput, TouchableOpacity } from "react-native";
import Forms from "../../constants/Forms";

export interface InputFieldProps {
    label: string;
    placeholder: string;
    onChange: (value: string) => void;
}

export function InputField({ label, placeholder, onChange }: InputFieldProps) {
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
        <TouchableHighlight style={containerStyle} onPress={() => setFocused(true)} underlayColor="rgba(0,0,0,0.1)" >
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    editable={focused}
                    ref={inputRef}
                    onBlur={() => setFocused(false)}
                    onChangeText={onChange} />
            </View>
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
});
