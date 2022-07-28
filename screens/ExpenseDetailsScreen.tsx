import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpenseDocument, GetExpenseQuery } from "../components/generated";
import { ColorValue, TouchableOpacity } from "react-native"
import Colors from "../constants/Colors";

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from "../types";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import { useRefresh } from "../hooks/useRefresh";

const EditButton = (onPress: () => void) => (
    <TouchableOpacity style={{ paddingRight: 30 }} onPress={onPress}>
        <Feather name="edit-2" size={20} color="orange" />
    </TouchableOpacity>
);

export function formatDate(date: string | null | undefined): string {
    if (!date) {
        return 'undefined';
    }
    const [year, month, dayOfMonth] = date.split(' ')[0].split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[parseInt(month) - 1]} ${dayOfMonth}, ${year}`;
}

export default function ExpenseDetailsScreen({ navigation, route }: RootStackScreenProps<'ExpenseDetails'>) {
    const passwordHash = useAuth();
    const { expenseId, ...otherParams } = route.params;
    const { loading, error, data, refetch } = useQuery<GetExpenseQuery>(GetExpenseDocument, {
        variables: { passwordHash: passwordHash, expenseId: expenseId }
    });

    useUnauthRedirect();
    useRefresh(refetch, [passwordHash]);

    useEffect(() => {
        if (data) {
            navigation.setOptions({
                headerRight: () => EditButton(() => navigation.navigate('UpdateExpense',
                    data.expense.__typename === 'ExpenseSuccess' ? {
                        id: data.expense.expense.id,
                        amount: data.expense.expense.amount,
                        date: data.expense.expense.date,
                        desc: data.expense.expense.description || '',
                        merchant: { id: data.expense.expense.merchant?.id, name: data.expense.expense.merchant?.name },
                        category: { id: data.expense.expense.category?.id, name: data.expense.expense.category?.name },
                    } : undefined
                ))
            });
        }
    }, [data]);

    function formatAmount(amount: number | null | undefined): string {
        if (!amount) {
            return '0.00';
        }
        return Number(amount).toFixed(2);
    }

    const expenseTypename = data?.expense.__typename;

    return (
        <Screen>
            {
                expenseTypename === "ExpenseSuccess" ?
                    <View>
                        <View style={styles.colHeader}>
                            <Text>Amount</Text>
                        </View>
                        <View style={styles.catAndAmount}>
                            <View style={styles.catColorAndName}>
                                <View style={[styles.catColor, { backgroundColor: data?.expense.expense.category ? "#" + data.expense.expense.category.colourHex : Colors.light.uncategorizedColor }]}></View>
                                <Text style={styles.catName}>{data?.expense.expense.category?.name ? data?.expense.expense.category?.name : "Uncategorized"}</Text>
                            </View>
                            <Text style={styles.amount}>${formatAmount(data?.expense.expense.amount)}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.date}>{formatDate(data?.expense.expense.date)}</Text>
                        </View>
                        <View style={styles.separator}></View>
                        <View style={styles.merchantContainer}>
                            <Text style={styles.merchantLabel}>Merchant:</Text>
                            <Text style={styles.merchant}>{data?.expense.expense.merchant?.name ? data.expense.expense.merchant.name : 'None'}</Text>
                        </View>
                        <View style={styles.descContainer}>
                            <Text style={styles.descLabel}>Details:</Text>
                            <Text>{data?.expense.expense.description ? data.expense.expense.description : 'None'}</Text>
                        </View>
                        <View style={styles.separator}></View>
                    </View>
                    :
                    <Text>{expenseTypename === "FailurePayload" ? data?.expense.exceptionName : ""}</Text>
            }
        </Screen>
    );
}

const styles = StyleSheet.create({
    colHeader: {
        paddingHorizontal: 40,
        alignItems: "flex-end",
        marginTop: 30,
    },
    catAndAmount: {
        paddingHorizontal: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    catColorAndName: {
        flexDirection: "row",
        alignItems: "center",
    },
    catColor: {
        width: 15,
        height: 50,
        marginRight: 10,
    },
    catName: {
        fontWeight: "600",
    },
    amount: {
        fontWeight: "600",
    },
    dateContainer: {
        paddingHorizontal: 40,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    date: {
        fontWeight: "600",
    },
    separator: {
        alignSelf: "center",
        height: 1,
        width: "80%",
        backgroundColor: '#444',
        opacity: 0.2,
        marginTop: 8,
    },
    merchantContainer: {
        flexDirection: 'row',
        paddingHorizontal: 40,
        marginTop: 10,
    },
    merchantLabel: {
        fontWeight: '600',
        marginRight: 10,
    },
    merchant: {},
    descContainer: {
        paddingHorizontal: 40,
        marginTop: 10,
    },
    descLabel: {
        fontWeight: '600',
        marginBottom: 5
    },
});
