import { Alert, ActivityIndicator, TouchableHighlight } from 'react-native';
import { Text, View, RequiredField } from '../../components/Themed';
import Button from '../../components/buttons/Button';
import React, { useState } from 'react';
import Styles from '../../constants/Styles';
import { RootStackScreenProps } from '../../types';
import TextInput from '../../components/forms/TextInput';
import ColorPalette from 'react-native-color-palette';
import { Ionicons } from '@expo/vector-icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { CreateCategoryDocument, CreateCategoryMutation, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables } from '../../components/generated';
import { useAuth } from '../../hooks/useAuth';
import { colorsList } from '../../constants/CategoryColors';
import { Form } from '../../components/forms/Form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRefresh } from '../../hooks/useRefresh';

export default function CreateCategoryScreen({ navigation, route }: RootStackScreenProps<'CreateCategory'>) {
  const [name, setName] = useState(route.params?.name || '')
  const [color, setColor] = useState('')
  const [details, setDetails] = useState('')
  const [check, setCheck] = useState(false) // true if need to check required fields

  const [getCategories, { data: categoriesData, refetch }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {
    onError: (error => {
      Alert.alert(error.message);
    }),
  });
  const passwordHash = useAuth({
    onRetrieved: (passwordHash) => getCategories({ variables: { passwordHash } }),
    redirect: 'ifUnauthorized',
  });
  useRefresh(() => refetch({ passwordHash }));

  // Create category graphql query
  const [createCategory, { loading, data }] = useMutation<CreateCategoryMutation>(CreateCategoryDocument, {
    variables: { passwordHash, name, color, details },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (data => {
      if (data.createCategory.__typename === 'CategorySuccess') {
        AsyncStorage.setItem('New Category', JSON.stringify({ name, id: data.createCategory.category.id }))
          .then(() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Root"))
          .catch((err) => console.log("Couldn't store new category"))
      }
    })
  })

  const categoryTaken = () => {
    if (categoriesData?.categories.__typename === 'CategoriesSuccess') {
      return categoriesData.categories.categories.find((cat) => {
        return cat.name.toLowerCase() === name.toLowerCase()
      });
    } else {
      return false;
    }
  };

  const colorTaken = () => {
    if (categoriesData?.categories.__typename === 'CategoriesSuccess') {
      return categoriesData.categories.categories.find((cat) => {
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
    <Form>
      <View style={Styles.container}>
        {
          loading ?
            <ActivityIndicator size="large" />
            :
            data?.createCategory.__typename === 'CategorySuccess' ?
              <Text>Category created successfully! Redirecting...</Text> : <Text>{data?.createCategory.errorMessage}</Text>
        }
        <TouchableHighlight>
          <TextInput
            onChangeText={setName}
            value={name}
            placeholder="Name"
          />
        </TouchableHighlight>
        {check && categoryTaken() ? <Text style={Styles.alert}>This category already exists</Text> : <></>}
        <RequiredField check={check} input={name} />
        <View style={Styles.palette}>
          <ColorPalette
            onChange={(color: string) => setColor(color.substring(1))}
            value={'#' + color}
            colors={colorsList}
            titleStyles={Styles.colorTitle}
            title={"Select Category Color:"}
            icon={<Ionicons name="checkmark-circle-outline" size={30} color="black" />}
          />
        </View>
        {check && colorTaken() ? <Text style={Styles.alert}>There is already a category with this color</Text> : <></>}
        <RequiredField check={check} input={color} />
        <TouchableHighlight>
          <TextInput
            onChangeText={(details) => setDetails(details)}
            value={details}
            placeholder="Details"
          />
        </TouchableHighlight>
        <Button text="Save Category" onPress={onSubmit} accessibilityLabel={'Save Category Button'}></Button>
      </View>
    </Form>
  );
}
