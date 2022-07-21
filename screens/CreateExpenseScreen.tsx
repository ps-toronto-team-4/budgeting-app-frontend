import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { CreateExpenseDocument, CreateExpenseMutation } from "../components/generated";
import { RootStackScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpenseEditForm, FormValues } from "../components/ExpenseEditForm";

export default function CreateExpenseScreen({ navigation, route }: RootStackScreenProps<'CreateExpense'>) {
    const [passwordHash, setpasswordHash] = useState('');
    const [submit, _] = useMutation<CreateExpenseMutation>(CreateExpenseDocument);

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

    function handleSubmit(vals: FormValues) {
        submit({
            variables: {
                passwordHash: passwordHash,
                amount: vals.amount,
                epochDate: vals.date.unix(),
                merchantId: vals.merchantId || null,
                categoryId: vals.categoryId || null,
                desc: vals.desc || null,
            }
        });
        navigation.navigate('Root');
    }

    return (
        <ExpenseEditForm onSubmit={handleSubmit} />
    );
}
