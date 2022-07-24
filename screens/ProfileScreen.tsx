import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import React from 'react';
import { View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function ProfileScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    
    const passwordHash = useAuth();

    const navigate = () => {
        navigation.navigate('CategorySettings');
    }

    return (
        <View>
            <Text>Hello from ProfileScreen!</Text>
            <Text>The locally stored password hash is: {passwordHash}</Text>
            <Button text="Category Settings" accessibilityLabel="Category Settings Link" onPress={navigate}/>
        </View>
    );
}
