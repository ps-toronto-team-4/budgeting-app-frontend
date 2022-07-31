import { useLazyQuery, useQuery } from "@apollo/client";
import { Category, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables } from "../../components/generated";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';
import { RootStackScreenProps } from "../../types";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { FlatList } from "react-native";
import Styles from "../../constants/Styles";
import { useRefresh } from "../../hooks/useRefresh";
import { Screen } from "../../components/Screen";

export default function CategorySettingsScreen({ navigation }: RootStackScreenProps<'CategorySettings'>) {
    const [getCategories, { data, loading, refetch }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {
        onError: (error) => Alert.alert(error.message),
    });
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => getCategories({ variables: { passwordHash } }),
        redirect: 'ifUnauthorized',
    });
    useRefresh(() => refetch({ passwordHash }));

    const renderCategory = ({ item }: { item: Category }) => {
        return (
            <TouchableOpacity style={Styles.list} onPress={() => navigation.navigate("EditCategory", { id: item.id, name: item.name, color: item.colourHex, details: item.description })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 30, marginHorizontal: 15, height: 30, backgroundColor: "#" + item.colourHex, borderRadius: 90, borderWidth: 1 }} />
                    <Text style={{ fontSize: 18, marginHorizontal: 5 }}>{item.name}</Text>
                </View>
                <MaterialIcons name="navigate-next" size={24} color="black" />
            </TouchableOpacity>
        )
    }

    return (
        <Screen>
            <Button text="Create New Category" accessibilityLabel="Create Category Link" onPress={() => navigation.navigate('CreateCategory')} />
            {loading ? (<ActivityIndicator size='large' />) : (
                data?.categories.__typename === "CategoriesSuccess" ? (
                    <FlatList
                        data={data.categories.categories}
                        renderItem={renderCategory}
                    />
                ) : (
                    <View>
                        <Text>{data?.categories.exceptionName}</Text>
                        <Text>{data?.categories.errorMessage}</Text>
                    </View>
                ))}
        </Screen>
    );
}
