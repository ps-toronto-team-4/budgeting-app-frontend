import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { ColorValue } from "react-native"

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from "../types";

export default function ExpenseDetailsScreen({ navigation }: RootStackScreenProps<'ExpenseDetails'>) {
    const [passwordHash, setpasswordHash] = React.useState("");

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('passwordHash')
            if (value != null) {
                setpasswordHash(value);
            }
        } catch (e) {
            setpasswordHash('undefined');
        }
    }

    return (
        <View>
            <Text>Hello from ExpenseDetailsScreen!</Text>
            <Text>The locally stored password hash is: {passwordHash}</Text>
        </View>
    );
}



const styles = StyleSheet.create({

});
