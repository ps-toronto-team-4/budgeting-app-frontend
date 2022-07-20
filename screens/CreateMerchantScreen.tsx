import React, { useEffect } from "react"
import { StyleSheet, SafeAreaView, Alert, TouchableOpacity, Pressable, Modal, ActivityIndicator, TextInput } from 'react-native';
import Button from "../components/Button";
import Colors from '../constants/Colors';
import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from "../constants/Styles";
import { RootStackScreenProps } from "../types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CreateMerchantDocument, CreateMerchantMutation, GetCategoriesDocument, GetCategoriesQuery, GetMerchantsDocument, GetMerchantsQuery } from "../components/generated";
import { DropdownRow } from "../components/DropdownRow";
import { Feather } from "@expo/vector-icons";

export default function CreateMerchant({ navigation }: RootStackScreenProps<'CreateMerchant'>) {

    const [passwordHash, setpasswordHash] = React.useState("");
    const [merchantName, setMerchantName] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [validMerchant, setValidMerchant] = React.useState(true);
    const [check, setCheck] = React.useState(false);
    const [categoryOpen, setCategoryOpen] = React.useState(false);
    const [categoryId, setCategoryId] = React.useState<number | null>(null);
    const [disabledButton, setDisabledButton] = React.useState(false);

    const [createMerchant, { loading: merchantLoading, data: merchantData }] = useMutation<CreateMerchantMutation>(CreateMerchantDocument, {
        variables: { passwordHash: passwordHash, name: merchantName, description: details, defaultCategoryId: categoryId },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: () => {
            console.log('Completed Mutation.');
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
            if (data?.merchants.__typename === "MerchantsSuccess" && merchantName.length != 0) {
                // Searches the array of merchants for the name of vendor. If the user submits a vendor that they already have, 
                // this will display a Found it! on the console.
                if (data?.merchants.merchants.map(ele => ele.name.toLowerCase()).includes(merchantName.toLowerCase())) {
                    console.log("Found it!");
                    setValidMerchant(false);
                    setDisabledButton(true);

                } else {
                    console.log("Merchant Name is not found.");
                    setDisabledButton(false);
                    console.log(merchantName);
                    setValidMerchant(true);
                    createMerchant();

                }


            } else {
                console.log("Something went wrong within the Lazy Query.");
                setDisabledButton(true);
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
                <Text style={styles.alert}>This field is required</Text>
            ))
    }

    function updatedText() {
        setDisabledButton(false);
        setValidMerchant(true);
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.fieldLabel}>Merchant:</Text>

                </View>
                <TextInput
                    style={styles.fieldInput}
                    placeholder='(mandatory)'
                    onChangeText={(merchantName) => setMerchantName(merchantName)}
                    value={merchantName}
                    onChange={() => updatedText()}
                />


            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <RequiredField input={merchantName} />
                {validMerchant ? (<></>) : (<HandleExisting />)}

            </View>

            <View style={styles.row}>
                <Text style={styles.fieldLabel}>Details:</Text>
                <TextInput
                    style={[styles.fieldInput]}
                    placeholder='(optional)'
                    onChangeText={(details) => setDetails(details)}
                    value={details} />
            </View>
            <View style={{}}>
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
            </View>

            <View style={styles.buttonContainer}>
                <Button text="Save Merchant"
                    accessibilityLabel={"Save Merchant"}
                    onPress={() => handleMerchant()}
                    disabled={disabledButton}
                />
            </View>
            {!merchantLoading ? (
                merchantData?.createMerchant.__typename === "MerchantSuccess" ? (
                    <Text>Merchant created successfully!</Text>
                ) : (
                    <Text style={styles.alert}>{merchantData?.createMerchant.errorMessage}</Text>
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
    },
    alert: {
        color: 'red',
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
        alignItems: 'center',
        position: 'relative',
        top: 250,
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

});