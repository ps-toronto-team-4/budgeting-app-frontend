import { ReactElement } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../buttons/Button";

export interface CardProps {
    title: string;
    graph: ReactElement<any, any>;
    onViewDetails?: () => void;
}

export function Card(props: CardProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.graphContainer}>
                {props.graph}
            </View>
            {
                props.onViewDetails &&
                <View style={styles.btnContainer}>
                    <Button text="View More Details" onPress={props.onViewDetails} />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    graphContainer: {
        alignItems: 'center'
    },
    btnContainer: {
        marginBottom: 30,
        zIndex: -1,
        elevation: -1,
    },
});
