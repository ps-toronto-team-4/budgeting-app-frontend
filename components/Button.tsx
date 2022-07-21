import { StyleSheet, Touchable, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { View, Text } from './Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

type ButtonProps = {
    text: string;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    accessibilityLabel: string;
    disabled?: boolean | undefined;
};

export default function Button(props: ButtonProps) {
    const theme = useColorScheme();
    const bgColor = Colors[theme].btnBackground;
    const txtColor = Colors[theme].btnText;

    return (
        <TouchableOpacity onPress={props.onPress} accessibilityLabel={props.accessibilityLabel} disabled={props.disabled}>
            <View style={[styles.container, { backgroundColor: bgColor }]}>
                <Text style={[styles.text, { color: txtColor }]}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 50,
        borderRadius: 10,
    },
    text: {
        fontWeight: 'bold',
    }
});
