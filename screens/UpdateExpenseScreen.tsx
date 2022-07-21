import { useMutation } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import { DeleteExpenseDocument, DeleteExpenseMutation, UpdateExpenseDocument, UpdateExpenseMutation } from "../components/generated";

import { RootStackScreenProps } from "../types";
import { ExpenseEditForm, FormValues } from "../components/ExpenseEditForm";
import { AntDesign, Feather } from '@expo/vector-icons';
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "../hooks/useAuth";
import { StyleSheet } from "react-native";

const DeleteButton = ({ onPress }: { onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
            <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>
    );
}

export default function UpdateExpenseScreen({ navigation, route }: RootStackScreenProps<'UpdateExpense'>) {
    const [passwordHash, setpasswordHash] = useAuth();
    const [submit, _] = useMutation<UpdateExpenseMutation>(UpdateExpenseDocument);
    const [deleteExpense, { data: deletionData }] = useMutation<DeleteExpenseMutation>(DeleteExpenseDocument, {
        variables: {
            passwordHash: passwordHash,
            id: route.params?.id,
        }
    });

    useEffect(() => {
        navigation.setOptions({
            headerRight: (_) => <DeleteButton onPress={handleDelete} />
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
        navigation.navigate('ExpenseDetails', { expenseId: route.params?.id || 0, refresh: true });
    }

    function handleDelete() {
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

const styles = StyleSheet.create({
    deleteButton: {
        paddingRight: 30,
    },
});
