import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { ColorValue } from "react-native"

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../hooks/useAuth";
import { Row } from "../components/Row";
import { TouchableRow } from "../components/TouchableRow";
import { ConfirmDeletion } from "../components/ConfirmDeletion";

export default function BudgetScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const passwordHash = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.screen}>
                <Text>Hello from BudgetScreen!</Text>
                <Text>The locally stored password hash is: {passwordHash}</Text>
            </View>
            <ConfirmDeletion onConfirm={() => console.log('deletion confirmed')} />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});