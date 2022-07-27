import React from "react"
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Button from "../../components/Button";
import { Text, View } from '../../components/Themed';
import { RootStackScreenProps } from "../../types";
import { useMutation, useQuery } from "@apollo/client";
import { CreateMerchantDocument, CreateMerchantMutation, GetCategoriesDocument, GetCategoriesQuery, GetMerchantDocument, GetMerchantQuery, GetMerchantsDocument, GetMerchantsQuery } from "../../components/generated";
import { DropdownRow } from "../../components/DropdownRow";
import { useAuth } from "../../hooks/useAuth";
import { useUnauthRedirect } from "../../hooks/useUnauthRedirect";
import { InputRow } from "../../components/InputRow";
import { Screen } from "../../components/Screen";
import { useRefresh } from "../../hooks/useRefresh";

export default function CreateMerchant({ navigation }: RootStackScreenProps<'CreateMerchant'>) {
    
    const passwordHash = useAuth();
    const [merchantName, setMerchantName] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [categoryId, setCategoryId] = React.useState<number | undefined>();
    const [check, setCheck] = React.useState(false);
    const [disabledButton, setDisabledButton] = React.useState(false);
    const [categoryOpen, setCategoryOpen] = React.useState(false);

    useUnauthRedirect();

    const [createMerchant, { loading: merchantLoading, data: merchantData }] = useMutation<CreateMerchantMutation>(CreateMerchantDocument, {
        variables: { passwordHash: passwordHash, name: merchantName, description: details, defaultCategoryId: categoryId },
        onError: (error => {
            Alert.alert(error.message);
        }),
        onCompleted: () => {
            console.log('Completed Mutation.');
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MerchantSettings');
        }
    });

    const { data: categoryData, refetch } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
        variables: { passwordHash: passwordHash },
        onError: (error => {
            Alert.alert(error.message);
        }),
    });

    const { data: manyMerchantsData } = useQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: { passwordHash: passwordHash }
    });

    useRefresh(refetch, [passwordHash]);

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

    function handleCategorySelect(categoryName: String) {
        if (categoryData?.categories.__typename == "CategoriesSuccess") {
            const foundCategory = categoryData.categories.categories.find(x => x.name == categoryName);

            if (foundCategory !== undefined) {
                setCategoryId(foundCategory.id);
            }
        }
    }

    const handleMerchant = () => {
        setCheck(true);
        if (merchantName && !merchantTaken()) createMerchant();
    };

    return (
        <Screen>
            <View style={styles.container}>
                <InputRow
                    label="Merchant:"
                    placeholder="(mandatory)"
                    value={merchantName}
                    onChangeText={setMerchantName}
                    error={merchantError}
                    topBorder />
                <InputRow
                    label="Details:"
                    placeholder="(optional)"
                    value={details}
                    onChangeText={setDetails}
                    topBorder
                    bottomBorder />
                <DropdownRow
                    label="Category"
                    data={
                        categoryData?.categories.__typename == "CategoriesSuccess" ?
                            categoryData.categories.categories.map(x => { return { id: x.id, name: x.name} }) : []
                    }
                    onSelect={handleCategorySelect}
                    expanded={categoryOpen}
                    onExpand={() => { setCategoryOpen(true); }}
                    onCollapse={() => setCategoryOpen(false)}
                    bottomBorder />
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
        position: 'absolute',
        bottom: '5%'
    },
});
