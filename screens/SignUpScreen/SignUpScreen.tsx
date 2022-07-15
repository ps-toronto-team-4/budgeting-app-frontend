import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { styles, eyeIconSize } from './SignUpScreen.styles';
import { CreateUserMutation, CreateUserDocument } from '../../components/generated';
import PhoneInput from 'react-native-phone-number-input';

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
  const [userCheck, setUserCheck] = useState(false)
  const [pwordRules, setPwordRules] = useState(false)
  const [emailCheck, setEmailCheck] = useState(false)
  const [phoneCheck, setPhoneCheck] = useState(false)
  const [hidePword, setHidePword] = useState(true)

  // Create user graphql query
  const [createUser, { loading, data }] = useMutation<CreateUserMutation>(CreateUserDocument, {
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
        <Text style={styles.alert}>This field is required</Text>
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
    console.log('before: ' + newPhone);
    setPhone(phone + newPhone.replaceAll(/[^0-9]/g, ""));
    console.log('after: '+ phone)
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

  function UsernameRules() {
    let minCheck = username.length < 4;
    let maxCheck = username.length >= 16;
    let formatCheck = /^[A-Za-z0-9_.]*$/.test(username);
    if (username && userCheck && minCheck) {
      return (<Text style={styles.alert}>Username must have at least 4 characters</Text>)
    } else if (maxCheck) {
      return (<Text style={styles.alert}>Maximum length reached</Text>)
    } else if (!formatCheck) {
      return (<Text style={styles.alert}>Username can only include letters, numbers, underscore (_) and dot (.)</Text>)
    } else {
      return (<></>);
  }}

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
        <RequiredField input={fname} />
        <TextInput
          style={styles.formField}
          onChangeText={(lname) => setLname(lname)}
          value={lname}
          placeholder="Last Name*"
        />
        <RequiredField input={lname} />
        <TextInput
          style={styles.formField}
          onChangeText={(user) => {setUsername(user.substring(0,16)); setUserCheck(false)}}
          onBlur={() => setUserCheck(true)}
          value={username}
          placeholder="Username*"
        />
        <RequiredField input={username} />
        <UsernameRules/>
        <TextInput
          style={styles.formField}
          onChangeText={(email) => { setEmail(email.replaceAll(/\s+/g, "")); setEmailCheck(false) }}
          onBlur={() => setEmailCheck(true)}
          value={email}
          placeholder="Email*"
        />
        <CheckEmail />
        <RequiredField input={email} />
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
        <RequiredField input={password} />
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
            <RequiredField input={pwordConfirm} />
          ) : (
            (<Text style={styles.alert}>Password fields need to match</Text>)
          )
        }
        <PhoneInput
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textField}
          countryPickerButtonStyle={styles.countryBtn}
          textInputStyle={styles.phoneInput}
          disableArrowIcon={true}
          defaultCode='CA'
          value={phone}
          textInputProps={{onChangeText: (phone) => FormatPhone(phone)}}
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
