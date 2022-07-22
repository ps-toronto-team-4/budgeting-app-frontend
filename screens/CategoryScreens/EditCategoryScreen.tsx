import { StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';

import { Text, View, RequiredField } from '../../components/Themed';
import Button from '../../components/Button';
import React, { useEffect, useState } from 'react';
import Styles from '../../constants/Styles';
import { RootStackScreenProps } from '../../types';
import TextInput from '../../components/TextInput';
import ColorPalette from 'react-native-color-palette';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/client';
import { UpdateCategoryDocument, UpdateCategoryMutation, GetCategoriesQuery, GetCategoriesDocument, DeleteCategoryMutation, DeleteCategoryDocument } from '../../components/generated';
import { useAuth } from '../../hooks/useAuth';
import { colorsList } from '../../constants/CategoryColors';

export default function EditCategoryScreen({ navigation, route }: RootStackScreenProps<'EditCategory'>) {

  const { id, name, color, details } = route.params
  const [check, setCheck] = useState(false)
  const [newName, setNewName] = useState(name)
  const [newColor, setNewColor] = useState(color)
  const [confirmDelete, setConfirmDelete] = useState(false)
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

  const [deleteCategory, { data: deleteData }] = useMutation<DeleteCategoryMutation>(DeleteCategoryDocument, {
    variables: { passwordHash, id },
    onError: (error => {
      Alert.alert(error.message);
    }),
    onCompleted: (data => {
      if (data.deleteCategory.__typename === 'DeleteSuccess') {
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
        <View style={Styles.palette}>
        <ColorPalette 
          onChange={(color: string) => setNewColor(color.substring(1))}
          value={'#' + newColor}
          colors={colorsList}
          titleStyles={Styles.colorTitle}
          title={"Select Category Color:"}
          icon={<Ionicons name="checkmark-circle-outline" size={30} color="black" />}
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
        <Button text="Delete Category" backgroundColor='red' onPress={() => setConfirmDelete(true)} accessibilityLabel={'Delete Category Button'}/>
        <Modal
        animationType="slide"
        transparent={true}
        visible={confirmDelete}
        onRequestClose={() => setConfirmDelete(false)}
        >
          <View style={style.centeredView}>
            <Text style={style.modalTitle}>Delete Category?</Text>
            <Text style={style.modalText}>Are you sure you want to delete this category?</Text>
            <Text style={style.modalWarn}>Warning: Budgets in this category will also be deleted.</Text>
            <View style={style.buttonView}>
              <Button text="Cancel" onPress={() => setConfirmDelete(false)} size='half' accessibilityLabel='Cancel button'/>
              <Button text="Delete" onPress={() => {deleteCategory()}} size='half' backgroundColor='red' accessibilityLabel='Delete Category button'/>
            </View>
          </View>
        </Modal>
      </View>
  );
}

const style = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: "center",
    marginVertical: '50%',
    marginHorizontal: '10%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonView: {
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-between'
  },
  modalTitle: {
    fontSize: 26,
    // marginHorizontal: 25,
    marginBottom: '10%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center'
  },
  modalWarn: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5
  }
});
