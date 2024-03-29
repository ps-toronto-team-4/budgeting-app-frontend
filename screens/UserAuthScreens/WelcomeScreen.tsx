import { GestureResponderEvent, StyleSheet, Image } from 'react-native';

import { Text, View } from '../../components/Themed';
import Button from '../../components/buttons/Button';
import React from 'react';
import { RootStackScreenProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';


export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
    useAuth({ redirect: 'ifAuthorized' });

    function onPressSignIn() {
        navigation.navigate('SignIn');
    }

    function onPressSignUp() {
        navigation.navigate('SignUp');
    }

    return (
        <View style={style.screen}>
            <Text style={style.title}>Welcome to</Text>
            <Text style={style.pigeon}>Pigeon</Text>
            <Text style={style.tagline}>Don't let your money fly away!</Text>
            <Image style={style.image} source={require('../../assets/images/pigeon.png')}></Image>
            <Button text="Sign in" onPress={onPressSignIn} accessibilityLabel={'Sign In Page'}></Button>
            <Text style={style.registerCaption}>Don't have an account?</Text>
            <Button text="Create an account" onPress={onPressSignUp} accessibilityLabel={'Sign Up Page'}></Button>
        </View>
    );
}

const style = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        marginHorizontal: 25,
        marginTop: 10,
        textAlign: 'center',
    },
    pigeon: {
        fontSize: 32,
        marginHorizontal: 25,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tagline: {
        fontSize: 18,
        marginTop: 12,
        marginHorizontal: 25,
        textAlign: 'center',
        fontWeight: '300',
    },
    image: {
        height: 150,
        width: 200,
        marginVertical: 80
    },
    registerCaption: {
        fontWeight: 'bold',
        marginTop: 30,
    },
});
