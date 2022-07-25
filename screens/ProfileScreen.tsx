import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RootTabScreenProps } from "../types";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }: RootTabScreenProps<'Profile'>) {
    
    const passwordHash = useAuth();

    return (
        <View>
            <Text>Hello from ProfileScreen!</Text>
            <Text>The locally stored password hash is: {passwordHash}</Text>
            <Button text="Categories" accessibilityLabel="Category Settings Link" onPress={() => navigation.navigate('CategorySettings')}/>
            <TouchableOpacity onPress={() => navigation.navigate('MerchantSettings')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, marginHorizontal: 5 }}>Merchants</Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </View>
            </TouchableOpacity>
        </View>
    );
}
