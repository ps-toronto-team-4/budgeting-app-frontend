import React, { useEffect } from "react"
import { StyleSheet, SafeAreaView, Alert, TouchableOpacity, Pressable, Modal, ActivityIndicator, TextInput } from 'react-native';
import Button from "../components/Button";
import Colors from '../constants/Colors';
import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from "../constants/Styles";
import { RootStackScreenProps } from "../types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CreateMerchantDocument, CreateMerchantMutation, GetMerchantDocument, GetMerchantQuery, GetMerchantsDocument, GetMerchantsQuery } from "../components/generated";

export default function CreateMerchant({ navigation }: RootStackScreenProps<'CreateMerchant'>) {

    const [passwordHash, setpasswordHash] = React.useState("");
    const [merchantName, setMerchantName] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [validMerchant, setValidMerchant] = React.useState(false);

    const [merchantsQuery, { loading, error, data }] = useLazyQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: { passwordHash: passwordHash },
        onCompleted: (data) => {
            if (data?.merchants.__typename === "MerchantsSuccess") {
                for (let index = 0; index < data?.merchants.merchants.length; index++) {
                    const element = data?.merchants.merchants[index];
                    console.log(element);

                }

                // Searches the array of merchants for the name of vendor. If the user submits a vendor that they already have, 
                // this will display a Found it! on the console.
                if (data?.merchants.merchants.map(ele => ele.name.toLowerCase()).includes(merchantName.toLowerCase())) {
                    console.log("Found it!");
                    setValidMerchant(false);

                } else {
                    console.log("Merchant Name is not found.");
                    console.log(merchantName);
                    setValidMerchant(true);
                    // console.log(passwordHash);
                }


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




    const [mutationCreate] = useMutation<CreateMerchantMutation>(CreateMerchantDocument, {
        variables: { passwordHash: passwordHash, merchantName: merchantName },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: (() => navigation.navigate("Root"))
    });

    const handleMerchant = () => {
        setMerchantName(merchantName);
        setDetails(details);
        merchantsQuery();
        //handleExisting();
        //

    }

    function HandleExisting() {
        if (validMerchant) {
            return (
                <Text style={styles.alert}>This merchant already exists.</Text>
            );
        } else {
            return (<></>);
        }
    }






    // function RequiredField({ input }: { input: string }) {
    //     return (
    //         (!check || input) ? (
    //             <></>
    //         ) : (
    //             <Text style={styles.alert}>this field is required</Text>
    //         ))
    // }

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
            {validMerchant ? (<HandleExisting />) : (<></>)}

            <View style={[styles.categoryContainer]}>
                <Text style={[styles.categoryLabel, { width: '100%' }]}>Details:</Text>
                <TextInput
                    style={styles.categoryInput}
                    placeholder='(optional)'
                    onChangeText={(details) => setDetails(details)}
                    value={details} />
            </View>

            <View style={styles.buttonBox}>
                <Button text={"Save Merchant"} accessibilityLabel={"Save Merchant"} onPress={() => handleMerchant()} />
            </View>
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