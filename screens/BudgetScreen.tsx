import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Budget, BudgetCategory, Category, GetBudgetsDocument, GetBudgetsQuery, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { Button, ColorValue, FlatList, Modal, Pressable, SafeAreaView, StatusBar } from "react-native"

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from "react-native-gesture-handler";
import FakeFlatList from "../components/FakeFlatList";
import { AntDesign } from "@expo/vector-icons";


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


function DoughnutChart({ data }: { data: Array<BudgetCategory> }) {
    const widthAndHeight = 250
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
    return <View>
        <Text>chart</Text>
    </View>
}

function AddBudget({ navi }: { navi: Function }) {
    return (<View>
        <Button
            title="Add new Budget"
            onPress={() => navi()}
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

function ShowBudgets({ data }: { data: Array<BudgetCategory> | undefined | null }) {

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
    const RowItem = (item: BudgetCategory) => {
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
                    <View style={{ flexBasis: 10, width: 10, backgroundColor: "#" + item.category.colourHex }}></View>
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
        <FakeFlatList
            data={data ? data : []}
            renderItem={({ item }) => <RowItem {...item} />}
            ItemSeparatorComponent={() => <Separator />}
        />
    </View>
}

export default function BudgetScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const [passwordHash, setpasswordHash] = React.useState("");
    const [budget, setBudget] = useState(dumpyData.budget)
    const [budgetCategories, setBudgetCategories] = useState(dumpyData.categories)
    const [month, setMonth] = useState("JULY")
    const [year, setYear] = useState(2022)

    const { data, loading, refetch } = useQuery<GetBudgetsQuery>(GetBudgetsDocument, {
        variables: { passwordHash }
    })

    const months = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
    ]

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

    const createBudgetNav = () => {
        navigation.navigate("CreateBudget")
    }

    const backAMonth = () => {
        const curIndex = months.indexOf(month)
        if (curIndex == 0) {
            setMonth(months[months.length - 1])
            setYear(year - 1)
        } else {
            setMonth(months[curIndex - 1])
        }
    }

    const forwardAMonth = () => {
        const curIndex = months.indexOf(month)
        if (curIndex == months.length - 1) {
            setMonth(months[0])
            setYear(year + 1)
        } else {
            setMonth(months[curIndex + 1])
        }
    }

    const selectedBudget = data?.budgets.__typename == 'BudgetsSuccess' ? data.budgets.budgets.find(bud => (bud.month == month && bud.year == year)) : undefined

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={{ flexBasis: 50, flexDirection: 'row', justifyContent: "space-between" }}>
                    <AntDesign onPress={backAMonth} style={{ flex: 1 }} name="left" size={24} color="black" />
                    <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
                        Budget of {year} {month}
                    </Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <AntDesign onPress={forwardAMonth} style={{ flex: 1 }} name="right" size={24} color="black" />
                    </View>

                </View>
                {(selectedBudget &&
                    <>
                        <DoughnutChart data={selectedBudget.budgetCategories as BudgetCategory[]}></DoughnutChart>
                        <AddBudget navi={createBudgetNav}></AddBudget>
                        <ScrollView>
                            <ShowBudgets data={selectedBudget.budgetCategories as BudgetCategory[]}></ShowBudgets>
                        </ScrollView>
                    </>)
                    ||
                    (<View>
                        <Text>
                            Wow such emptiness, make a budget for this month
                        </Text>
                    </View>)
                }
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
