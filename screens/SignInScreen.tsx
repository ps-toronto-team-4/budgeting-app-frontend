import React from "react"
import { StyleSheet, SafeAreaView, TextInput, Button, Alert, TouchableOpacity, Pressable, Modal  } from 'react-native';

import Colors from '../constants/Colors';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from "../types";
import { useQuery } from '@apollo/client';
import Graphql from "../components/Graphql";

const LogInForm = (props:any) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  

  return(
    <SafeAreaView>
      <View style= {styles.textfields}>
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
          secureTextEntry={true}
          >
        </TextInput>
      </View>

      <Button title = "Sign In" onPress={() => checkInfo(username, password)}></Button>
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

      <View style={styles.testContainer}>
        <Text
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          <Graphql></Graphql>
        </Text>
      </View>
    </View>
  );
}



function checkInfo(username: String, password: String){
  
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
    margin: 20,
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
  textfields: {
    marginBottom: 100,
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
  testContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'center'
  }
});