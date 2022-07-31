import { StyleSheet, View, Text } from "react-native";

export interface DisplayFieldProps {
    label: string;
    value: string;
}

export function DisplayField({ }: DisplayFieldProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text>test</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    content: {
        width: 320,
    },
});
