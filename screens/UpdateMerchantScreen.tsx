import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import { CreateExpenseDocument, CreateExpenseMutation, CreateMerchantDocument, CreateMerchantMutation, GetCategoriesDocument, GetCategoriesQuery, UpdateExpenseDocument, UpdateExpenseMutation, UpdateMerchantDocument, UpdateMerchantMutation } from "../components/generated";

import { StyleSheet, View, Text, TextInput, FlatList, TouchableHighlight, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { RootStackScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "../constants/Colors";
import AdaptiveTextInput from "../components/AdaptiveTextInput";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../components/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../components/generated";
import { DropdownRow } from "../components/DropdownRow";

export default function UpdateExpenseScreen({ navigation, route }: RootStackScreenProps<'UpdateExpense'>) {
    const [passwordHash, setpasswordHash] = React.useState("");
    const [merchantName, setMerchantName] = React.useState("");
    const [merchantId, setMerchantId] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [validMerchant, setValidMerchant] = React.useState(true);
    const [check, setCheck] = React.useState(false);
    const [categoryOpen, setCategoryOpen] = React.useState(false);
    const [categoryId, setCategoryId] = React.useState<number | null>(null);

    const [updateMerchant, { loading: merchantLoading, data: merchantData }] = useMutation<UpdateMerchantMutation>(UpdateMerchantDocument, {
        variables: { passwordHash: passwordHash, id: merchantId, name: merchantName, description: details, defaultCategoryId: categoryId },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: () => {
            console.log('Update Mutation.');
            navigation.navigate('Root');
        }
    })

    const { loading: categoryLoading, data: categoryData } = useQuery<GetCategoriesQuery>(GetCategoriesDocument,
        {
            variables: { passwordHash: passwordHash },
            onError: (error => {
                Alert.alert(error.message);
            })
        }
    )

    const [merchantsQuery] = useLazyQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: { passwordHash: passwordHash },
        onCompleted: (data) => {
            if (data?.merchants.__typename === "MerchantsSuccess") {

                // Searches the array of merchants for the name of vendor. If the user submits a vendor that they already have, 
                // this will display a Found it! on the console.
                if (data?.merchants.merchants.map(ele => ele.name.toLowerCase()).includes(merchantName.toLowerCase())) {
                    console.log("Found it!");
                    setValidMerchant(false);

                } else {
                    console.log("Merchant Name is not found.");
                    console.log(merchantName);
                    setValidMerchant(true);
                    updateMerchant();
                }


            } else {
                console.log("Something went wrong within the Lazy Query.");
            }

        },
        onError: (error) => {
            console.log(error.message);
        }
    });



    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('passwordHash')
            if (value != null) {
                setpasswordHash(value);
            }
        } catch (e) {
            setpasswordHash('undefined');
        }
    }



    const handleMerchant = () => {
        setCheck(true);
        merchantsQuery();

    }

    function HandleExisting() {

        if (!check || !validMerchant) {
            return (
                <Text style={styles.alert}>This merchant already exists.</Text>
            );
        } else {
            return (<></>);
        }
    }

    function handleCategorySelect(categoryName: String) {
        if (categoryData?.categories.__typename == "CategoriesSuccess") {
            const foundCategory = categoryData.categories.categories.find(x => x.name == categoryName);

            if (foundCategory !== undefined) {
                setCategoryId(foundCategory.id);
            }
        }
    }

    function RequiredField({ input }: { input: string }) {
        return (
            (!check || input) ? (
                <></>
            ) : (
                <Text style={styles.alert}>this field is required</Text>
            ))
    }



    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.categoryContainer]}>
                <View>
                    <Text style={styles.fieldLabel}>Merchant:</Text>

                </View>
                <TextInput
                    style={styles.fieldInput}
                    placeholder='(mandatory)'
                    onChangeText={(merchantName) => setMerchantName(merchantName)}
                    value={merchantName} />
            </View>
            <RequiredField input={merchantName} />
            {validMerchant ? (<></>) : (<HandleExisting />)}

            <View style={[styles.categoryContainer]}>
                <Text style={[styles.fieldLabel, { width: '100%' }]}>Details:</Text>
                <TextInput
                    style={styles.fieldInput}
                    placeholder='(optional)'
                    onChangeText={(details) => setDetails(details)}
                    value={details} />
            </View>

            <DropdownRow
                label="Categories"
                data={
                    categoryData?.categories.__typename == "CategoriesSuccess" ?
                        categoryData.categories.categories.map(x => x.name) : []
                }
                onSelect={handleCategorySelect}
                expanded={categoryOpen}
                onExpand={() => { setCategoryOpen(true); }}
                onCollapse={() => setCategoryOpen(false)} />
            <View style={styles.buttonBox}>
                <Button text={"Save Merchant"} accessibilityLabel={"Save Merchant"} onPress={() => handleMerchant()} />
            </View>
            {!merchantLoading ? (
                merchantData?.updateMerchant.__typename === "MerchantSuccess" ? (
                    <Text>Merchant created successfully!</Text>
                ) : (
                    <Text style={styles.alert}>{merchantData?.updateMerchant.errorMessage}</Text>
                )) : (
                <ActivityIndicator size='large' />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryContainer: {
        flexDirection: "row",
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        paddingHorizontal: 90,
    },
    categoryLabel: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    categoryInput: {
        fontSize: 15,
    },
    buttonBox: {
        position: "absolute",
        bottom: 75,

    },
    alert: {
        color: 'red',
    },
    row: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    detailsRow: {
        flexDirection: 'row',
        paddingHorizontal: 27,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
    },
    detailsIconAndLabel: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        marginRight: 27,
        alignItems: 'center',
    },
    detailsIcon: {
        transform: [{ rotateZ: '90deg' }, { rotateY: '180deg' }],
        marginRight: 5,
    },
    detailsInput: {
        fontSize: 15,
        width: 250,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
    },
    listItem: {
        fontSize: 15,
    },
    fieldLabel: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    fieldInput: {
        fontSize: 15,
        width: 180
    },


});
