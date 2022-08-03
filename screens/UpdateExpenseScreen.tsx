import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Modal, View, Text } from "react-native";
import { DeleteExpenseDocument, DeleteExpenseMutation, UpdateExpenseDocument, UpdateExpenseMutation } from "../components/generated";

import { RootStackScreenProps } from "../types";
import { ExpenseEditForm, FormValues } from "../components/forms/ExpenseEditForm";
import moment from "moment";
import { useAuth } from "../hooks/useAuth";
import { TrashButton } from "../components/buttons/TrashButton";
import modalStyle from "../constants/Modal";
import Button from "../components/buttons/Button";

export default function UpdateExpenseScreen({ navigation, route }: RootStackScreenProps<'UpdateExpense'>) {
    const passwordHash = useAuth({ redirect: 'ifUnauthorized' });
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [submit, { }] = useMutation<UpdateExpenseMutation>(UpdateExpenseDocument);
    const [deleteExpense, { }] = useMutation<DeleteExpenseMutation>(DeleteExpenseDocument, {
        variables: {
            passwordHash: passwordHash,
            id: route.params?.id,
        },
        onCompleted: (response) => {
            if (response.deleteExpense.__typename === 'DeleteSuccess') {
                navigation.navigate('Root', { screen: "Expenses" });
            } else if (response.deleteExpense.__typename === 'FailurePayload') {
                alert("Error deleting expense: " + response.deleteExpense.exceptionName);
            }
        }
    });

    useEffect(() => {
        navigation.setOptions({
            headerRight: (_) => <TrashButton onPress={() => setConfirmDelete(true)} />
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

    return (
        <>
            <ExpenseEditForm onSubmit={handleSubmit} initVals={{
                amount: route.params?.amount || 0,
                merchantId: route.params?.merchant?.id,
                categoryId: route.params?.category?.id,
                date: route.params?.date || moment().toString(),
                desc: route.params?.desc,
            }} />
            <Modal
                transparent={true}
                visible={confirmDelete}
                onRequestClose={() => setConfirmDelete(false)}
            >
                <View style={modalStyle.container}>
                    <Text style={modalStyle.title}>Delete Merchant?</Text>
                    <Text style={modalStyle.text}>Are you sure you want to delete this merchant?</Text>
                    <View style={modalStyle.buttonView}>
                        <Button text="Cancel" onPress={() => setConfirmDelete(false)} size='half' accessibilityLabel='Cancel button' />
                        <Button text="Delete" onPress={() => { deleteExpense() }} size='half' backgroundColor='red' accessibilityLabel='Delete Category button' />
                    </View>
                </View>
            </Modal>
        </>
    );
}
