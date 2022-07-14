import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput } from 'react-native';
import { CreateUserDocument, CreateUserMutation } from "../components/generated";
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Button from '../components/Button';

export default function SignUpScreen({ navigation }: RootTabScreenProps<'SignUp'>) {

  const [username, setUsername] = useState("")
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [pwordConfirm, setPwordConfirm] = useState("")
  const [check, setCheck] = useState(false)
  const [pwordCheck, setPwordCheck] = useState(false)
  const [pwordRules, setPwordRules] = useState(false)
  const [emailCheck, setEmailCheck] = useState(false)
  const [phoneCheck, setPhoneCheck] = useState(false)
  const [hidePword, setHidePword] = useState(true)

  // Create user graphql query
  const [createUser, { loading, error, data }] = useMutation<CreateUserMutation>(CreateUserDocument, {
    variables: { fname, lname, username, email, phone, password },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (() =>
      navigation.navigate("SignIn")
    )
  })

  const register = async () => {
    setCheck(true);
    if (password && fname && username && email) {
      createUser();
    }
  }

  function RequiredField({ input }: { input: string }) {
    return (
      (!check || input) ? (
        <></>
      ) : (
        <Text style={styles.alert}>this field is required</Text>
      ))
  }

  function PasswordRules() {
    let lengthCheck = password.length >= 8;
    let lettersCheck = /([A-Z].?[a-z])|([a-z].?[A-Z])/.test(password);
    let numberCheck = /\d/.test(password);
    let specialCheck = /[^A-Za-z0-9]/.test(password);
    if (lettersCheck && lengthCheck && numberCheck && specialCheck) {
      return (<></>);
    }
    return (
      <View>
        <Text style={styles.reqs}>Password requirements:</Text>
        {lengthCheck ? (<></>) : (<Text style={styles.reqs}> - 8 characters minimum</Text>)}
        {lettersCheck ? (<></>) : (<Text style={styles.reqs}> - Upper and lower case letters</Text>)}
        {numberCheck ? (<></>) : (<Text style={styles.reqs}> - At least one number</Text>)}
        {specialCheck ? (<></>) : (<Text style={styles.reqs}> - At least one special character</Text>)}
      </View>
    )
  }

  function CheckEmail() {
    let emailRegex = /^[^/\\*;:,{}\[\]()$?]+@+[^/\\~`*;:,|{}\[\]=()%$?]+[.]{1}[^/\\~`*;:,|{}\[\]=()%$?]+$/;
    if (!emailCheck || !email || emailRegex.test(email)) {
      return (<></>);
    } else {
      return (
        <Text style={styles.alert}>Invalid email address</Text>
      )
    }
  }

  function FormatPhone(newPhone: string) {
    setPhone(newPhone.replaceAll(/[^0-9]/g, ""));
    setPhoneCheck(false);
  }

  function CheckPhone() {
    let phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneCheck || !phone || phoneRegex.test(phone)) {
      return (<></>);
    } else {
      return (
        <Text style={styles.alert}>Invalid phone number</Text>
      )
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Account</Text>
      {!loading ? (
        data?.signUp.__typename === "CreateUserSuccess" ? (
          <Text>Account created succesfully! Logging you in...</Text>
        ) : (
          <Text>{data?.signUp.errorMessage}</Text>
        )) : (
        <ActivityIndicator size='large' />
      )}
      <ScrollView style={styles.separator}>
        <TextInput
          style={styles.input}
          onChangeText={(fname) => setFname(fname)}
          value={fname}
          placeholder="First Name*"
        />
        <RequiredField input={fname} />
        <TextInput
          style={styles.input}
          onChangeText={(lname) => setLname(lname)}
          value={lname}
          placeholder="Last Name*"
        />
        <RequiredField input={lname} />
        <TextInput
          style={styles.input}
          onChangeText={(username) => setUsername(username)}
          value={username}
          placeholder="Username*"
        />
        <RequiredField input={username} />
        <TextInput
          style={styles.input}
          onChangeText={(email) => { setEmail(email.replaceAll(/\s+/g, "")); setEmailCheck(false) }}
          onBlur={() => setEmailCheck(true)}
          value={email}
          placeholder="Email*"
        />
        <CheckEmail />
        <RequiredField input={email} />
        <View style={styles.pwordfield}>
          <TextInput
            onChangeText={(password) => setPassword(password)}
            value={password}
            onFocus={() => setPwordRules(true)}
            onBlur={() => setPwordRules(false)}
            secureTextEntry={hidePword}
            placeholder="Password*"
          />
          <FontAwesome style={styles.icon} name={hidePword ? ("eye") : ("eye-slash")} size={15} onPress={() => setHidePword(!hidePword)} />
        </View>
        <RequiredField input={password} />
        {pwordRules ? (<PasswordRules />) : (<></>)}
        <TextInput
          style={styles.input}
          onChangeText={(pword) => { setPwordConfirm(pword); setPwordCheck(false) }}
          onBlur={() => setPwordCheck(true)}
          value={pwordConfirm}
          secureTextEntry={hidePword}
          placeholder="Confirm Password*"
        />
        {(!pwordCheck || (pwordConfirm === password)) ? (
          <RequiredField input={pwordConfirm} />
        ) : (
          (<Text style={styles.alert}>password fields need to match</Text>)
        )}
        <TextInput
          style={styles.input}
          onChangeText={(newPhone) => FormatPhone(newPhone)}
          onBlur={() => setPhoneCheck(true)}
          value={phone}
          keyboardType="phone-pad"
          placeholder="Phone Number (optional)"
        />
        <CheckPhone />
        <Button
          onPress={() => register()}
          text='Sign Up'
          accessibilityLabel='Sign Up Button'
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10
  },
  title: {
    paddingTop: 20,
    fontSize: 32,
    // Not a system font on Android
    // fontFamily: 'Gill Sans MT', 
    marginHorizontal: 25,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
  },
  alert: {
    color: 'red',
    marginHorizontal: 5,
    marginBottom: 8,
  },
  reqs: {
    color: 'gray',
    fontSize: 14,
    marginHorizontal: 5,
    marginBottom: 1,
  },
  icon: {
    marginHorizontal: 5,
  },
  pwordfield: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
  }
});
