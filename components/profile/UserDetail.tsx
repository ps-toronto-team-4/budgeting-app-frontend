import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

export interface UserDetailProps {
    label: string;
    value: string;
}

export function UserDetail({ label, value }: UserDetailProps) {
    return (
        <View style={styles.userDetailsRow}>
            <Text style={styles.userDetailsLabel}>{label}</Text>
            <Text style={styles.userDetailsValue}>{value}</Text>
        </View>
    );
}

const userDetailsFontSize = 17;
const userDetailsVerticalSpacing = 5;
const userDetailsHorizontalSpacing = 20;

const styles = StyleSheet.create({
    userDetailsRow: {
        flexDirection: 'row',
        paddingVertical: userDetailsVerticalSpacing,
    },
    userDetailsLabel: {
        width: 100,
        textAlign: 'right',
        fontSize: userDetailsFontSize,
    },
    userDetailsValue: {
        fontWeight: 'bold',
        width: 250,
        paddingLeft: userDetailsHorizontalSpacing,
        paddingRight: 20,
        fontSize: userDetailsFontSize,
    },
});
