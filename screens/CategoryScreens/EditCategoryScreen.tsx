import { StyleSheet, Alert, ActivityIndicator, Modal, TouchableHighlight } from 'react-native';

import { Text, View, RequiredField } from '../../components/Themed';
import Button from '../../components/buttons/Button';
import React, { useState } from 'react';
import Styles from '../../constants/Styles';
import { RootStackScreenProps } from '../../types';
import TextInput from '../../components/forms/TextInput';
import ColorPalette from 'react-native-color-palette';
import { Ionicons } from '@expo/vector-icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { UpdateCategoryDocument, UpdateCategoryMutation, GetCategoriesQuery, GetCategoriesDocument, DeleteCategoryMutation, DeleteCategoryDocument, GetCategoriesQueryVariables } from '../../components/generated';
import { useAuth } from '../../hooks/useAuth';
import { colorsList } from '../../constants/CategoryColors';
import modalStyle from '../../constants/Modal';
import { Form } from "../../components/forms/Form";

export default function EditCategoryScreen({ navigation, route }: RootStackScreenProps<'EditCategory'>) {

  const { id, name, color, details } = route.params
  const [check, setCheck] = useState(false)
  const [newName, setNewName] = useState(name)
  const [newColor, setNewColor] = useState(color)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [newDetails, setNewDetails] = useState(details)

  const passwordHash = useAuth({
    onRetrieved: (passwordHash) => getCategories({ variables: { passwordHash } }),
    redirect: 'ifUnauthorized',
  });

  const [getCategories, { data: categoriesData }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {
    onError: (error => {
      Alert.alert(error.message);
    }),
  });

  const [updateCategory, { loading, data }] = useMutation<UpdateCategoryMutation>(UpdateCategoryDocument, {
    variables: { passwordHash, id, name: newName, color: newColor, details: newDetails },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (data => {
      if (data.updateCategory.__typename === 'CategorySuccess') {
        navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CategorySettings");
      }
    })
  });

  const [deleteCategory, { data: deleteData }] = useMutation<DeleteCategoryMutation>(DeleteCategoryDocument, {
    variables: { passwordHash, id },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (data => {
      if (data.deleteCategory.__typename === 'DeleteSuccess') {
        navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CategorySettings");
      }
    })
  });

  const categoryTaken = () => {
    if (categoriesData?.categories.__typename === 'CategoriesSuccess') {
      return categoriesData.categories.categories.find((cat) => {
        return cat.id !== id && cat.name.toLowerCase() === newName.toLowerCase()
      });
    } else {
      return undefined;
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
    <Form backdrop={confirmDelete}>
      <View style={Styles.container}>
        {loading ? (
          <ActivityIndicator size={'large'} />
        ) : (
          (data?.updateCategory.__typename === 'CategorySuccess') ? (
            <Text>Category updated successfully! Redirecting...</Text>
          ) : (
            <Text>{data?.updateCategory.errorMessage}</Text>
          )
        )}
        <TouchableHighlight>
          <TextInput
            onChangeText={(name) => setNewName(name)}
            value={newName}
            placeholder="Name"
          />
        </TouchableHighlight>
        {categoryTaken() ? (
          <Text style={Styles.alert}>This category already exists</Text>
        ) : (
          <></>
        )}
        <RequiredField check={check} input={newName} />
        <View style={[Styles.palette]}>
          <ColorPalette
            onChange={(color: string) => setNewColor(color.substring(1))}
            value={'#' + newColor}
            colors={colorsList}
            titleStyles={Styles.colorTitle}
            title={"Select Category Color:"}
            icon={<Ionicons name="checkmark-circle-outline" size={30} color="black" />}
          />
        </View>
        {colorTaken() ? (
          <Text style={Styles.alert}>There is already a category with this color</Text>
        ) : (
          <></>
        )}
        <RequiredField check={check} input={newColor} />
        <TouchableHighlight>
          <TextInput
            onChangeText={(details) => setNewDetails(details)}
            value={newDetails || undefined}
            placeholder="Details"
          />
        </TouchableHighlight>
        <Button text="Save Category" disabled={confirmDelete} onPress={onSubmit} accessibilityLabel={'Save Category Button'} />
        <Button text="Delete Category" disabled={confirmDelete} backgroundColor='red' onPress={() => setConfirmDelete(true)} accessibilityLabel={'Delete Category Button'} />
        <Modal

          transparent={true}
          visible={confirmDelete}
          onRequestClose={() => setConfirmDelete(false)}
        >
          <View style={modalStyle.container}>
            <Text style={modalStyle.title}>Delete Category?</Text>
            <Text style={modalStyle.text}>Are you sure you want to delete this category?</Text>
            <Text style={modalStyle.warning}>Warning: Budgets in this category will also be deleted.</Text>
            <View style={modalStyle.buttonView}>
              <Button text="Cancel" onPress={() => setConfirmDelete(false)} size='half' accessibilityLabel='Cancel button' />
              <Button text="Delete" onPress={() => { deleteCategory() }} size='half' backgroundColor='red' accessibilityLabel='Delete Category button' />
            </View>
          </View>
        </Modal>
      </View>
    </Form>
  );
}


