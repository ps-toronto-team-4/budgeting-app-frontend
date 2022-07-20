import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View, RequiredField } from '../../components/Themed';
import { RootStackScreenProps, RootTabScreenProps } from '../../types';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { styles, eyeIconSize } from './SignUpScreen.styles';
import Styles from '../../constants/Styles'
import { CreateUserMutation, CreateUserDocument } from '../../components/generated';

export default function SignUpScreen({ navigation }: RootStackScreenProps<'SignUp'>) {

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
      navigation.navigate("Root")
    )
  })

  const register = async () => {
    setCheck(true);
    if (password && fname && username && email) {
      createUser();
    }
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
        <Text style={Styles.alert}>Invalid email address</Text>
      )
    }
  }

  function FormatPhone(newPhone: string) {
    setPhone(newPhone.replace(/[^0-9]/g, ""));
    setPhoneCheck(false);
  }

  function CheckPhone() {
    let phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneCheck || !phone || phoneRegex.test(phone)) {
      return (<></>);
    } else {
      return (
        <Text style={Styles.alert}>Invalid phone number</Text>
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
          style={styles.formField}
          onChangeText={(fname) => setFname(fname)}
          value={fname}
          placeholder="First Name*"
        />
        <RequiredField check={check} input={fname} />
        <TextInput
          style={styles.formField}
          onChangeText={(lname) => setLname(lname)}
          value={lname}
          placeholder="Last Name*"
        />
        <RequiredField check={check} input={lname} />
        <TextInput
          style={styles.formField}
          onChangeText={(username) => setUsername(username)}
          value={username}
          placeholder="Username*"
        />
        <RequiredField check={check} input={username} />
        <TextInput
          style={styles.formField}
          onChangeText={(email) => { setEmail(email.replace(/\s+/g, "")); setEmailCheck(false) }}
          onBlur={() => setEmailCheck(true)}
          value={email}
          placeholder="Email*"
        />
        <CheckEmail />
        <RequiredField check={check} input={email} />
        <View style={styles.formField}>
          <TextInput
            style={styles.pwordinput}
            onChangeText={(password) => setPassword(password)}
            value={password}
            onFocus={() => setPwordRules(true)}
            onBlur={() => setPwordRules(false)}
            secureTextEntry={hidePword}
            placeholder="Password*"
          />
          <FontAwesome style={styles.icon} name={hidePword ? ("eye") : ("eye-slash")} size={eyeIconSize} onPress={() => setHidePword(!hidePword)} />
        </View>
        <RequiredField check={check} input={password} />
        {pwordRules ? (<PasswordRules />) : (<></>)}
        <TextInput
          style={styles.formField}
          onChangeText={(pword) => { setPwordConfirm(pword); setPwordCheck(false) }}
          onBlur={() => setPwordCheck(true)}
          value={pwordConfirm}
          secureTextEntry={hidePword}
          placeholder="Confirm Password*"
        />
        {
          (!pwordCheck || (pwordConfirm === password)) ? (
            <RequiredField check={check} input={pwordConfirm} />
          ) : (
            (<Text style={Styles.alert}>password fields need to match</Text>)
          )
        }
        <TextInput
          style={styles.formField}
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
      </ScrollView >
    </View >
  );
}
