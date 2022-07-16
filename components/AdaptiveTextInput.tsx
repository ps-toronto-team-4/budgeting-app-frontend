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
};

export default function AdaptiveTextInput(props: AdaptiveNumInputProps) {
    const { style, onChangeText, ...otherProps } = props;
    const [ textLength, setTextLength ] = useState(4);
    const [ fontLoaded ] = useFonts({B612Mono_700Bold});

    function handleChange(text: string) {
        setTextLength(text.length);
        onChangeText && onChangeText(text);
    }

    if (!fontLoaded) {
        return <View></View>
    }

    return (
        <>
            <TextInput style={[style, styles.input, {width: textLength * props.charWidth + props.charWidth}]} onChangeText={handleChange} {...otherProps}></TextInput>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        fontFamily: 'B612Mono_700Bold',
    }
});
