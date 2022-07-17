import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";

import { StyleSheet, View, Text, TextInput } from 'react-native';
import { RootTabScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "../constants/Colors";
import AdaptiveTextInput from "../components/AdaptiveTextInput";
import { AntDesign, Feather } from '@expo/vector-icons';
import { transform } from "@babel/core";
import Button from "../components/Button";

export default function CreateExpenseScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const [ passwordHash, setpasswordHash ] = useState('');
    const [ amount, setAmount ] = useState('0.00');

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

    function handleAmountBlur() {
        if (amount === '') {
            setAmount('0.00');
        }
    }

    function handleAmountChange(text: string) {
        setAmount(text);
    }

    return (
        <View style={styles.screen}>
            <View style={styles.amountInputContainer}>
                <View style={styles.dollarSignAndAmountInput}>
                    <Text style={styles.dollarSign}>$</Text>
                    <AdaptiveTextInput keyboardType="numeric" style={{fontSize: 50}} charWidth={30} value={amount} onChangeText={handleAmountChange} onBlur={handleAmountBlur}></AdaptiveTextInput>
                </View>
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Category:</Text>
                <TextInput style={styles.categoryInput} placeholder="Select Category"></TextInput>
                <AntDesign name="down" size={20} color="black" />
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Merchant:</Text>
                <TextInput style={styles.categoryInput} placeholder="Select Merchant"></TextInput>
                <AntDesign name="down" size={20} color="black" />
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Date:</Text>
                <TextInput style={styles.categoryInput} placeholder="Select Date"></TextInput>
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Recurrence:</Text>
                <TextInput style={styles.categoryInput} placeholder="One time"></TextInput>
                <AntDesign name="down" size={20} color="black" />
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.detailsIconAndLabel}>
                    <Feather style={styles.detailsIcon} name="bar-chart" size={24} color="black" />
                    <Text style={styles.detailsLabel}>Details:</Text>
                </View>
                <TextInput style={styles.detailsInput} placeholder="Enter Details"></TextInput>
            </View>
            <View style={styles.buttonContainer}>
                <Button text="Save Expense" accessibilityLabel="Button to Save Expense"></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.light.background
    },
    amountInputContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dollarSignAndAmountInput: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    dollarSign: {
        fontSize: 20,
        marginRight: 5,
        paddingBottom: 15,
    },
    amountInput: {
        fontSize: 50,
        height:200,
        width: 100,
        padding: 0,
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
    },
    categoryLabel: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    categoryInput: {
        fontSize: 20,
    },
    detailsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 27,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
    },
    detailsIconAndLabel: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        marginHorizontal: 0,
    },
    detailsIcon: {
        transform: [{rotateZ: '90deg'}, {rotateY: '180deg'}],
        marginRight: 5,
    },
    detailsLabel: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    detailsInput: {
        fontSize: 20,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
    },
});