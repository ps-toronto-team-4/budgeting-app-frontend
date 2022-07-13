import { GestureResponderEvent, StyleSheet } from 'react-native';

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
      <Button text="Sign in" onPress={onPressSignIn}></Button>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  }
});
