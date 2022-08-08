import { useLazyQuery } from "@apollo/client";
import { Category, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables } from "../../components/generated";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, ColorValue } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { RootStackScreenProps } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { FlatList } from "react-native";
import { useRefresh } from "../../hooks/useRefresh";
import { ColorCircle } from "../../components/ColorCircle";

interface CategoryItemProps {
    id: string;
    name: string;
    colour: ColorValue;
    onPress: (id: string, name: string) => void;
}

function CategoryItem(props: CategoryItemProps) {
    return (
        <TouchableHighlight
            style={styles.row}
            onPress={() => props.onPress(props.id, props.name)}
            underlayColor="rgba(0,0,0,0.1)">
            <View style={styles.itemContainer}>
                <View style={styles.colorAndNameContainer}>
                    <ColorCircle color={props.colour} size={24} />
                    <Text style={{ fontSize: 22, marginHorizontal: 5, marginLeft: 15, fontWeight: 'bold' }}>{props.name}</Text>
                </View>
                <MaterialIcons name="navigate-next" size={28} color="black" />
            </View>
        </TouchableHighlight>
    );
}

export default function CategorySettingsScreen({ navigation: nav }: RootStackScreenProps<'CategorySettings'>) {
    const [getCategories, { data, loading, refetch }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {
        onError: (error) => Alert.alert(error.message),
    });
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => getCategories({ variables: { passwordHash } }),
        redirect: 'ifUnauthorized',
    });
    useRefresh(() => refetch({ passwordHash }));

    function renderCategory({ item }: { item: Category }) {
        return <CategoryItem
            id={item.id.toString()}
            name={item.name}
            colour={item.id === -1 ? 'plus' : `#${item.colourHex}`}
            onPress={() =>
                item.id === -1 ?
                    nav.navigate('CreateCategory')
                    :
                    nav.navigate('EditCategory', {
                        id: item.id,
                        name: item.name,
                        color: `#${item.colourHex}`,
                    })
            } />;
    }

    return (
        <View style={styles.screen}>
            {loading ? (<ActivityIndicator size='large' />) : (
                data?.categories.__typename === "CategoriesSuccess" ? (
                    <FlatList
                        data={
                            [
                                { id: -1, name: 'New category', colourHex: 'ffffff' },
                                ...data.categories.categories.slice().sort((cat1, cat2) => {
                                    return cat1.name > cat2.name ? 1 : -1
                                })
                            ]
                        }
                        renderItem={renderCategory}
                        ListFooterComponent={<View style={{ height: 20 }} />}
                    />
                ) : (
                    <View>
                        <Text>{data?.categories.exceptionName}</Text>
                        <Text>{data?.categories.errorMessage}</Text>
                    </View>
                ))}
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
        right: 15,
        bottom: 15,
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
