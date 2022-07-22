import { useQuery } from "@apollo/client";
import { Category, GetCategoriesDocument, GetCategoriesQuery } from "../../components/generated";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../../types";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { FlatList, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function CategorySettingsScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    
    const passwordHash = useAuth();

    const {data, loading, refetch} = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
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

      const renderCategory = ({item}: {item: Category}) => {
        return (
        <TouchableOpacity style={style.category} onPress={() => navigation.navigate("EditCategory", {id: item.id, name: item.name, color: item.colourHex, details: item.description})}>
            <View style={{ width: 30, margin: 5, height: 30, backgroundColor: "#" + item.colourHex, borderRadius: 90, borderWidth: 1 }} />
            <Text style={{ fontSize: 28 }}>{item.name}</Text>
            <MaterialIcons name="navigate-next" size={24} color="black" />
        </TouchableOpacity>
      )}

    return (
        <View>
            <Text>Hello from category settings!</Text>
            <Button text="Create New Category" accessibilityLabel="Create Category Link" onPress={() => navigation.navigate('CreateCategory')}/>
            <ScrollView>
                { loading ? (<ActivityIndicator size='large'/>) : (
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
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create ({
    category: {
        flexDirection: "row",
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        margin: 5
    }
});
