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

export default function BudgetScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const passwordHash = useAuth();

    return (
        <View style={styles.screen}>
            <Text>Hello from BudgetScreen!</Text>
            <Text>The locally stored password hash is: {passwordHash}</Text>
            <Row topBorder={true} bottomBorder={true}>
                <Text>HI!</Text>
                <Text>HELLO</Text>
            </Row>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
    },
});