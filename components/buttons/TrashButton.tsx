import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export interface TrashButtonProps {
    onPress: () => void;
}

export function TrashButton({ onPress }: TrashButtonProps) {
    return (
        <TouchableOpacity style={{ paddingRight: 20 }} onPress={onPress} >
            <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
    );
}
