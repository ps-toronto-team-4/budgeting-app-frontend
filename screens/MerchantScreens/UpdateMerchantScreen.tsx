import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { DeleteMerchantDocument, DeleteMerchantMutation, GetCategoriesDocument, GetCategoriesQuery, UpdateMerchantDocument, UpdateMerchantMutation } from "../../components/generated";
import { StyleSheet, View, Text, TextInput, ActivityIndicator, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { RootStackScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../../components/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../../components/generated";
import { DropdownRow } from "../../components/DropdownRow";
import { useAuth } from "../../hooks/useAuth";

export default function UpdateExpenseScreen({ navigation, route }: RootStackScreenProps<'UpdateMerchant'>) {
    const passwordHash = useAuth();
    const [merchantId, setMerchantId] = React.useState<number | null>(route.params?.id || null);
    const [merchantName, setMerchantName] = React.useState<string | undefined>(route.params?.name || undefined);
    const [details, setDetails] = React.useState<string | undefined>(route.params?.description || undefined);
    const [categoryOpen, setCategoryOpen] = React.useState(false);
    const [validMerchant, setValidMerchant] = React.useState(false); //turn false
    const [categoryId, setCategoryId] = React.useState<number | null>(route.params?.category?.id || null);

    const DeleteButton = ({ onPress }: { onPress: () => void }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
                <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>
        );
    }


    const [deleteMerchant, { loading: deleteMerchantLoading, data: deleteMerchantData }] = useMutation<DeleteMerchantMutation>(DeleteMerchantDocument, {
        variables: { passwordHash: passwordHash, id: route.params?.id }

    })

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

    const { loading: manyMerchantsLoading, data: manyMerchantsData } = useQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: { passwordHash: passwordHash }
    });

    const merchantsQuery = () => {
        if (manyMerchantsData?.merchants.__typename === "MerchantsSuccess" && merchantName != undefined && merchantName != "") {

            console.log(merchantName);

            // Searches the array of merchants for the name of vendor. If the user submits a vendor that they already have, 
            // this will display a Found it! on the console.
            if (manyMerchantsData?.merchants.merchants.map(ele => ele.name.toLowerCase()).includes(merchantName.toLowerCase())) {
                console.log("Found it!");
                setValidMerchant(true);

            } else {
                console.log("Merchant Name is not found.");
                // console.log(merchantName);
                setValidMerchant(false);
                updateMerchant();

            }


        } else {
            console.log("Something went wrong within the Query.");
        }


    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: (_) => <DeleteButton onPress={handleDelete} />
        });
    }, []);

    function handleDelete() {
        deleteMerchant();
        navigation.navigate('Root', { screen: 'Profile', params: { refresh: true } });
    }

    function MerchantNotFound() {

        if (validMerchant) {
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

    function RequiredField({ input }: { input: string | undefined }) {
        return (
            (input) ? (
                <></>
            ) : (
                <Text style={styles.alert}>this field is required</Text>
            ))
    }



    function handleMerchant() {
        merchantsQuery();
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.row]}>
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
            {validMerchant ? (<MerchantNotFound />) : (<></>)}

            <View style={[styles.row]}>
                <Text style={[styles.fieldLabel]}>Details:</Text>
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
                onExpand={() => { setCategoryOpen(true) }}
                onCollapse={() => setCategoryOpen(false)}
                defaultValue={route.params?.category?.name}
            />
            <View style={styles.buttonContainer}>
                <Button text={"Update Merchant"} accessibilityLabel={"Button to Update Merchant"} onPress={() => handleMerchant()} />
            </View>
            {!merchantLoading ? (
                merchantData?.updateMerchant.__typename === "MerchantSuccess" ? (
                    <Text>Merchant updated successfully!</Text>
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
