import { StyleSheet, Touchable, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { View, Text } from '../Themed';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

type ButtonProps = {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    accessibilityLabel?: string;
    disabled?: boolean | undefined;
    size?: "full" | "half"
};

export default function Button(props: ButtonProps) {
    const theme = useColorScheme();
    const width = props.size === "half" ? 120 : 250;
    const bgColor = props.backgroundColor || Colors[theme].btnBackground;
    const txtColor = props.textColor || Colors[theme].btnText;

    return (
        <TouchableOpacity onPress={props.onPress} accessibilityLabel={props.accessibilityLabel} disabled={props.disabled}>
            <View style={[styles.container, { backgroundColor: bgColor, width: width }]}>
                <Text style={[styles.text, { color: txtColor }]}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10,
        marginTop: 10,
    },
    text: {
        fontWeight: 'bold',
    }
});
