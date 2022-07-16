import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpenseDocument, GetExpenseQuery } from "../components/generated";
import { ColorValue } from "react-native"

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from "../types";

export default function ExpenseDetailsScreen({ navigation, route }: RootStackScreenProps<'ExpenseDetails'>) {
    const [ passwordHash, setPasswordHash ] = React.useState("");
    // const { expenseId, ...otherParams } = route.params; // uncomment after done testing
    const expenseId = 1; // delete after done testing
    const { loading, error, data } = useQuery<GetExpenseQuery>(GetExpenseDocument, {
        variables: { passwordHash: passwordHash, expenseId: expenseId }
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('passwordHash')
            if (value != null) {
                setPasswordHash(value);
            }
        } catch (e) {
            setPasswordHash('undefined');
        }
    }

    return (
        <View>
            <Text>Hello from ExpenseDetailsScreen!</Text>
            <Text>
                {
                    data?.expense.__typename === "ExpenseSuccess" ?
                        "Amount: " + data.expense.expense.amount :
                        data?.expense.__typename === "FailurePayload" ?
                            data.expense.exceptionName : ""
                }
            </Text>
        </View>
    );
}



const styles = StyleSheet.create({

});
