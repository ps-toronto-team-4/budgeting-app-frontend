import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { GetExpensesDocument, GetExpensesQuery, GetExpensesQueryVariables } from "../components/generated";
import { FlatList } from "react-native";
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import AddButton from "../components/AddButton";
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import { useRefresh } from "../hooks/useRefresh";
import Colors from "../constants/Colors";
import { ExpenseDisplay, ExpenseDisplayProps } from "../components/ExpenseDisplay";
import { formatDate } from "./ExpenseDetailsScreen";
import Button from "../components/Button";

type ExpenseDisplayPropsOrDate = ExpenseDisplayProps | string;

type Expenses = {
    __typename?: "Expense" | undefined;
    amount: number;
    id: number;
    date: string;
    description?: string | null | undefined;
    category?: {
        __typename?: "Category" | undefined;
        colourHex: string;
        name: string;
    } | null | undefined;
    merchant?: {
        __typename?: "Merchant" | undefined;
        name: string;
    } | null | undefined;
}[];

/**
 * Takes a list of expenses, sorts it by date, and prcoesses into an object that ExpenseDisplayProps
 * can display.
 * @param expenses The list of expenses to process.
 * @param onPress Callback that is passed to the ExpenseDisplay component.
 * @returns List of expenses that ExpenseDisplay can understand.
 */
function processExpenses(expenses: Expenses, onPress: (id: number) => void): ExpenseDisplayPropsOrDate[] {
    if (expenses.length === 0) return [];

    // Call map first to copy the array and avoid mutating it while extracting the necessary info
    const preProcessed = expenses.map((expense) => {
        return {
            id: expense.id,
            name: expense.category?.name || 'Uncategorized',
            color: `#${expense.category?.colourHex || Colors.light.uncategorizedColor}`,
            amount: expense.amount,
            onPress: onPress,
            date: expense.date,
            merchant: expense.merchant?.name || '',
        };
    }).sort((ex1, ex2) => { // Sort by date
        if (ex1.date > ex2.date) {
            return -1;
        } else {
            return 1;
        }
    });

    let processed: ExpenseDisplayPropsOrDate[] = [];

    // Add dates to the array whenever the date is different between neighbouring expenses
    for (let i = preProcessed.length - 1; i >= 0; i--) {
        const { date, ...otherProps } = preProcessed[i];
        processed.unshift({ ...otherProps });
        if (i === 0 || preProcessed[i].date !== preProcessed[i - 1].date) {
            processed.unshift(`${preProcessed[i].date}`);
        }
    }

    return processed;
}

function renderItem({ item }: { item: ExpenseDisplayPropsOrDate }) {
    if (typeof item === 'string') {
        return (
            <View style={staticStyles.dateContainer}>
                <Text style={staticStyles.date}>{formatDate(item)}</Text>
            </View>
        );
    } else {
        return <ExpenseDisplay {...item} />
    }
}

function keyExtractor(item: ExpenseDisplayPropsOrDate) {
    if (typeof item === 'string') return item;
    return item.id.toString();
}

export default function ExpensesScreen({ navigation }: RootTabScreenProps<'Expenses'>) {
    const passwordHash = useAuth(); useUnauthRedirect();
    const { data, refetch } = useQuery<GetExpensesQuery, GetExpensesQueryVariables>(GetExpensesDocument, {
        variables: { passwordHash }
    });
    const processedExpenses = useMemo(() => {
        if (data?.expenses.__typename === 'ExpensesSuccess')
            return processExpenses(data.expenses.expenses, (id) => navigation.navigate('ExpenseDetails', { expenseId: id }));
        return [];
    }, [data]);

    useRefresh(refetch, [passwordHash]);

    const handleAddExpense = () => navigation.navigate('CreateExpense');

    if (data === undefined) {
        return <Screen><Text>Loading data...</Text></Screen>;
    } else if (data.expenses.__typename !== 'ExpensesSuccess') {
        return <Screen><Text>Error fetching data.</Text></Screen>;
    } else {
        return (
            <Screen>
                <FlatList
                    data={processedExpenses}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    maxToRenderPerBatch={30} />
                <View style={staticStyles.addExpenseBtn}>
                    <AddButton size={100} onPress={handleAddExpense} />
                </View>
            </Screen>
        );
    }
}

const staticStyles = StyleSheet.create({
    itemSeparator: {
        flex: 1,
        flexBasis: 2,
        backgroundColor: '#c9c9c9',
    },
    addExpenseBtn: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    dateContainer: {
        paddingTop: 20,
        paddingBottom: 10,
        width: 350,
        alignSelf: 'center',
    },
    date: {
        fontSize: 18,
    },
});
