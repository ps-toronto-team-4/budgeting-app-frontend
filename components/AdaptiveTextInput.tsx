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

type AdaptiveNumInputProps = TextInputProps & {
    /**
     * For default fontSize, charWidth = 9.5 is best. If initializing with custom fontSize
     * style, you gotta figure out the right charWidth yourself. Good luck.
     */
    charWidth: number,

    /**
     * For default fontSize, charWidth = 9.5 is best. If initializing with custom fontSize
     * style, you gotta figure out the right charWidth yourself. Good luck.
     */
    initialValue: string,
};

export default function AdaptiveTextInput(props: AdaptiveNumInputProps) {
    const { style, ...otherProps } = props;
    const [ value, setValue ] = useState(props.initialValue.toString());
    const [ fontLoaded ] = useFonts({B612Mono_700Bold});

    function handleChange(text: string) {
        setValue(text);
    }

    if (!fontLoaded) {
        return <View></View>
    }

    return (
        <>
            <TextInput keyboardType='numeric' value={value} style={[style, styles.input, {width: value.length * props.charWidth + props.charWidth}]} {...otherProps} onChangeText={handleChange}></TextInput>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        fontFamily: 'B612Mono_700Bold',
    }
});
