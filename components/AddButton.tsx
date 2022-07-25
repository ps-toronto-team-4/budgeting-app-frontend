import { StyleSheet, Touchable, TouchableOpacity, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { View, Text } from './Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

type AddButtonProps = {
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    size: number;
};

export default function AddButton(props: AddButtonProps) {
    const theme = useColorScheme();
    const bgColor = Colors[theme].btnBackground;
    const dynamicStyles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            width: props.size,
            height: props.size,
            borderRadius: props.size / 2
        },
        text: {
            fontWeight: 'bold',
            color: 'white',
            fontSize: props.size / 2,
        }
    });

    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.85}>
            <View style={dynamicStyles.container}>
                <Text style={dynamicStyles.text}>+</Text>
            </View>
        </TouchableOpacity>
    );
}
