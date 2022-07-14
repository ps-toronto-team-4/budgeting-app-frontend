import { GestureResponderEvent, StyleSheet, Image } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Button from '../components/Button';
import React from 'react';
import Styles from '../constants/Styles';


export default function WelcomeScreen({ navigation }: RootTabScreenProps<'Welcome'>) {

  function onPressSignIn(_: GestureResponderEvent) {
    navigation.navigate('SignIn');
  }

  function onPressSignUp(_: GestureResponderEvent) {
    navigation.navigate('SignUp');
  }

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Welcome to</Text>
      <Text style={Styles.title}>[AppName]!</Text>
      <Image style={style.image} source={require('../assets/images/image_placeholder.png')}></Image>
      <Button text="Sign in" onPress={onPressSignIn}></Button>
      <Text style={style.registerCaption}>Don't have an account?</Text>
      <Button text="Create an account" onPress={onPressSignUp}></Button>
    </View>
  );
}

const style = StyleSheet.create({
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
