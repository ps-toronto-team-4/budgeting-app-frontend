import React, { useEffect } from "react"
import { StyleSheet, SafeAreaView, Alert, TouchableOpacity, Pressable, Modal, ActivityIndicator, TextInput } from 'react-native';
import Button from "../components/Button";
import Colors from '../constants/Colors';
import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from "../constants/Styles";
import { RootStackScreenProps } from "../types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CreateMerchantDocument, CreateMerchantMutation, GetMerchantsDocument, GetMerchantsQuery } from "../components/generated";

export default function CreateMerchant({ navigation }: RootStackScreenProps<'CreateMerchant'>) {

    const [passwordHash, setpasswordHash] = React.useState("");
    const [merchantName, setMerchantName] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [defCategoryId, setDefCategoryId] = React.useState("");
    const [validMerchant, setValidMerchant] = React.useState(true);
    const [check, setCheck] = React.useState(false);

    const [createMerchant, { loading, data }] = useMutation<CreateMerchantMutation>(CreateMerchantDocument, {
        variables: { passwordHash: passwordHash, name: merchantName, description: details, defaultCategoryId: defCategoryId },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: () => {
            console.log('Completed Mutation.');
        }
    })

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
                }


            } else {
                console.log("Something went wrong within the Lazy Query.");
            }

            if (validMerchant) {
                console.log("I was here"); // Reaches this part of the code.
                createMerchant();
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


    function RequiredField({ input }: { input: string }) {
        return (
            (!check || input) ? (
                <></>
            ) : (
                <Text style={styles.alert}>this field is required</Text>
            ))
    }

    return (
        <SafeAreaView style={Styles.container}>
            <View style={[styles.categoryContainer]}>
                <Text style={styles.categoryLabel}>Merchant:</Text>
                <TextInput
                    style={styles.categoryInput}
                    placeholder='(mandatory)'
                    onChangeText={(merchantName) => setMerchantName(merchantName)}
                    value={merchantName} />
            </View>
            <RequiredField input={merchantName} />
            {validMerchant ? (<></>) : (<HandleExisting />)}

            <View style={[styles.categoryContainer]}>
                <Text style={[styles.categoryLabel, { width: '100%' }]}>Details:</Text>
                <TextInput
                    style={styles.categoryInput}
                    placeholder='(optional)'
                    onChangeText={(details) => setDetails(details)}
                    value={details} />
            </View>

            <View style={[styles.categoryContainer]}>
                <Text style={[styles.categoryLabel, { width: '100%' }]}>Category:</Text>
                <TextInput
                    style={styles.categoryInput}
                    placeholder='(optional)'
                    onChangeText={(defCategoryId) => setDefCategoryId(defCategoryId)}
                    value={defCategoryId} />
            </View>

            <View style={styles.buttonBox}>
                <Button text={"Save Merchant"} accessibilityLabel={"Save Merchant"} onPress={() => handleMerchant()} />
            </View>
            {!loading ? (
                data?.createMerchant.__typename === "MerchantSuccess" ? (
                    <Text>Merchant created successfully!</Text>
                ) : (
                    <Text style={styles.alert}>{data?.createMerchant.errorMessage}</Text>
                )) : (
                <ActivityIndicator size='large' />
            )}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    categoryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 100,
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
    },
    categoryLabel: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    categoryInput: {
        fontSize: 20,
    },
    buttonBox: {
        position: "absolute",
        bottom: 75,

    },
    alert: {
        color: 'red',
    },

});