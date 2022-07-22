import { StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { View, Text } from "./Themed";

export interface ConfirmDeletionProps {
    onConfirm: () => void;
    onCancel: () => void;
    visible: boolean
}

export function ConfirmDeletion({ onConfirm, onCancel, visible }: ConfirmDeletionProps) {
    if (visible) {
        return (
            <View style={styles.container}>
                <View style={styles.messageContainer}>
                    <Text>Delete this item?</Text>
                </View>
                <View style={styles.optionsRow}>
                    <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                        <Text style={styles.text}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn}>
                        <Text style={styles.text}>Yes, delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        return <></>
    }
}

const height = 200;
const width = 250;
const borderRadius = 15;

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        borderRadius: borderRadius,
    },
    messageContainer: {
        flex: 2,
        backgroundColor: 'white',
        borderTopStartRadius: borderRadius,
        borderTopEndRadius: borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsRow: {
        flex: 1,
        flexDirection: 'row',
        borderBottomStartRadius: borderRadius,
        borderBottomEndRadius: borderRadius,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: Colors.light.btnBackground,
        borderBottomStartRadius: borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
    },
    confirmBtn: {
        flex: 1,
        backgroundColor: 'rgb(255,0,0)',
        borderBottomEndRadius: borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
