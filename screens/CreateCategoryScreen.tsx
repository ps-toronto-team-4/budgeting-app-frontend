import { StyleSheet, Alert, ActivityIndicator } from 'react-native';

import { Text, View, RequiredField } from '../components/Themed';
import Button from '../components/Button';
import React, { useEffect, useState } from 'react';
import Styles from '../constants/Styles';
import { RootStackScreenProps } from '../types';
import TextInput from '../components/TextInput';
import ColorPalette from 'react-native-color-palette';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CreateCategoryDocument, CreateCategoryMutation, GetCategoriesDocument, GetCategoriesQuery } from '../components/generated';
import { getAuth } from '../components/GetAuth';

export default function CreateCategoryScreen({ navigation }: RootStackScreenProps<'CreateCategory'>) {

  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [color, setColor] = useState("")
  const [check, setCheck] = useState(false)
  const [selectedColor, setSelectedColor] = useState("")
  const [passwordHash, setPasswordHash] = useState("")
  const [nameCheck, setNameCheck] = useState(false)
  const [colorCheck, setColorCheck] = useState(false)

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

  const [getCategories] = useLazyQuery<GetCategoriesQuery>(GetCategoriesDocument, {
    variables: { passwordHash },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (data => {
      if (data.categories.__typename === 'CategoriesSuccess') {
        data.categories.categories.forEach((item) => {
          if (item.name === name) {
            setNameCheck(true)
          }
          if (item.colourHex === color) {
            setColorCheck(true)
          }
        })
      }
    })
  })

  getAuth((value: React.SetStateAction<string>) => setPasswordHash(value));

  useEffect(() => {
    let newColor = selectedColor.substring(1);
    setColor(newColor);
  }, [selectedColor]);

  const saveCategory = () => {
    setCheck(true);
    getCategories();
    if (color && name && !colorCheck && !nameCheck) {
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
        onChangeText={(name) => {setName(name); setNameCheck(false)}}
        value={name}
        placeholder="Name"
      />
      {nameCheck? (
        <Text style={Styles.alert}>This category already exists</Text>
      ) : (
        <></>
      )}
      <RequiredField check={check} input={name} />
      <View style={style.palette}>
      <ColorPalette 
        onChange={(colour: React.SetStateAction<string>) => {setSelectedColor(colour); setColorCheck(false)}}
        value={selectedColor}
        colors={['#EB4034', '#EB7734', '#EBC034', '#D3EB34', '#96EB34', '#30B027', '#27B097', '#2797B0', '#273BB0', '#784FD6','#773D9C', '#B662BF', '#ED72D0', '#B82562', '#99DDFF', '#ABE8A9', '#E6E287', '#77768C', '#DDDDDD']}
        titleStyles={style.colorTitle}
        title={"Select Category Color:"}
        icon={<Ionicons name="checkmark-circle-outline" style={style.icon} size={38} color="black" />}
      />
      </View>
      {colorCheck? (
        <Text style={Styles.alert}>There is already a category with this color</Text>
      ) : (
        <></>
      )}
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
