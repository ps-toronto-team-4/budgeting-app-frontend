import { GestureResponderEvent, StyleSheet, Image } from 'react-native';

import { Text, View } from '../../components/Themed';
import Button from '../../components/Button';
import React from 'react';
import Styles from '../../constants/Styles';
import { RootStackScreenProps } from '../../types';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';


export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  useAuthRedirect();

  function onPressSignIn(_: GestureResponderEvent) {
    navigation.navigate('SignIn');
  }

  function onPressSignUp(_: GestureResponderEvent) {
    navigation.navigate('SignUp');
  }

  return (
    <View style={Styles.container}>
      <Text style={style.title}>Welcome to</Text>
      <Text style={style.title}>[AppName]!</Text>
      <Image style={style.image} source={require('../../assets/images/image_placeholder.png')}></Image>
      <Button text="Sign in" onPress={onPressSignIn} accessibilityLabel={'Sign In Page'}></Button>
      <Text style={style.registerCaption}>Don't have an account?</Text>
      <Button text="Create an account" onPress={onPressSignUp} accessibilityLabel={'Sign Up Page'}></Button>
    </View>
  );
}

const style = StyleSheet.create({
  title: {
    fontSize: 32,
    marginHorizontal: 25,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    height: 150,
    width: 200,
    marginVertical: 80
  },
  registerCaption: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
});