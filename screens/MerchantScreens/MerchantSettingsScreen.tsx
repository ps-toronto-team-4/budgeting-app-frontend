import { useLazyQuery } from "@apollo/client";
import { GetMerchantsDocument, GetMerchantsQuery, GetMerchantsQueryVariables, Merchant, } from "../../components/generated";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { RootStackScreenProps } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { FlatList } from "react-native";
import { useRefresh } from "../../hooks/useRefresh";
import AddButton from "../../components/buttons/AddButton";
import { ColorCircle } from "../../components/ColorCircle";

interface MerchantItemProps {
    id: string;
    name: string;
    onPress: (id: string, name: string) => void;
}

function MerchantItem(props: MerchantItemProps) {
    return (
        <TouchableHighlight
            style={styles.row}
            onPress={() => props.onPress(props.id, props.name)}
            underlayColor="rgba(0,0,0,0.1)">
            <View style={styles.itemContainer}>
                <View style={styles.colorAndNameContainer}>
                    {
                        props.id === '-1' &&
                        <ColorCircle color={'plus'} size={24} />
                    }
                    <Text style={{ fontSize: 22, marginHorizontal: 5, marginLeft: props.id === '-1' ? 15 : 39, fontWeight: 'bold' }}>{props.name}</Text>
                </View>
                <MaterialIcons name="navigate-next" size={28} color="black" />
            </View>
        </TouchableHighlight>
    );
}

export default function MerchantSettingsScreen({ navigation: nav }: RootStackScreenProps<'MerchantSettings'>) {
    const [getMerchants, { data, loading, refetch }] = useLazyQuery<GetMerchantsQuery, GetMerchantsQueryVariables>(GetMerchantsDocument, {
        onError: (error => {
            Alert.alert(error.message);
        })
    });
    const passwordHash = useAuth({ onRetrieved: (passwordHash) => getMerchants({ variables: { passwordHash } }), redirect: 'ifUnauthorized' });
    useRefresh(() => refetch({ passwordHash }));

    const renderMerchant = ({ item }: { item: Merchant }) => {
        return (
            <MerchantItem
                id={item.id.toString()}
                name={item.name}
                onPress={() =>
                    item.id === -1 ?
                        nav.navigate('CreateMerchant')
                        :
                        nav.navigate('UpdateMerchant', { id: item.id, name: item.name })
                } />
        );
    }

    return (
        <View style={styles.screen}>
            {loading ? (<ActivityIndicator size='large' />) : (
                data?.merchants.__typename === "MerchantsSuccess" ? (
                    <FlatList
                        data={
                            [
                                { id: -1, name: 'New merchant' },
                                ...data.merchants.merchants.slice().sort((merch1, merch2) => {
                                    return merch1.name > merch2.name ? 1 : -1
                                })
                            ]
                        }
                        renderItem={renderMerchant}
                        ListFooterComponent={<View style={{ height: 20 }} />}
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
        right: 15,
        bottom: 15,
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

