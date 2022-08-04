import { useLazyQuery } from "@apollo/client";
import { GetMerchantsDocument, GetMerchantsQuery, GetMerchantsQueryVariables, Merchant, } from "../../components/generated";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';
import { RootStackScreenProps } from "../../types";
import Button from "../../components/buttons/Button";
import { useAuth } from "../../hooks/useAuth";
import { FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Styles from "../../constants/Styles";
import { useRefresh } from "../../hooks/useRefresh";
import AddButton from "../../components/buttons/AddButton";

export default function MerchantSettingsScreen({ navigation }: RootStackScreenProps<'MerchantSettings'>) {
    const [getMerchants, { data, loading, refetch }] = useLazyQuery<GetMerchantsQuery, GetMerchantsQueryVariables>(GetMerchantsDocument, {
        onError: (error => {
            Alert.alert(error.message);
        })
    });
    const passwordHash = useAuth({ onRetrieved: (passwordHash) => getMerchants({ variables: { passwordHash } }), redirect: 'ifUnauthorized' });
    useRefresh(() => refetch({ passwordHash }));

    const renderMerchant = ({ item }: { item: Merchant }) => {
        return (
            <TouchableHighlight
                style={styles.row}
                onPress={() => navigation.navigate("UpdateMerchant", { id: item.id, name: item.name, description: item.description, category: item.defaultCategory || undefined })}
                underlayColor="rgba(0,0,0,0.1)">
                <View style={styles.itemContainer}>
                    <Text style={{ fontSize: 22, marginHorizontal: 5, fontWeight: 'bold', width: 250 }}>{item.name}</Text>
                    <MaterialIcons name="navigate-next" size={28} color="black" />
                </View>
            </TouchableHighlight>
        )
    }

    return (
        <View style={styles.screen}>
            {loading ? (<ActivityIndicator size='large' />) : (
                data?.merchants.__typename === "MerchantsSuccess" ? (
                    <FlatList
                        data={data.merchants.merchants.slice().sort((merch1, merch2) => merch1.name > merch2.name ? 1 : -1)}
                        renderItem={renderMerchant}
                        ListFooterComponent={<View style={{ height: 20 }} />}
                    />
                ) : (
                    <View>
                        <Text>{data?.merchants.exceptionName}</Text>
                        <Text>{data?.merchants.errorMessage}</Text>
                    </View>
                ))}
            <View style={styles.addBtnContainer}>
                <AddButton size={70} onPress={() => navigation.navigate('CreateMerchant')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    row: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    },
    addBtnContainer: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    itemContainer: {
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

