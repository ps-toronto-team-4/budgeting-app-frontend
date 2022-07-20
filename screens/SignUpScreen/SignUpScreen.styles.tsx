import { StyleSheet } from 'react-native';

export const eyeIconSize = 15;
export const eyeIconMarginRight = 13;


export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        paddingTop: 20,
        fontSize: 32,
        // Not a system font on Android
        // fontFamily: 'Gill Sans MT',
        marginHorizontal: 25,
        marginVertical: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 20,
        height: 1,
    },
    reqs: {
        color: 'gray',
        fontSize: 14,
        marginHorizontal: 5,
        marginBottom: 1,
    },
    formField: {
        marginVertical: 7,
    },
    icon: {
        position: 'absolute',
        right: eyeIconMarginRight,
        top: '50%',
        transform: [{ translateY: -(eyeIconSize) / 2 }],
    },
    pwordinput: {
        paddingRight: 20 + eyeIconMarginRight,
    }
});
