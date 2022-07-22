import { StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';

import { Text, View, RequiredField } from '../../components/Themed';
import Button from '../../components/Button';
import React, { useEffect, useState } from 'react';
import Styles from '../../constants/Styles';
import { RootStackScreenProps } from '../../types';
import TextInput from '../../components/TextInput';
import ColorPalette from 'react-native-color-palette';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/client';
import { UpdateCategoryDocument, UpdateCategoryMutation, GetCategoriesQuery, GetCategoriesDocument } from '../../components/generated';
import { useAuth } from '../../hooks/useAuth';
import { colorsList } from '../../constants/CategoryColors';

export default function EditCategoryScreen({ navigation, route }: RootStackScreenProps<'EditCategory'>) {

  const [check, setCheck] = useState(false)
  const { id, name, color, details } = route.params
  const [newName, setNewName] = useState(name)
  const [newColor, setNewColor] = useState(color)
  const [newDetails, setNewDetails] = useState(details)
  const passwordHash = useAuth();

  const {data: categoriesData} = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
    variables: { passwordHash },
    onError: (error => {
      Alert.alert(error.message);
    })
  });

  const [updateCategory, { loading, data }] = useMutation<UpdateCategoryMutation>(UpdateCategoryDocument, {
    variables: { passwordHash, id, name: newName, color: newColor, details: newDetails },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (data => {
      if (data.updateCategory.__typename === 'CategorySuccess') {
        navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Root");
      }
    })
  });

  const categoryTaken = () => {
    if (categoriesData?.categories.__typename === 'CategoriesSuccess') {
      return categoriesData.categories.categories.find((cat) => {
        return cat.id !== id && cat.name.toLowerCase() === newName.toLowerCase()
      });
    } else {
      return false;
    }
  };

  const colorTaken = () => {
    if (categoriesData?.categories.__typename === 'CategoriesSuccess') {
      return categoriesData.categories.categories.find((cat) => {
        return cat.id !== id && cat.colourHex.toLowerCase() === newColor.toLowerCase()
      });
    } else {
      return false;
    }
  }

  function onSubmit() {
    setCheck(true);
    if (newColor && newName && !categoryTaken() && !colorTaken()) updateCategory();
  }

  return (
      <View style={Styles.container}>
        {loading ? (
          <ActivityIndicator size={'large'}/>
        ) : (
          (data?.updateCategory.__typename === 'CategorySuccess') ? (
            <Text>Category updated successfully! Redirecting...</Text>
          ) : (
            <Text>{data?.updateCategory.errorMessage}</Text>
          )
        )}
        <TextInput
          onChangeText={(name) => setNewName(name)}
          value={newName}
          placeholder="Name"
        />
        { categoryTaken() ? (
          <Text style={Styles.alert}>This category already exists</Text>
        ) : (
          <></>
        )}
        <RequiredField check={check} input={newName} />
        <View style={style.palette}>
        <ColorPalette 
          onChange={(color: string) => setNewColor(color.substring(1))}
          value={'#' + newColor}
          colors={colorsList}
          titleStyles={style.colorTitle}
          title={"Select Category Color:"}
          icon={<Ionicons name="checkmark-circle-outline" style={style.icon} size={38} color="black" />}
        />
        </View>
        { colorTaken() ? (
          <Text style={Styles.alert}>There is already a category with this color</Text>
        ) : (
          <></>
        )}
        <RequiredField check={check} input={newColor} />
        <TextInput
          onChangeText={(details) => setNewDetails(details)}
          value={newDetails ||  ""}
          placeholder="Details"
        />
        <Button text="Save Category" onPress={onSubmit} accessibilityLabel={'Save Category Button'}/>
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
