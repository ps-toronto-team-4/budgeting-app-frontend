import { StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';

import { Text, View, RequiredField } from '../components/Themed';
import Button from '../components/Button';
import React, { useEffect, useState } from 'react';
import Styles from '../constants/Styles';
import { RootStackScreenProps } from '../types';
import TextInput from '../components/TextInput';
import ColorPalette from 'react-native-color-palette';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client';
import { CreateCategoryDocument, CreateCategoryMutation } from '../components/generated';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CreateCategoryScreen({ navigation }: RootStackScreenProps<'CreateCategory'>) {
  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [color, setColor] = useState("")
  const [check, setCheck] = useState(false)
  const [selectedColor, setSelectedColor] = useState("")
  const [passwordHash, setPasswordHash] = useState("")

  // Create user graphql query
  const [createCategory, { loading, data }] = useMutation<CreateCategoryMutation>(CreateCategoryDocument, {
    variables: { passwordHash, name, color, details },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (data => {
      if (data.createCategory.__typename === 'CategorySuccess') {
        navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Root");
      }
    })
  })

  const getAuth = async () => {
    try {
      const value = await AsyncStorage.getItem('passwordHash');
      if (value) {
        setPasswordHash(value);
      } else {
        Alert.alert("You must sign in first");
        navigation.replace("Welcome");
      }
    } catch(e) {
      Alert.alert("Something went wrong")
    }
  };
  getAuth();

  useEffect(() => {
    let newColor = selectedColor.substring(1);
    setColor(newColor);
  }, [selectedColor]);

  const saveCategory = () => {
    setCheck(true);
    if(color && name) {
      createCategory();
    } 
  }

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Create a New Category</Text>
      {loading ? (
        <ActivityIndicator size={'large'}/>
      ) : (
        (data?.createCategory.__typename === 'CategorySuccess') ? (
          <Text>Category created successfully! Redirecting...</Text>
        ) : (
          <Text>{data?.createCategory.errorMessage}</Text>
        )
      )}
      <TextInput
        onChangeText={(name) => setName(name)}
        value={name}
        placeholder="Name"
      />
      <RequiredField check={check} input={name} />
      <View style={style.palette}>
      <ColorPalette 
        onChange={(colour: React.SetStateAction<string>) => setSelectedColor(colour)}
        value={selectedColor}
        titleStyles={style.colorTitle}
        title={"Select Category Color:"}
        icon={<Ionicons name="checkmark-circle-outline" style={style.icon} size={38} color="black" />}
      />
      </View>
      <RequiredField check={check} input={color} />
      <TextInput
        onChangeText={(details) => setDetails(details)}
        value={details}
        placeholder="Details"
      />
      <Button text="Save Category" onPress={() => saveCategory()} accessibilityLabel={'Save Category Button'}></Button>
    </View>
  );
}

const style = StyleSheet.create({
  image: {
    height: 150,
    width: 200,
    marginVertical: 80
  },
  registerCaption: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  colorTitle: {
    textAlign: 'center',
    fontSize: 20
  },
  palette: {
    width: '80%'
  },
  icon: {
    paddingLeft: 2,
    paddingBottom: 1
  }
});
