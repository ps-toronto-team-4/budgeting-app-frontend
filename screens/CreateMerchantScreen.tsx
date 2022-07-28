import { useEffect, useState } from "react"
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
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { InputRow } from "../components/InputRow";
import { Screen } from "../components/Screen";

export default function CreateMerchant({ navigation }: RootStackScreenProps<'CreateMerchant'>) {
    const passwordHash = useAuth();
    const [merchantName, setMerchantName] = useState("");
    const [details, setDetails] = useState("");
    const [validMerchant, setValidMerchant] = useState(true);
    const [check, setCheck] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [disabledButton, setDisabledButton] = useState(false);

    useUnauthRedirect();

    const [createMerchant, { loading: merchantLoading, data: merchantData }] = useMutation<CreateMerchantMutation>(CreateMerchantDocument, {
        variables: { passwordHash: passwordHash, name: merchantName, description: details, defaultCategoryId: categoryId },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: () => {
            console.log('Completed Mutation.');
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate('CreateExpense');
        }
    });

    const { loading: categoryLoading, data: categoryData } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
        variables: { passwordHash: passwordHash },
        onError: (error => {
            Alert.alert(error.message);
        }),
    });

    const { loading: manyMerchantsLoading, data: manyMerchantsData } = useQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: { passwordHash: passwordHash }
    });


    const handleMerchant = () => {
        setCheck(true);
        merchantsQuery();
    };

    const merchantsQuery = () => {
        if (manyMerchantsData?.merchants.__typename === "MerchantsSuccess" && merchantName.length != 0) {
            // Searches the array of merchants for the name of vendor. If the user submits a vendor that they already have, 
            // this will display a Found it! on the console.
            if (manyMerchantsData?.merchants.merchants.map(ele => ele.name.toLowerCase()).includes(merchantName.toLowerCase())) {
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
    };

    function handleCategorySelect(categoryName: String) {
        if (categoryData?.categories.__typename == "CategoriesSuccess") {
            const foundCategory = categoryData.categories.categories.find(x => x.name == categoryName);

            if (foundCategory !== undefined) {
                setCategoryId(foundCategory.id);
            }
        }
    }

    function onChangeMerchant(text: string) {
        setMerchantName(text);
        setDisabledButton(false);
        setValidMerchant(true);
    }

    const merchantError = (() => {
        if (check && !merchantName) {
            return 'Field is required';
        } else if (check && !validMerchant) {
            return 'Name already taken';
        }
    })();

    return (
        <Screen>
            <View style={styles.container}>
                <InputRow
                    label="Merchant:"
                    placeholder="Enter merchant name*"
                    value={merchantName}
                    onChangeText={onChangeMerchant}
                    error={merchantError}
                    topBorder />
                <InputRow
                    label="Details:"
                    placeholder="Enter details"
                    value={details}
                    onChangeText={setDetails}
                    topBorder />
                <DropdownRow
                    label="Category"
                    data={
                        categoryData?.categories.__typename == "CategoriesSuccess" ?
                            categoryData.categories.categories.map(x => { return { id: x.id.toString(), name: x.name } }) : []
                    }
                    onSelect={handleCategorySelect}
                    expanded={categoryOpen}
                    onExpand={() => { setCategoryOpen(true); }}
                    onCollapse={() => setCategoryOpen(false)}
                    topBorder
                    bottomBorder={!categoryOpen} />
                <View style={styles.buttonContainer}>
                    <Button text="Save Merchant"
                        accessibilityLabel="Save Merchant"
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
            </View>
        </Screen>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});
