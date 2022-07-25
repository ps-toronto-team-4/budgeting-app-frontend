import { useQuery } from "@apollo/client";
import { GetMerchantsDocument, GetMerchantsQuery, Merchant, } from "../../components/generated";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootStackScreenProps } from "../../types";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function MerchantSettingsScreen({ navigation }: RootStackScreenProps<'MerchantSettings'>) {
    
    const passwordHash = useAuth();

    const {data, loading, refetch} = useQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: { passwordHash },
        onError: (error => {
          Alert.alert(error.message);
        })
    });
    
    useFocusEffect(
        React.useCallback(() => {
          refetch();
        },[])
    );

      const renderMerchant = ({item}: {item: Merchant}) => {
        return (
        <TouchableOpacity style={style.merchant} onPress={() => navigation.navigate("UpdateMerchant", {id: item.id, name: item.name, description: item.description})}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginHorizontal: 5 }}>{item.name}</Text>
            </View>
            <MaterialIcons name="navigate-next" size={24} color="black" />
        </TouchableOpacity>
      )}

    return (
        <View>
            <Button text="Create New Merchant" accessibilityLabel="Create Merchant Link" onPress={() => navigation.navigate('CreateMerchant')}/>
                { loading ? (<ActivityIndicator size='large'/>) : (
                    data?.merchants.__typename === "MerchantsSuccess" ? (
                        <FlatList
                            data={data.merchants.merchants}
                            renderItem={renderMerchant}
                        />
                    ) : (
                    <View>
                        {/* <Text>{data?.merchants.exceptionName}</Text>
                        <Text>{data?.merchants.errorMessage}</Text> */}
                    </View>
                ))}
        </View>
    );
}

const style = StyleSheet.create ({
    merchant: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        marginVertical: 5,
        padding: 10
    }
});
