import { GestureResponderEvent, StyleSheet, Image } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Button from '../components/Button';

export default function WelcomeScreen({ navigation }: RootTabScreenProps<'Welcome'>) {
  function onPressSignIn(_: GestureResponderEvent) {
    navigation.navigate('SignIn');
  }

  function onPressSignUp(_: GestureResponderEvent) {
    navigation.navigate('SignUp');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.title}>[AppName]!</Text>
      <Image style={styles.image} source={require('../assets/images/image_placeholder.png')}></Image>
      <Button text="Sign in" onPress={onPressSignIn}></Button>
      <Text style={styles.registerCaption}>Don't have an account?</Text>
      <Button text="Create an account" onPress={onPressSignUp}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans MT'
  },
  image: {
    height: 150,
    width: 200,
    marginVertical: 100,
  },
  registerCaption: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  }
});
