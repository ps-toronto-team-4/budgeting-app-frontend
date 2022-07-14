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
    phoneContainer: {
        width: 250,
        height: 50,
        borderWidth: 1,
        paddingHorizontal: 15,
        borderColor: 'black',
        borderRadius: 7,
        marginTop: 7,
        marginBottom: 14
    },
    textField: {
        width: 70,
        height: 50,
        backgroundColor: 'invisible',
        paddingHorizontal: 2,
    },
    phoneInput: {
        fontSize: 14,
        height: 50,
    },
    countryBtn: {
        width: 55,
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
    alert: {
        color: 'red',
        marginHorizontal: 5,
        marginBottom: 8,
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
