import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import React from 'react';
import { View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    
    const passwordHash = useAuth();

    const navigate = () => {
        navigation.navigate('CategorySettings');
    }

    const logout = () => {
        AsyncStorage.removeItem('passwordHash').then(() => {
            navigation.navigate('Welcome');
        });
    };

    return (
        <View>
            <Text>Hello from ProfileScreen!</Text>
            <Text>The locally stored password hash is: {passwordHash}</Text>
            <Button text="Category Settings" accessibilityLabel="Category Settings Link" onPress={navigate}/>
            <Button text="Logout" onPress={logout} accessibilityLabel="Logout Button" />
        </View>
    );
}
