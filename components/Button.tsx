import { StyleSheet, Touchable, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { View, Text } from './Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

type ButtonProps = {
    text: string;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    accessibilityLabel: string;
};

export default function Button(props: ButtonProps) {
    const theme = useColorScheme();
    const bgColor = Colors[theme].btnBackground;
    const txtColor = Colors[theme].btnText;

    return (
        <TouchableOpacity onPress={props.onPress} accessibilityLabel={props.accessibilityLabel}>
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
        paddingVertical: 20,
        borderRadius: 10,
    },
    text: {
        fontWeight: 'bold',
    }
});
