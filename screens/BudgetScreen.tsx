import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { Button, ColorValue, FlatList, Modal, Pressable, SafeAreaView, StatusBar } from "react-native"

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from "react-native-gesture-handler";


const dumpyData = {
    budget: {
        id: 1,
        month: '2022-07',
    },
    categories: [
        {
            amount: 500,
            id: 1,
            category: {
                colorHex: '#a8329d',
                name: 'groceries',
                description: '',
            }
        },
        {
            amount: 1000,
            id: 2,
            category: {
                colorHex: '#32a852',
                name: 'rent',
                description: '',
            }
        }
    ]
}

interface CategoryItem {
    amount: number,
    id: number,
    category: {
        colorHex: string,
        name: string,
        description: string
    }
}

function DoughnutChart({ data }: { data: Array<CategoryItem> }) {
    const widthAndHeight = 250
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
    return <View>
        <Text>chart</Text>
    </View>
}

function AddBudget() {
    return (<View>
        <Button
            title="Add new Budget"
            onPress={() => alert('This will redirect to create budget screen in the future')}
        />
        <Modal
            animationType="slide"
            transparent={true}
            visible={false}
            onRequestClose={() => {
                alert("Modal has been closed.");
                //   setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>New Budget</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                    //   onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    </View>)
}

function ShowBudgets({ data }: { data: Array<CategoryItem> }) {

    const Separator = () => <View style={styles.itemSeparator} />;
    const RightSwipeOpen = () => {
        return (
            <View
                style={{ flex: 1, backgroundColor: '#fc0303', justifyContent: 'center', alignItems: 'flex-end' }}
            >
                <Text
                    style={{
                        color: 'white',
                        paddingHorizontal: 10,
                        fontWeight: 'bold',
                        paddingVertical: 20,
                    }}
                >
                    Delete
                </Text>
            </View>
        );
    }
    const RowItem = (item: CategoryItem) => {
        return (
            <Swipeable
                renderRightActions={RightSwipeOpen}
                onSwipeableRightOpen={() => alert("dlete me")}
            >
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: 'white',
                }}>
                    <View style={{ flexBasis: 10, width: 10, backgroundColor: item.category.colorHex }}></View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>


                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignContent: "space-between",
                                paddingHorizontal: 30,
                                paddingVertical: 20,
                            }}
                        >

                            <Text style={{ flex: 1, fontSize: 24 }}>
                                {item.category.name}
                            </Text>
                            <Text style={{ fontSize: 24 }}>
                                ...
                            </Text>
                        </View>
                        <View style={{
                            flex: 2,
                            flexDirection: "row",
                            alignContent: "space-between",
                            paddingHorizontal: 30,
                            paddingVertical: 20,
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text>Planed</Text>
                                <View style={{ borderColor: 'black', borderWidth: 2, minHeight: 50, justifyContent: 'center', alignItems: "center", }}>
                                    <Text>$10,00</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text>Actual</Text>
                                <View style={{ borderColor: 'black', borderWidth: 2, minHeight: 50, justifyContent: 'center', alignItems: "center", }}>
                                    <Text>$10,00</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </Swipeable>
        )
    }

    return <View>
        <FlatList
            data={data}
            keyExtractor={(item) => {
                if (item == null) {
                    return ''
                }
                return String(item.id)
            }}
            renderItem={({ item }) => <RowItem {...item} />}
            ItemSeparatorComponent={() => <Separator />}
        />
    </View>
}

export default function BudgetScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const [passwordHash, setpasswordHash] = React.useState("");
    const [budget, setBudget] = useState(dumpyData.budget)
    const [budgetCategories, setBudgetCategories] = useState(dumpyData.categories)

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
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
                    Budget of {budget.month}
                </Text>
                <DoughnutChart data={budgetCategories}></DoughnutChart>
                <AddBudget></AddBudget>
                <ScrollView>
                    <ShowBudgets data={budgetCategories}></ShowBudgets>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemSeparator: {
        flex: 1,
        height: 3,
        flexBasis: 3,
        backgroundColor: '#969696',
    },


    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
