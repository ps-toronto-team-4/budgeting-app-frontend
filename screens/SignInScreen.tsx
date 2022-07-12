import React from "react"
import { StyleSheet, SafeAreaView, TextInput, Button, Alert, TouchableOpacity, Pressable,  } from 'react-native';

import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import Colors from '../constants/Colors';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from "../types";

const LogInForm = (props:any) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  

  return(
    <SafeAreaView>
      
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

      

      <Button title = "Sign In" onPress={() => Alert.alert('Button pressed')}></Button>
    </SafeAreaView>
  );
};



export default function SignInScreen({navigation}: RootStackScreenProps<'SignIn'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign into your account</Text>
      <LogInForm></LogInForm>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordModal')} style={styles.helpLink}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Forgot Password?
          </Text>
      </TouchableOpacity>
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
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor: '#ccc',
    borderRadius: 50,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  helpContainer: {
    marginTop: 5,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});