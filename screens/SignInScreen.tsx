import React, { useEffect } from "react"
import { StyleSheet, SafeAreaView, Alert, TouchableOpacity, Pressable, Modal, ActivityIndicator } from 'react-native';
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Colors from '../constants/Colors';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from "../types";
import { useLazyQuery, useQuery } from '@apollo/client';
import { GetPasswordHashDocument, GetPasswordHashQuery } from "../components/generated";
import Styles from "../constants/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [usernamePayload, setUsernamePayload] = React.useState("");
  const [passwordPayload, setPasswordPayload] = React.useState("");

  const [triggerLogin, { loading, error, data }] = useLazyQuery<GetPasswordHashQuery>(GetPasswordHashDocument, {
    variables: { username: usernamePayload, password: passwordPayload },
    onCompleted: (data) => {
      if (data?.signIn.__typename === "SignInSuccess") {
        setData();
      }
    },
    onError: (data) => {
      console.log(data);
    }
  });


  const setData = async () => {
    try {
      await AsyncStorage.setItem('passwordHash', data?.signIn.__typename == "SignInSuccess" ? data.signIn.passwordHash : "undefined");
      navigation.navigate('Root');
    } catch (error) {
      data?.signIn.__typename == "FailurePayload" ? data.signIn.errorMessage : "undefined error";
    }
  }

  const handleLogin = () => {

    setUsernamePayload(username);
    setPasswordPayload(password);
    triggerLogin();

  }

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Sign into your account</Text>
      {!loading ? (
        data?.signIn.__typename === "SignInSuccess" ? (
          <Text>Sign in successful</Text>
        ) : (
          <Text style={Styles.alert}>{data?.signIn.errorMessage}</Text>
        )) : (
        <ActivityIndicator size='large' />
      )}
      <View style={styles.textfields}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(username) => setUsername(username)}
          value={username}
        >
        </TextInput>

        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          value={password}
          secureTextEntry={true}
        >
        </TextInput>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordModal')} style={styles.helpLink}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <Button text="Sign In" onPress={() => handleLogin()} accessibilityLabel={"Sign In Button"} />

      {/* Uncomment below code when sign in status is unknown! */}
      {/* {!loading && <Text>{data?.signIn.__typename == "SignInSuccess" ? "Successful sign in": "Failed sign in"}</Text> } */}
    </View>
  );
}


const styles = StyleSheet.create({
  input: {
    margin: 12,
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