import { TextInput as DefaultTextInput, TextInputProps, StyleSheet } from 'react-native';

export default function TextInput(props: TextInputProps) {
    const { style, ...otherProps } = props;

    return (
        <DefaultTextInput style={[style, styles.input]} {...otherProps}></DefaultTextInput>
    );
}

const styles = StyleSheet.create({
    input: {
        width: 250,
        height: 50,
        borderWidth: 1,
        paddingHorizontal: 15,
        borderColor: 'black',
        borderRadius: 7,
    }
});
