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
    const [detailsHeight, setDetailsHeight] = React.useState(20);


    const [createMerchant, { loading: merchantLoading, data: merchantData }] = useMutation<CreateMerchantMutation>(CreateMerchantDocument, {
        variables: { passwordHash: passwordHash, name: merchantName, description: details, defaultCategoryId: categoryId },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: () => {
            console.log('Completed Mutation.');
            navigation.navigate('CreateExpense', { refresh: true });
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
                    createMerchant();
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