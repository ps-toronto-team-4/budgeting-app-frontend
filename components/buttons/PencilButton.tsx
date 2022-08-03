import { ColorValue, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface PencilButtonProps {
    onPress: () => void;
    paddingRight?: number;
    color?: ColorValue;
}

export function PencilButton({ onPress, paddingRight, color }: PencilButtonProps) {
    return (
        <TouchableOpacity style={{ paddingRight: paddingRight !== undefined ? paddingRight : 30 }} onPress={onPress}>
            <Feather name="edit-2" size={20} color={color || 'orange'} />
        </TouchableOpacity>
    );
}
