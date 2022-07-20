import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from '../../components/Themed';
import { RootStackScreenProps, RootTabScreenProps } from '../../types';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Styles from "../../constants/Styles";
import { styles, eyeIconSize } from './SignUpScreen.styles';
import { CreateUserMutation, CreateUserDocument } from '../../components/generated';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [userCheck, setUserCheck] = useState(false)
  const [pwordRules, setPwordRules] = useState(false)
  const [emailCheck, setEmailCheck] = useState(false)
  const [phoneCheck, setPhoneCheck] = useState(false)
  const [hidePword, setHidePword] = useState(true)

  const [lengthCheck, setLengthCheck] = useState(true)
  const [lettersCheck, setLettersCheck] = useState(true)
  const [numberCheck, setNumberCheck] = useState(true)
  const [specialCheck, setSpecialCheck] = useState(true)
  const [minCheck, setMinCheck] = useState(true)
  const [maxCheck, setMaxCheck] = useState(true)
  const [formatCheck, setFormatCheck] = useState(true)
  const [emailRegex, setEmailRegex] = useState(true)
  const [minPhone, setMinPhone] = useState(true)

  // Create user graphql query
  const [createUser, { loading, data }] = useMutation<CreateUserMutation>(CreateUserDocument, {
    variables: { fname, lname, username, email, phone, password },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (() => setData())
  })

  const register = () => {
    setCheck(true);
    setPwordRules(true);
    if (password && pwordConfirm && (pwordConfirm === password) && fname && lname && email && username) {
      if (lengthCheck && lettersCheck && numberCheck && specialCheck && minCheck && formatCheck && emailRegex && minPhone) {
        createUser();
      }
    }
  }

  useEffect(() => {
    setLengthCheck(password.length >= 8);
    setLettersCheck(/[A-Z]/.test(password) && /[a-z]/.test(password));
    setNumberCheck(/\d/.test(password));
    setSpecialCheck(/[^A-Za-z0-9]/.test(password));
  }, [password]);

  useEffect(() => {
    setMinCheck(username.length >= 4);
    setMaxCheck(username.length === 16);
    setFormatCheck(/^[A-Za-z0-9_.]*$/.test(username));
  }, [username]);

  useEffect(() => {
    setEmailRegex(/^[^/\\*;:,{}\[\]()$?]+@+[^/\\~`*;:,|{}\[\]=()%$?]+[.]{1}[^/\\~`*;:,|{}\[\]=()%$?]+$/.test(email));
  }, [email])

  useEffect(() => {
    setMinPhone(phone.length === 0 || phone.length >= 6);
  }, [phone]);

  const setData = async () => {
    if (data?.signUp.__typename === "CreateUserSuccess") {
      try {
        await AsyncStorage.setItem('passwordHash', data.signUp.passwordHash);
        navigation.replace('Root');
      } catch (error) {
        console.log(error);
        Alert.alert("Something went wrong");
      }
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
    if (!emailCheck || !email || emailRegex) {
      return (<></>);
    } else {
      return (<Text style={styles.alert}>Invalid email address</Text>)
    }
  }

  function FormatPhone(newPhone: string) {
    setPhone(newPhone.replace(/[^0-9]/g, "").substring(0, 15));
    setPhoneCheck(false);
  }

  function CheckPhone() {
    if (phoneCheck && phone && !minPhone) {
      return (<Text style={styles.alert}>Invalid phone number</Text>);
    } else if (phone.length === 15) {
      return (<Text style={styles.alert}>Maximum length reached</Text>)
    } else {
      return (<></>)
    }
  }

  function UsernameRules() {
    if (username && userCheck && !minCheck) {
      return (<Text style={styles.alert}>Username must have at least 4 characters</Text>)
    } else if (maxCheck) {
      return (<Text style={styles.alert}>Maximum length reached</Text>)
    } else if (!formatCheck) {
      return (<Text style={styles.alert}>Username can only include letters, numbers, underscore (_) and dot (.)</Text>)
    } else {
      return (<></>);
    }
  }

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Create a New Account</Text>
      {!loading ? (
        data?.signUp.__typename === "CreateUserSuccess" ? (
          <Text>Account created successfully! Logging you in...</Text>
        ) : (
          <Text style={styles.alert}>{data?.signUp.errorMessage}</Text>
        )) : (
        <ActivityIndicator size='large' />
      )}
      <ScrollView >
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
          onChangeText={(user) => { setUsername(user.substring(0, 16)); setUserCheck(false) }}
          onBlur={() => setUserCheck(true)}
          value={username}
          placeholder="Username*"
        />
        <RequiredField input={username} />
        <UsernameRules />
        <TextInput
          style={styles.formField}
          onChangeText={(email) => { setEmail(email.replace(/\s+/g, "")); setEmailCheck(false) }}
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
          codeTextStyle={styles.codeText}
          disableArrowIcon={true}
          defaultCode='CA'
          textInputProps={{ onChangeText: (phone) => { FormatPhone(phone); setPhoneCheck(false) }, onBlur: () => setPhoneCheck(true), value: phone, style: styles.phoneInput }}
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
