import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useState } from 'react';
import { View } from './Themed';
import {
    useFonts,
    B612Mono_400Regular,
    B612Mono_400Regular_Italic,
    B612Mono_700Bold,
    B612Mono_700Bold_Italic
} from '@expo-google-fonts/b612-mono';

type AdaptiveTextInputProps = TextInputProps & {
    /**
     * For default fontSize, charWidth = 9.5 is best. If initializing with custom fontSize
     * style, you gotta figure out the right charWidth yourself. Good luck.
     */
    charWidth: number,
};

export default function AdaptiveTextInput(props: AdaptiveTextInputProps) {
    const { style, value, ...otherProps } = props;
    const [ fontLoaded ] = useFonts({B612Mono_700Bold});

    if (!fontLoaded) {
        return <View></View>
    }

    return (
        <>
            <TextInput style={[style, styles.input, {width: (value?.length || 0) * props.charWidth + props.charWidth}]} value={value} {...otherProps}></TextInput>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        fontFamily: 'B612Mono_700Bold', // Must be a monospaced font
    }
});
