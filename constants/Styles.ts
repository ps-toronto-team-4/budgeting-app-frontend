import { StyleSheet } from "react-native";
import Colors from "./Colors";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        // Not a system font on Android
        // fontFamily: 'Gill Sans MT',
        marginHorizontal: 25,
        marginVertical: '5%',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    alert: {
        color: 'red',
        marginHorizontal: 5,
        marginBottom: 8,
        maxWidth: 250,
        textAlign: 'center'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    colorTitle: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 25
    },
    palette: {
        width: '75%',
        marginBottom: 25
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    }
});

export default styles;

