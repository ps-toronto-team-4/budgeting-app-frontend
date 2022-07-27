import { useQuery } from "@apollo/client";
import { ReactElement, useMemo, useState } from "react";
import { GetExpensesDocument, GetExpensesQuery, GetExpensesQueryVariables } from "../components/generated";
import { Button, ColorValue, FlatList, TouchableHighlight } from "react-native";
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../types";
import AddButton from "../components/AddButton";
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import { useRefresh } from "../hooks/useRefresh";
import { Row } from "../components/Row";
import Colors from "../constants/Colors";
import { ExpenseDisplay } from "../components/ExpenseDisplay";

const Separator = () => <View style={staticStyles.itemSeparator} />;

export default function ExpensesScreen({ navigation }: RootTabScreenProps<'Expenses'>) {
    const passwordHash = useAuth(); useUnauthRedirect();
    const [maxExpenses, setMaxExpenses] = useState(20);
    const { data, refetch } = useQuery<GetExpensesQuery, GetExpensesQueryVariables>(GetExpensesDocument, {
        variables: { passwordHash }
    });

    useRefresh(refetch, [passwordHash]);

    function renderItem({ item }: { item: { id: number, name: string, color: ColorValue, amount: number, onPress: (id: number) => void } | string }) {
        if (typeof item === 'string') {
            return <Text>{item}</Text>
        } else {
            return <ExpenseDisplay {...item} />
        }
    }

    function handleAddExpense() {
        navigation.navigate('CreateExpense');
    }

    if (data === undefined) {
        return <Text>Loading data...</Text>;
    } else if (data.expenses.__typename !== 'ExpensesSuccess') {
        return <Text>Error fetching data.</Text>
    } else {
        return (
            <Screen>
                <FlatList data={
                    data.expenses.expenses.filter((expense) => !!expense).map((expense) => {
                        return {
                            id: expense?.id || -1,
                            name: expense?.category?.name || 'Uncategorized',
                            color: `#${expense?.category?.colourHex || Colors.light.uncategorizedColor}`,
                            amount: expense?.amount || 0,
                            onPress: (id: number) => navigation.navigate('ExpenseDetails', { expenseId: id }),
                        };
                    })
                } renderItem={renderItem}></FlatList>
                <View style={staticStyles.addExpenseBtn}>
                    <AddButton size={100} onPress={handleAddExpense} />
                </View>
            </Screen>
        );
    }
}

function ExpensesScreen2({ navigation, route }: RootTabScreenProps<'Expenses'>) {
    const passwordHash = useAuth();
    useUnauthRedirect();
    const [numExpenses, setNumExpenses] = useState(20);
    const { data, refetch } = useQuery<GetExpensesQuery, GetExpensesQueryVariables>(GetExpensesDocument, {
        variables: { passwordHash }
    });
    useRefresh(refetch, [passwordHash]);
    const navigateCallBack = (id: number | null | undefined) => {
        if (id === undefined || id == null) {
            alert("Transaction could not be found!");
        } else {
            navigation.navigate('ExpenseDetails', { expenseId: id });
        }
    }
    const dailyGrouping = splitTransationsOnDate(data, numExpenses);
    function handleAddExpense() {
        navigation.navigate('CreateExpense');
    }

    const FakeFlatList = (
        {
            data,
            title,
            renderItem,
            ItemSeparatorComponent }:
            {
                data: Array<any>,
                title: string,
                key: number | string,
                renderItem: (item: any) => ReactElement,
                ItemSeparatorComponent: () => ReactElement
            }) => {

        const itemsRender = data.map((item: any, index: number) => {

            return (<View key={index}>
                {index != 0 && ItemSeparatorComponent()}
                {renderItem({ item })}
            </View>);
        })

        return (<View>
            <Text>{title}</Text>
            {itemsRender}
            {/* <Text>hi</Text> */}
        </View>)
    };

    return (
        <Screen>
            <ScrollView>
                {dailyGrouping && (
                    <View>
                        {dailyGrouping.map((gItem, index) => {
                            return (<FakeFlatList
                                data={gItem.item}
                                title={gItem.key}
                                key={index}
                                renderItem={({ item }) => <ExpenseDisplay {...item} navigateCallBack={navigateCallBack} />}
                                ItemSeparatorComponent={() => <Separator />}
                            />)
                        })}
                        <Button title="Load More Expenses" onPress={() => setNumExpenses(numExpenses + 20)} />
                    </View>)
                }
                {data?.expenses.__typename == 'FailurePayload' && <View>
                    <Text>{data.expenses.errorMessage}</Text>
                    <Text>{data.expenses.exceptionName}</Text>
                </View>}
            </ScrollView>
            <View style={staticStyles.addExpenseBtn}>
                <AddButton size={100} onPress={handleAddExpense} />
            </View>
        </Screen>
    );
}

const splitTransationsOnDate = (data: GetExpensesQuery | undefined, amountToRender: number) => {
    if (data === undefined || data?.expenses.__typename == 'FailurePayload') {
        return undefined
    }

    let dailyGrouping: { [key: string]: Array<any> } = {};

    if (data.expenses.__typename == 'ExpensesSuccess') {
        const listOfEle = JSON.parse(JSON.stringify(data.expenses.expenses));

        listOfEle.sort((a: any, b: any) => {
            if (a === undefined || b === undefined || a == null || b == null) {
                return 0
            }
            if (a.date > b.date) {
                return -1
            } else if (a.date < b.date) {
                return 1
            }
            return 0
        });
        listOfEle.slice(0, amountToRender).forEach((item: any) => { // REMOIVE THIS AFTER DEMO- TOO LAGGY WITH OUT
            if (item?.date == undefined) {
                console.warn("date is undefined for transation")
                return
            }
            const date = item?.date.split(' ')[0]
            if (!(date in dailyGrouping)) {
                dailyGrouping[date] = []
            }
            dailyGrouping[date].push(item)
        });
    }
    const orderDays: Array<{ key: string, item: Array<any> }> = Object.keys(dailyGrouping).map(key => {
        return {
            key: key,
            item: dailyGrouping[key]
        }
    }).sort((a, b) => {
        if (a.key < b.key) {
            return 1
        } else if (a.key > b.key) {
            return -1
        }
        return 0
    });
    return orderDays;
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
});
