import React from "react"
import { StyleSheet, SafeAreaView, TextInput, Button, Alert } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

const LogInForm = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");


  return(
    <SafeAreaView>
      <Text style={styles.title}>Sign into your account</Text>
      <TextInput 
        style = {styles.input}
        placeholder = "Username"
        onChangeText={username => setUsername(username)}
        value = {username}
        >
      </TextInput>
      
      <TextInput 
        style = {styles.input}
        placeholder = "Password"
        onChangeText={password => setPassword(password)}
        value = {password}
        >
      </TextInput>
      <Text style = {styles.fpassword}>Forgot Password?</Text>
      <Button title = "Sign In" onPress={() => Alert.alert('Button pressed')}></Button>
    </SafeAreaView>
  );
};

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <LogInForm></LogInForm>
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
    fontSize: 20,
    fontWeight: 'bold',
    width: 150,
    textAlign: 'center',
    marginBottom: 50,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderRadius: 15,
  },
  fpassword: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderRadius: 15,
  }
});