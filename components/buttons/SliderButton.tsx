import { AntDesign } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native";

interface SliderButtonProps {
    direction: 'left' | 'right';
    size: number;
    onPress?: () => void;
    marginLeft?: number;
    marginRight?: number;
}

export function SliderButton(props: SliderButtonProps) {
    return (
        <TouchableHighlight onPress={props.onPress} style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: props.marginLeft,
            marginRight: props.marginRight,
            width: props.size,
            height: props.size,
            borderRadius: props.size / 2,
        }} underlayColor="rgba(0,0,0,0.2)">
            <AntDesign name={props.direction} size={props.size / 2} color="black" />
        </TouchableHighlight>
    );
}
