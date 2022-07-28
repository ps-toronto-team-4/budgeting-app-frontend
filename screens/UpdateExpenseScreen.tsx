import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { DeleteExpenseDocument, DeleteExpenseMutation, UpdateExpenseDocument, UpdateExpenseMutation } from "../components/generated";

import { RootStackScreenProps } from "../types";
import { ExpenseEditForm, FormValues } from "../components/ExpenseEditForm";
import { AntDesign, Feather } from '@expo/vector-icons';
import moment from "moment";
import { useAuth } from "../hooks/useAuth";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { TrashButton } from "../components/TrashButton";

export default function UpdateExpenseScreen({ navigation, route }: RootStackScreenProps<'UpdateExpense'>) {
    const passwordHash = useAuth();
    const [submit, { }] = useMutation<UpdateExpenseMutation>(UpdateExpenseDocument);
    const [deleteExpense, { }] = useMutation<DeleteExpenseMutation>(DeleteExpenseDocument, {
        variables: {
            passwordHash: passwordHash,
            id: route.params?.id,
        }
    });

    useUnauthRedirect();

    useEffect(() => {
        navigation.setOptions({
            headerRight: (_) => <TrashButton onPress={handleDelete} />
        });
    }, []);

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
        navigation.navigate('ExpenseDetails', { expenseId: route.params?.id || 0 });
    }

    function handleDelete() {
        console.log('delete pressed');
        deleteExpense();
        navigation.navigate('Root');
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
