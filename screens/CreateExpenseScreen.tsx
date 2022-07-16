import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";

import { StyleSheet, View, Text, TextInput } from 'react-native';
import { RootTabScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "../constants/Colors";

export default function CreateExpenseScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const [ passwordHash, setpasswordHash ] = useState("");
    const [ amount, setAmount ] = useState(0);
    const [ focused, setFocused ] = useState(false);

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

    function handleFocus() {
        setFocused(true);
    }

    function handleBlue() {
        setFocused(false);
    }

    return (
        <View style={styles.screen}>
            <View style={styles.amountInputContainer}>
                <View style={styles.dollarSignAndAmountInput}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput style={styles.amountInput}></TextInput>
                </View>
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
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dollarSignAndAmountInput: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    dollarSign: {},
    amountInput: {
        // fontSize: 50,
        width: 100,
        borderWidth: 1,
        borderColor: 'green',
    },
});