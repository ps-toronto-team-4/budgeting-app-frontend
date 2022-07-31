import { TextInput, TextInputProps, StyleSheet, TouchableHighlight, Text, NativeSyntheticEvent, TextInputSelectionChangeEventData } from 'react-native';
import { MutableRefObject, useEffect, useRef } from 'react';
import { useState } from 'react';
import { View } from '../Themed';
import {
    useFonts,
    B612Mono_400Regular,
    B612Mono_400Regular_Italic,
    B612Mono_700Bold,
    B612Mono_700Bold_Italic
} from '@expo-google-fonts/b612-mono';

export interface AmountInputProps {
    onChangeAmount: (amount: number) => void;
    defaultAmount: number;
    onSelect?: () => void;
    error?: string;
};

function amountToValue(amount: number): string {
    return amount.toFixed(2);
}

function valueToAmount(value: string): number {
    return parseFloat(value);
}

export function AmountInput({ onChangeAmount, defaultAmount, onSelect, error }: AmountInputProps) {
    const [fontLoaded] = useFonts({ B612Mono_700Bold });
    const [value, setValue] = useState(amountToValue(defaultAmount));
    const charWidth = 30;
    const maxLength = 10;

    function handleChangeText(newValue: string) {
        // Numbers and periods only.
        newValue = newValue.replace(/[^0-9.]/, "")
        // One period only (chooses to keep the first one).
        newValue = newValue.replace(/(\d*\.\d*)(\.)(\d*)/, '$1$3');
        // Only two digits after the decimal point.
        newValue = newValue.replace(/(\d*\.)(\d{2})(\d*)/, '$1$2');

        const amount = valueToAmount(newValue) || 0;
        onChangeAmount(amount);
        setValue(newValue);
    }

    function handleFocus() {
        onSelect && onSelect();
    }

    if (!fontLoaded) {
        return <View></View>;
    }

    return (
        <View style={styles.container}>
            <TouchableHighlight style={styles.dollarSignAndInput}>
                <>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                        keyboardType='numeric'
                        style={[styles.input, { fontSize: 50, width: (value?.length || 0) * charWidth + charWidth }]}
                        value={value}
                        onChangeText={handleChangeText}
                        maxLength={maxLength}
                        onBlur={() => setValue((valueToAmount(value) || 0).toFixed(2))}
                        onFocus={handleFocus}
                        selectTextOnFocus />
                </>
            </TouchableHighlight>
            <Text style={styles.error}>
                {
                    error || ''
                }
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dollarSignAndInput: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    dollarSign: {
        fontSize: 20,
        marginRight: 5,
        paddingBottom: 15,
    },
    input: {
        fontFamily: 'B612Mono_700Bold', // Must be a monospaced font
    },
    error: {
        color: 'red',
        fontSize: 18,
    },
});
