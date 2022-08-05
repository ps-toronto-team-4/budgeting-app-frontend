
import { TouchableHighlight } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface HeaderButtonProps {
    direction: 'left' | 'right';
    onPress?: () => void;
    marginLeft?: number;
    marginRight?: number;
    alignItems?: 'center' | 'flex-end' | 'flex-start';
}

function ArrowButton({ direction, onPress, marginLeft, marginRight, alignItems }: HeaderButtonProps) {
    return (
        <TouchableHighlight onPress={onPress} style={{
            alignItems: alignItems ? alignItems : 'center',
            justifyContent: 'center',
            marginLeft: marginLeft,
            marginRight: marginRight,
            width: 50,
            height: 50,
            borderRadius: 25,
        }} underlayColor="rgba(0,0,0,0.2)">
            <AntDesign name={direction} size={32} color="black" />
        </TouchableHighlight>
    );
}

export default ArrowButton;
