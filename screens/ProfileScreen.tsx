import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { RootTabScreenProps } from "../types";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import { MaterialIcons } from "@expo/vector-icons";
import Styles from '../constants/Styles';

export default function ProfileScreen({ navigation }: RootTabScreenProps<'Profile'>) {
    
    const passwordHash = useAuth();

    const logout = () => {
        AsyncStorage.removeItem('passwordHash').then(() => {
            navigation.navigate('Welcome');
        });
    };

    useUnauthRedirect();

    return (
        <Screen>
            <Text>Hello from ProfileScreen!</Text>
            <Text>The locally stored password hash is: {passwordHash}</Text>
            <TouchableOpacity accessibilityLabel="Link to Category Settings" onPress={() => navigation.navigate('CategorySettings')}>
                <View style={Styles.list}>
                    <Text style={{ fontSize: 18, marginHorizontal: 5 }}>Categories</Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity accessibilityLabel="Link to Merchant Settings" onPress={() => navigation.navigate('MerchantSettings')}>
                <View style={Styles.list}>
                    <Text style={{ fontSize: 18, marginHorizontal: 5 }}>Merchants</Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </View>
            </TouchableOpacity>
            <Button text="Logout" onPress={logout} accessibilityLabel="Logout Button" />
        </Screen>
    );
}
