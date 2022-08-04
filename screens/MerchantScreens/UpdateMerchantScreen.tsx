import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { DeleteMerchantDocument, DeleteMerchantMutation, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables, GetMerchantsQueryVariables, UpdateMerchantDocument, UpdateMerchantMutation } from "../../components/generated";
import { StyleSheet, View, Text, TextInput, ActivityIndicator, SafeAreaView, Alert, TouchableOpacity, Modal } from 'react-native';
import { RootStackScreenProps } from "../../types";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../../components/buttons/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../../components/generated";
import { DropdownRow } from "../../components/forms/DropdownRow";
import { useAuth } from "../../hooks/useAuth";
import { useRefresh } from "../../hooks/useRefresh";
import modalStyle from "../../constants/Modal";
import Styles from "../../constants/Styles";
import { Form } from "../../components/forms/Form";
import { InputRow } from "../../components/forms/InputRow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InputField } from "../../components/forms/InputField";
import { DropdownField } from "../../components/forms/DropdownField";
import { TrashButton } from "../../components/buttons/TrashButton";

export default function UpdateMerchantScreen({ navigation, route }: RootStackScreenProps<'UpdateMerchant'>) {
    const [getMerchants, { data: manyMerchantsData }] = useLazyQuery<GetMerchantsQuery, GetMerchantsQueryVariables>(GetMerchantsDocument);
    const [getCategories, { data: categoryData, refetch }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {
        onError: (error => {
            Alert.alert(error.message);
        })
    });
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMerchants({ variables: { passwordHash } });
            getCategories({ variables: { passwordHash } });
        },
        redirect: 'ifUnauthorized',
    });
    const { id, name, description, category } = route.params
    const [newName, setNewName] = useState(name)
    const [newDescription, setNewDescription] = useState(description)
    const [newCategory, setNewCategory] = useState<{ id: number, name: string } | undefined>(category)
    const [check, setCheck] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const [deleteMerchant] = useMutation<DeleteMerchantMutation>(DeleteMerchantDocument, {
        variables: { passwordHash: passwordHash, id: route.params?.id },
        onCompleted: (data) => {
            if (data.deleteMerchant.__typename === 'DeleteSuccess') {
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MerchantSettings');
            }
        },
    })

    const [updateMerchant, { loading: merchantLoading, data: merchantData }] = useMutation<UpdateMerchantMutation>(UpdateMerchantDocument, {
        variables: { passwordHash: passwordHash, id, name: newName, description: newDescription, defaultCategoryId: newCategory?.id },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: (data) => {
            if (data.updateMerchant.__typename === 'MerchantSuccess') {
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MerchantSettings');
            }
        }
    })

    useRefresh(() => refetch({ passwordHash }));

    useRefresh(() => {
        AsyncStorage.getItem('New Category')
        .then((val) => {
            if (val) {
                setNewCategory(JSON.parse(val));
            }
        })
        .catch((err) => {
            console.log("Couldn't retrieve new category: " + err)
        });
    }), [categoryData];

    const DeleteButton = () => {
        return (
            <TrashButton onPress={() => setConfirmDelete(true)} />
        );
    }

    const merchantTaken = () => {
        if (manyMerchantsData?.merchants.__typename === "MerchantsSuccess" && newName) {
            // Searches the array of merchants for the name of vendor.
            return manyMerchantsData?.merchants.merchants.find((mer) => {
                return mer.id !== id && mer.name.toLowerCase() === newName.toLowerCase()
            });
        } else {
            return undefined;
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: (_) => <DeleteButton />
        });
    }, [confirmDelete]);

    const merchantError = (() => {
        if (check && !newName) {
            return 'Field is required';
        } else if (check && merchantTaken()) {
            return 'This merchant already exists.';
        }
    })();

    function handleCategorySelect(categoryId: string) {
        if (categoryData?.categories.__typename === "CategoriesSuccess") {
            const foundCategory = categoryData.categories.categories.find(x => x.id === parseInt(categoryId));

            if (foundCategory !== undefined) {
                setNewCategory(foundCategory);
            } else {
                Alert.alert("Category hasn't been created yet.")
            }
        }
    }

    function handleMerchant() {
        setCheck(true)
        if (newName && !merchantTaken()) updateMerchant();
    }

    function handleCreateCategory(value: string) {
        navigation.navigate('CreateCategory', { name: value });
    }

    return (
        <Form>
            <View style={styles.container}>
                <InputField
                    label="Merchant"
                    placeholder="required"
                    defaultValue={newName}
                    onChange={setNewName}
                    errorMessage={merchantError} />
                <InputField
                    label="Details"
                    placeholder="optional"
                    defaultValue={newDescription || ''}
                    onChange={setNewDescription} />
                <DropdownField
                    label="Default Category"
                    placeholder="optional"
                    defaultValue={newCategory?.name}
                    data={
                        categoryData?.categories.__typename === "CategoriesSuccess" ?
                            categoryData.categories.categories.map(cat => {
                                return { id: cat.id.toString(), value: cat.name, color: '#' + cat.colourHex }
                            }) : []
                    }
                    onChange={handleCategorySelect}
                    onCreateNew={handleCreateCategory}
                    labelForCreateNew="category" />
                <View style={styles.buttonContainer}>
                    <Button text={"Update Merchant"} disabled={confirmDelete} accessibilityLabel={"Button to Update Merchant"} onPress={handleMerchant} />
                </View>
                {!merchantLoading ? (
                    merchantData?.updateMerchant.__typename === "MerchantSuccess" ? (
                        <Text>Merchant updated successfully!</Text>
                    ) : (
                        <Text style={Styles.alert}>{merchantData?.updateMerchant.errorMessage}</Text>
                    )) : (
                    <ActivityIndicator size='large' />
                )}
                <Modal
                    transparent={true}
                    visible={confirmDelete}
                    onRequestClose={() => setConfirmDelete(false)}
                >
                    <View style={modalStyle.container}>
                        <Text style={modalStyle.title}>Delete Merchant?</Text>
                        <Text style={modalStyle.text}>Are you sure you want to delete this merchant?</Text>
                        <View style={modalStyle.buttonView}>
                            <Button text="Cancel" onPress={() => setConfirmDelete(false)} size='half' accessibilityLabel='Cancel button' />
                            <Button text="Delete" onPress={() => { deleteMerchant() }} size='half' backgroundColor='red' accessibilityLabel='Delete Category button' />
                        </View>
                    </View>
                </Modal>
            </View>
        </Form>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    buttonContainer: {
        alignSelf: 'center',
        marginTop: 50,
        zIndex: -1,
        elevation: -1,
    },
    fieldLabel: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingLeft: 5,
    },
    fieldInput: {
        fontSize: 15,
        width: 180
    },
    deleteButton: {
    },
});    
