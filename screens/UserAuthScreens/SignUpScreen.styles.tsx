import { StyleSheet } from 'react-native';

export const eyeIconSize = 15;
export const eyeIconMarginRight = 13;


export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        width: '100%',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center'
    },
    codeText: {
        marginRight: 5
    },
    phoneContainer: {
        width: 250,
        height: 50,
        borderWidth: 1,
        paddingHorizontal: 15,
        borderColor: 'black',
        borderRadius: 7,
        marginVertical: 7
    },
    textField: {
        height: 50,
        backgroundColor: 'invisible',
        paddingHorizontal: 2,
    },
    phoneInput: {
        fontSize: 14,
        height: 50,
        width: 170,
    },
    countryBtn: {
        width: 30,
    },
    alert: {
        color: 'red',
        marginHorizontal: 5,
        marginBottom: 8,
        maxWidth: 250,
        textAlign: 'center'
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
    },
    btnContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
});
