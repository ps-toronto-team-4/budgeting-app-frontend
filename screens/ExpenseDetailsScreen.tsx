import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpenseDocument, GetExpenseQuery, GetExpenseQueryVariables } from "../components/generated";
import { ColorValue, TouchableOpacity } from "react-native"
import Colors from "../constants/Colors";

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootStackScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useRefresh } from "../hooks/useRefresh";
import { PencilButton } from "../components/buttons/PencilButton";

export function formatDate(date: string | null | undefined): string {
    if (!date) {
        return 'undefined';
    }
    const [year, month, dayOfMonth] = date.split(' ')[0].split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[parseInt(month) - 1]} ${dayOfMonth}, ${year}`;
}

function formatAmount(amount: number | null | undefined): string {
    if (!amount) {
        return '0.00';
    }
    return Number(amount).toFixed(2);
}

export default function ExpenseDetailsScreen({ navigation, route }: RootStackScreenProps<'ExpenseDetails'>) {
    const { expenseId } = route.params;
    const [getExpense, { data, refetch }] = useLazyQuery<GetExpenseQuery, GetExpenseQueryVariables>(GetExpenseDocument);
    const passwordHash = useAuth({
        onRetrieved: ((passwordHash) => getExpense({ variables: { passwordHash, expenseId } })),
        redirect: 'ifUnauthorized',
    });
    useRefresh(() => refetch({ passwordHash, expenseId }), [expenseId]);

    useEffect(() => {
        if (data) {
            navigation.setOptions({
                headerRight: () =>
                    <PencilButton onPress={() =>
                        navigation.navigate('UpdateExpense',
                            data.expense.__typename === 'ExpenseSuccess' ? {
                                id: data.expense.expense.id,
                                amount: data.expense.expense.amount,
                                date: data.expense.expense.date,
                                desc: data.expense.expense.description || '',
                                merchant: { id: data.expense.expense.merchant?.id, name: data.expense.expense.merchant?.name },
                                category: { id: data.expense.expense.category?.id, name: data.expense.expense.category?.name },
                            } : undefined
                        )}
                    />
            })
        };
    }, [data]);

    const expenseTypename = data?.expense.__typename;

    return (
        <View style={styles.screen}>
            {
                expenseTypename === "ExpenseSuccess" ?
                    <View>
                        <View style={styles.colHeader}>
                            <Text style={styles.amountHeading}>Amount</Text>
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
                        <View style={styles.separator} />
                        <View style={styles.descContainer}>
                            <Text style={styles.descLabel}>Details:</Text>
                            <Text style={styles.desc}>{data?.expense.expense.description ? data.expense.expense.description : 'None'}</Text>
                        </View>
                        <View style={styles.separator}></View>
                    </View>
                    :
                    <Text>{expenseTypename === "FailurePayload" ? data?.expense.exceptionName : ""}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    colHeader: {
        paddingHorizontal: 40,
        alignItems: "flex-end",
        marginTop: 30,
    },
    amountHeading: {
        fontSize: 18,
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
        fontSize: 18,
    },
    amount: {
        fontWeight: "600",
        fontSize: 18,
    },
    dateContainer: {
        paddingHorizontal: 40,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    date: {
        fontWeight: "600",
        fontSize: 18,
    },
    separator: {
        alignSelf: "center",
        height: 1,
        width: "80%",
        backgroundColor: '#444',
        opacity: 0.2,
        marginVertical: 20,
    },
    merchantContainer: {
        flexDirection: 'row',
        paddingHorizontal: 40,
    },
    merchantLabel: {
        fontWeight: '600',
        marginRight: 10,
        fontSize: 18,
    },
    merchant: {
        fontSize: 18,
    },
    descContainer: {
        paddingHorizontal: 40,
    },
    descLabel: {
        fontWeight: '600',
        fontSize: 18,
        marginBottom: 10,
    },
    desc: {
        fontSize: 18,
    },
});
