import React, { useEffect } from "react"
import { StyleSheet, SafeAreaView, TextInput, Alert, TouchableOpacity, Pressable, Modal  } from 'react-native';
import Button from "../components/Button";

import Colors from '../constants/Colors';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from "../types";
import { useLazyQuery, useQuery } from '@apollo/client';
//import Graphql from "../components/Graphql";
import WelcomeScreen from "./WelcomeScreen";
import { GetPasswordHashDocument, GetPasswordHashQuery } from "../components/generated";


const LogInForm = (props:any) => {
  // setUsername: Function, setPassword: Function, username: string, password: string
  const { username,password,setUsername,setPassword} = props
  

  return(
    <SafeAreaView>
      

      
    </SafeAreaView>
  );
};



export default function SignInScreen({navigation}: RootStackScreenProps<'SignIn'>) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [usernamePayload, setUsernamePayload] = React.useState("");
  const [passwordPayload, setPasswordPayload] = React.useState("");
  
  const [triggerLogin, { loading, error, data }] = useLazyQuery<GetPasswordHashQuery>(GetPasswordHashDocument,{
    variables: {username:usernamePayload,password:passwordPayload},
    onCompleted: (data) => {
      console.log(usernamePayload);
      if(data?.signIn.__typename === "SignInSuccess"){
        navigation.replace('Home');
      }
    },
    onError:(data) => {
      console.log(data);

    }
  });

    

    
const handleLogin = () => {
  
  setUsernamePayload(username);
  setPasswordPayload(password);

  triggerLogin();
  

}
    
    
     
    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign into your account</Text>
      <View style= {styles.textfields}>
        <TextInput 
          style = {styles.input}
          placeholder = "Username"
          onChangeText={(username) => setUsername(username)}
          value = {username}
          >
        </TextInput>
        
        <TextInput 
          style = {styles.input}
          placeholder = "Password"
          onChangeText={(password) => setPassword(password)}
          value = {password}
          secureTextEntry={true}
          >
        </TextInput>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordModal')} style={styles.helpLink}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Forgot Password?
          </Text>
      </TouchableOpacity>

      <Button text="Sign In" onPress={() => handleLogin()}  />
      {!loading && <Text>{data?.signIn.__typename == "SignInSuccess" ? "Successful sign in": "Failed sign in"}</Text> }
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