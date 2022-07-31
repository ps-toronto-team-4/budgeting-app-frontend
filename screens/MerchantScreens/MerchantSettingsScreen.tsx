import { useLazyQuery } from "@apollo/client";
import { GetMerchantsDocument, GetMerchantsQuery, GetMerchantsQueryVariables, Merchant, } from "../../components/generated";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
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
            <TouchableOpacity style={Styles.list} onPress={() => navigation.navigate("UpdateMerchant", { id: item.id, name: item.name, description: item.description, category: item.defaultCategory || undefined })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, marginHorizontal: 5 }}>{item.name}</Text>
                </View>
                <MaterialIcons name="navigate-next" size={24} color="black" />
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <Button text="Create New Merchant" accessibilityLabel="Link to Create New" onPress={() => navigation.navigate('CreateMerchant')} />
            {loading ? (<ActivityIndicator size='large' />) : (
                data?.merchants.__typename === "MerchantsSuccess" ? (
                    <FlatList
                        data={data.merchants.merchants}
                        renderItem={renderMerchant}
                    />
                ) : (
                    <View>
                        <Text>{data?.merchants.exceptionName}</Text>
                        <Text>{data?.merchants.errorMessage}</Text>
                    </View>
                ))}
        </View>
    );
}

