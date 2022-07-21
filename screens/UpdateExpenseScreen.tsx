import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { UpdateExpenseDocument, UpdateExpenseMutation } from "../components/generated";

import { RootStackScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpenseEditForm, FormValues } from "../components/ExpenseEditForm";
import moment from "moment";

export default function UpdateExpenseScreen({ navigation, route }: RootStackScreenProps<'UpdateExpense'>) {
    const [passwordHash, setpasswordHash] = useState('');
    const [submit, _] = useMutation<UpdateExpenseMutation>(UpdateExpenseDocument);

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
                id: route.params?.id || -1, // TODO is params is undefined show error on screen
                amount: vals.amount,
                epochDate: moment(vals.date).unix(),
                merchantId: vals.merchantId || null,
                categoryId: vals.categoryId || null,
                desc: vals.desc || null
            }
        });
        navigation.navigate('ExpenseDetails', { expenseId: route.params?.id || 0, refresh: true });
    }

    return (
        <ExpenseEditForm onSubmit={handleSubmit} initVals={{
            amount: route.params?.amount || 0,
            merchantId: route.params?.merchant?.id,
            categoryId: route.params?.category?.id,
            date: route.params?.date || moment().toString(),
            desc: route.params?.desc,
        }} />
    );
}
