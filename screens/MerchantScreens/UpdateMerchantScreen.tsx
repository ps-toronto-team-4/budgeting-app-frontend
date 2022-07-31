import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { DeleteMerchantDocument, DeleteMerchantMutation, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables, GetMerchantsQueryVariables, UpdateMerchantDocument, UpdateMerchantMutation } from "../../components/generated";
import { StyleSheet, View, Text, TextInput, ActivityIndicator, SafeAreaView, Alert, TouchableOpacity, Modal } from 'react-native';
import { RootStackScreenProps } from "../../types";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../../components/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../../components/generated";
import { DropdownRow } from "../../components/DropdownRow";
import { useAuth } from "../../hooks/useAuth";
import { useRefresh } from "../../hooks/useRefresh";
import modalStyle from "../../constants/Modal";
import Styles from "../../constants/Styles";
import { Screen } from "../../components/Screen";
import { InputRow } from "../../components/InputRow";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [preFill, setPreFill] = useState(false)

    const preFillCategory = () => {
        if (!newCategory && preFill) {
            AsyncStorage.getItem('New Category')
                .then((val) => {
                    if (val) {
                        setNewCategory(JSON.parse(val));
                    }
                })
                .catch((err) => {
                    console.log("Couldn't retrieve new category: " + err)
                })
        }
    }

    useRefresh(preFillCategory, [preFill]);

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

    const DeleteButton = () => {
        return (
            <TouchableOpacity onPress={() => { setConfirmDelete(true) }} style={styles.deleteButton}>
                <AntDesign name="delete" size={24} color={(confirmDelete ? 'grey' : 'red')} />
            </TouchableOpacity>
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

    function handleCategorySelect(categoryName: String) {
        if (categoryData?.categories.__typename === "CategoriesSuccess") {
            const foundCategory = categoryData.categories.categories.find(x => x.name === categoryName);

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

    return (
        <Screen>
            <View style={styles.container}>
                <InputRow
                    label="Merchant:"
                    placeholder="(mandatory)"
                    value={newName}
                    onChangeText={setNewName}
                    error={merchantError}
                    topBorder />
                <InputRow
                    label="Details:"
                    placeholder="(optional)"
                    value={newDescription || ""}
                    onChangeText={setNewDescription}
                    topBorder
                    bottomBorder />
                <View>
                    <DropdownRow
                        label="Default Category"
                        data={
                            categoryData?.categories.__typename === "CategoriesSuccess" ?
                                categoryData.categories.categories : []
                        }
                        onSelect={handleCategorySelect}
                        expanded={categoryOpen}
                        placeholder={categoryOpen ? "Start typing to search" : "Select Category"}
                        onExpand={() => setCategoryOpen(true)}
                        onCollapse={() => setCategoryOpen(false)}
                        defaultValue={newCategory?.name}
                        onCreateNew={() => { navigation.navigate("CreateCategory"); setPreFill(true) }}
                        createLabel="Category"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button text={"Update Merchant"} disabled={confirmDelete} accessibilityLabel={"Button to Update Merchant"} onPress={() => handleMerchant()} />
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
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: '5%'
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
        paddingRight: 30,
    },


});    
