import { StyleSheet, Touchable, TouchableOpacity, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { View, Text } from './Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

type AddButtonProps = {
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
    size: number;
};

export default function AddButton(props: AddButtonProps) {
    const theme = useColorScheme();
    const bgColor = Colors[theme].btnBackground;
    const txtColor = Colors[theme].btnText;
    const containerStyle = StyleSheet.compose(props.style, {
        ...styles.container,
        backgroundColor: bgColor,
        width: props.size,
        height: props.size,
        borderRadius: props.size/2
    });

    return (
        <TouchableOpacity onPress={props.onPress} accessibilityLabel={props.accessibilityLabel}>
            <View style={containerStyle}>
                <Text style={[styles.text, { color: txtColor, fontSize: props.size/2 }]}>+</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: 'bold',
    }
});
