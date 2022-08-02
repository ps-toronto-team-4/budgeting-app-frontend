import { useLazyQuery, useQuery } from "@apollo/client";
import { Category, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables } from "../../components/generated";
import { ActivityIndicator, Alert, TouchableOpacity, StyleSheet, TouchableHighlight } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';
import { RootStackScreenProps } from "../../types";
import Button from "../../components/buttons/Button";
import { useAuth } from "../../hooks/useAuth";
import { FlatList } from "react-native";
import Styles from "../../constants/Styles";
import { useRefresh } from "../../hooks/useRefresh";
import { Form } from "../../components/forms/Form";
import AddButton from "../../components/buttons/AddButton";
import { ColorCircle } from "../../components/ColorCircle";

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
            <TouchableHighlight
                style={styles.row}
                onPress={() => navigation.navigate("EditCategory", { id: item.id, name: item.name, color: item.colourHex, details: item.description })}
                underlayColor="rgba(0,0,0,0.1)">
                <View style={styles.itemContainer}>
                    <View style={styles.colorAndNameContainer}>
                        <ColorCircle color={'#' + item.colourHex} size={24} />
                        <Text style={{ fontSize: 22, marginHorizontal: 5, marginLeft: 15, fontWeight: 'bold' }}>{item.name}</Text>
                    </View>
                    <MaterialIcons name="navigate-next" size={28} color="black" />
                </View>
            </TouchableHighlight>
        );
    }

    return (
        <View style={styles.screen}>
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
            <View style={styles.addBtnContainer}>
                <AddButton size={100} onPress={() => navigation.navigate('CreateCategory')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    addBtnContainer: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    row: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    },
    itemContainer: {
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    colorAndNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 250,
    },
});
