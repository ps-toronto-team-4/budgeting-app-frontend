import React from "react"
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Button from "../../components/buttons/Button";
import { Text, View } from '../../components/Themed';
import { RootStackScreenProps } from "../../types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CreateMerchantDocument, CreateMerchantMutation, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables, GetMerchantDocument, GetMerchantQuery, GetMerchantsDocument, GetMerchantsQuery, GetMerchantsQueryVariables } from "../../components/generated";
import { DropdownRow } from "../../components/forms/DropdownRow";
import { useAuth } from "../../hooks/useAuth";
import { InputRow } from "../../components/forms/InputRow";
import { Form } from "../../components/forms/Form";
import { useRefresh } from "../../hooks/useRefresh";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DropdownField } from "../../components/forms/DropdownField";

export default function CreateMerchant({ navigation }: RootStackScreenProps<'CreateMerchant'>) {
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getCategories({ variables: { passwordHash } });
            getMerchants({ variables: { passwordHash } });
        },
        redirect: 'ifUnauthorized',
    });
    const [merchantName, setMerchantName] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [category, setCategory] = React.useState<{ id: number, name: string } | undefined>();
    const [check, setCheck] = React.useState(false);
    const [disabledButton, setDisabledButton] = React.useState(false);
    const [categoryOpen, setCategoryOpen] = React.useState(false);

    const preFillCategory = () => {
        AsyncStorage.getItem('New Category')
            .then((val) => {
                if (val) {
                    setCategory(JSON.parse(val));
                }
            })
            .catch((err) => {
                console.log("Couldn't retrieve new category: " + err)
            })
    }

    const [createMerchant, { loading: merchantLoading, data: merchantData }] = useMutation<CreateMerchantMutation>(CreateMerchantDocument, {
        variables: { passwordHash: passwordHash, name: merchantName, description: details, defaultCategoryId: category?.id },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: () => {
            console.log('Completed Mutation.');
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MerchantSettings');
        }
    });

    const [getCategories, { data: categoryData, refetch }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {
        onError: (error => {
            Alert.alert(error.message);
        }),
    });

    const [getMerchants, { data: manyMerchantsData }] = useLazyQuery<GetMerchantsQuery, GetMerchantsQueryVariables>(GetMerchantsDocument);

    useRefresh(() => {
        preFillCategory();
        refetch({ passwordHash });
    });

    const merchantTaken = () => {
        if (manyMerchantsData?.merchants.__typename === "MerchantsSuccess" && merchantName) {
            // Searches the array of merchants for the name of vendor.
            return manyMerchantsData?.merchants.merchants.find((mer) => {
                return mer.name.toLowerCase() === merchantName.toLowerCase()
            });
        } else {
            return undefined;
        }
    }

    const merchantError = (() => {
        if (check && !merchantName) {
            return 'Field is required';
        } else if (check && merchantTaken()) {
            return 'This merchant already exists.';
        }
    })();

    function handleCategorySelect(categoryId: string) {
        if (categoryData?.categories.__typename == "CategoriesSuccess") {
            const foundCategory = categoryData.categories.categories.find(x => x.id === parseInt(categoryId));

            if (foundCategory !== undefined) {
                setCategory(foundCategory);
            }
        }
    }

    const handleMerchant = () => {
        setCheck(true);
        if (merchantName && !merchantTaken()) createMerchant();
    };

    return (
        <Form>
            <View style={styles.container}>
                <InputRow
                    label="Merchant"
                    placeholder="(mandatory)"
                    value={merchantName}
                    onChangeText={setMerchantName}
                    error={merchantError}
                    topBorder />
                <InputRow
                    label="Details"
                    placeholder="(optional)"
                    value={details}
                    onChangeText={setDetails}
                    topBorder />
                <DropdownRow
                    label="Default Category"
                    data={
                        categoryData?.categories.__typename == "CategoriesSuccess" ?
                            categoryData.categories.categories.map(x => { return { id: x.id, name: x.name } }) : []
                    }
                    onSelect={handleCategorySelect}
                    expanded={categoryOpen}
                    onExpand={() => setCategoryOpen(true)}
                    onCollapse={() => setCategoryOpen(false)}
                    topBorder
                    placeholder={categoryOpen ? "Start typing to search" : "Select Category"}
                    bottomBorder={!categoryOpen}
                    onCreateNew={() => navigation.navigate("CreateCategory")}
                    createLabel="Category"
                    defaultValue={category?.name} />
                <DropdownField
                    label="Default Category"
                    placeholder="optional"
                    data={
                        categoryData?.categories.__typename == "CategoriesSuccess" ?
                            categoryData.categories.categories.map(x => { return { id: x.id.toString(), value: x.name } }) : []
                    }
                    defaultValue={category?.name}
                    onChange={handleCategorySelect} />
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
        </Form>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    alert: {
        color: 'red',
    },
    buttonContainer: {
        alignSelf: 'center',
        marginTop: 50,
    },
});
