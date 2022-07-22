import { useState } from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import { View, Text } from "./Themed";

export interface ConfirmDeletionProps {
    onConfirm: () => void;
}

export function ConfirmDeletion({ onConfirm }: ConfirmDeletionProps) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                <Text>Delete this item?</Text>
            </View>
            <TouchableHighlight onPress={ }>
                <Text>Cancel</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: 'white',
        height: 200,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {

    },
});
