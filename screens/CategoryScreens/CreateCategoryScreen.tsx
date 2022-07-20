import { StyleSheet, Alert, ActivityIndicator } from 'react-native';

import { Text, View, RequiredField } from '../../components/Themed';
import Button from '../../components/Button';
import React, { useEffect, useState } from 'react';
import Styles from '../../constants/Styles';
import { RootStackScreenProps } from '../../types';
import TextInput from '../../components/TextInput';
import ColorPalette from 'react-native-color-palette';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@apollo/client';
import { CreateCategoryDocument, CreateCategoryMutation, GetCategoriesDocument, GetCategoriesQuery } from '../../components/generated';
import { useAuth } from '../../hooks/useAuth';

export default function CreateCategoryScreen({ navigation }: RootStackScreenProps<'CreateCategory'>) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [details, setDetails] = useState('')
  const [check, setCheck] = useState(false) // true if need to check required fields
  const passwordHash = useAuth();

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

  const { data: categoriesData } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
    variables: { passwordHash: passwordHash },
    onError: (error => {
      Alert.alert(error.message);
    })
  });

  const categoryTaken = () => {
    if (categoriesData?.categories.__typename === 'CategoriesSuccess') {
      return true && categoriesData.categories.categories.find((cat) => {
        return cat.name.toLowerCase() === name.toLowerCase()
      });
    } else {
      return false;
    }
  };

  const colorTaken = () => {
    if (categoriesData?.categories.__typename === 'CategoriesSuccess') {
      return true && categoriesData.categories.categories.find((cat) => {
        return cat.colourHex.toLowerCase() === color.toLowerCase()
      });
    } else {
      return false;
    }
  }

  function onSubmit() {
    setCheck(true);
    if (color && name && !categoryTaken() && !colorTaken()) createCategory();
  }

  return (
    <View style={Styles.container}>
      {
        loading ?
          <ActivityIndicator size="large" />
          :
          data?.createCategory.__typename === 'CategorySuccess' ?
            <Text>Category created successfully! Redirecting...</Text> : <Text>{data?.createCategory.errorMessage}</Text>
      }
      <TextInput
        onChangeText={setName}
        value={name}
        placeholder="Name"
      />
      {check && categoryTaken() ? <Text style={Styles.alert}>This category already exists</Text> : <></>}
      <RequiredField check={check} input={name} />
      <View style={style.palette}>
        <ColorPalette
          onChange={(color: string) => setColor(color.substring(1))}
          value={'#' + color}
          colors={['#EB4034', '#EB7734', '#EBC034', '#D3EB34', '#96EB34', '#30B027', '#27B097', '#2797B0', '#273BB0', '#784FD6', '#773D9C', '#B662BF', '#ED72D0', '#B82562', '#99DDFF', '#ABE8A9', '#E6E287', '#77768C', '#DDDDDD']}
          titleStyles={style.colorTitle}
          title={"Select Category Color:"}
          icon={<Ionicons name="checkmark-circle-outline" style={style.icon} size={38} color="black" />}
        />
      </View>
      {check && colorTaken() ? <Text style={Styles.alert}>There is already a category with this color</Text> : <></>}
      <RequiredField check={check} input={color} />
      <TextInput
        onChangeText={(details) => setDetails(details)}
        value={details}
        placeholder="Details"
      />
      <Button text="Save Category" onPress={onSubmit} accessibilityLabel={'Save Category Button'}></Button>
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
