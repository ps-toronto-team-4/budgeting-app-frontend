import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { DeleteMerchantDocument, DeleteMerchantMutation, GetCategoriesDocument, GetCategoriesQuery, UpdateMerchantDocument, UpdateMerchantMutation } from "../../components/generated";
import { StyleSheet, View, Text, TextInput, ActivityIndicator, SafeAreaView, Alert, TouchableOpacity, Modal } from 'react-native';
import { RootStackScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../../components/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../../components/generated";
import { DropdownRow } from "../../components/DropdownRow";
import { useAuth } from "../../hooks/useAuth";
import { RequiredField } from "../../components/Themed";
import modalStyle from "../../constants/Modal";
import Styles from "../../constants/Styles";

export default function UpdateExpenseScreen({ navigation, route }: RootStackScreenProps<'UpdateMerchant'>) {
    
    const passwordHash = useAuth();
    const {id, name, description, category} = route.params
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [newName, setNewName] = useState(name)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [newDescription, setNewDescription] = useState(description)
    const [newCategory, setNewCategory] = useState<number | undefined>(undefined)
    const [check, setCheck] = useState(false)

    const { data: manyMerchantsData } = useQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: { passwordHash: passwordHash }
    });

    const [deleteMerchant] = useMutation<DeleteMerchantMutation>(DeleteMerchantDocument, {
        variables: { passwordHash: passwordHash, id: route.params?.id },
        onCompleted: (data) => {
            if (data.deleteMerchant.__typename === 'DeleteSuccess') {
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MerchantSettings');
            }
        },

    })

    const [updateMerchant, { loading: merchantLoading, data: merchantData }] = useMutation<UpdateMerchantMutation>(UpdateMerchantDocument, {
        variables: { passwordHash: passwordHash, id, name: newName, description: newDescription, defaultCategoryId: newCategory },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: (data) => {
            if (data.updateMerchant.__typename === 'MerchantSuccess') {
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MerchantSettings');
            }
        }
    })

    const {data: categoryData, refetch} = useQuery<GetCategoriesQuery>(GetCategoriesDocument,
        {
            variables: { passwordHash: passwordHash },
            onError: (error => {
                Alert.alert(error.message);
            })
        }
    )
    
    // useFocusEffect(
    //     React.useCallback(() => {
    //       refetch();
    //     },[])
    // );
    
    const DeleteButton = () => {
        return (
            <TouchableOpacity onPress={() => {setConfirmDelete(true)}} style={styles.deleteButton}>
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
            headerRight: (_) => <DeleteButton/>
        });
    }, [confirmDelete]);

    function MerchantNotFound() {

        if (merchantTaken()) {
            return (
                <Text style={Styles.alert}>This merchant already exists.</Text>
            );
        } else {
            return (<></>);
        }
    }

    function handleCategorySelect(categoryName: String) {
        if (categoryData?.categories.__typename === "CategoriesSuccess") {
            const foundCategory = categoryData.categories.categories.find(x => x.name === categoryName);

            if (foundCategory !== undefined) {
                setNewCategory(foundCategory.id);
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
        <SafeAreaView style={[styles.screen, { backgroundColor: confirmDelete ? 'grey' : 'white' }]}>
            <View style={[styles.row]}>
                <Text style={styles.fieldLabel}>Merchant:</Text>
                <TextInput
                    style={styles.fieldInput}
                    placeholder='(mandatory)'
                    onChangeText={(merchantName) => setNewName(merchantName)}
                    value={newName} />
            </View>
            <RequiredField check={check} input={newName} />
            <MerchantNotFound/>

            <View style={[styles.row]}>
                <Text style={[styles.fieldLabel]}>Details:</Text>
                <TextInput
                    style={styles.fieldInput}
                    placeholder='(optional)'
                    onChangeText={(details) => setNewDescription(details)}
                    value={newDescription || undefined} />
            </View>
            <View>
                <DropdownRow
                    label="Categories"
                    data={
                        categoryData?.categories.__typename === "CategoriesSuccess" ?
                            categoryData.categories.categories : []
                    }
                    onSelect={handleCategorySelect}
                    expanded={categoryOpen}
                    onExpand={() => setCategoryOpen(true)}
                    onCollapse={() => setCategoryOpen(false)}
                    defaultValue={category?.name}
                    onCreateNew={() => navigation.navigate("CreateCategory")}
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
                    <Button text="Cancel" onPress={() => setConfirmDelete(false)} size='half' accessibilityLabel='Cancel button'/>
                    <Button text="Delete" onPress={() => {deleteMerchant()}} size='half' backgroundColor='red' accessibilityLabel='Delete Category button'/>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.light.background,
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
        top: '30%',
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
