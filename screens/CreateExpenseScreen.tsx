import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { CreateExpenseDocument, CreateExpenseMutation } from "../components/generated";
import { RootStackScreenProps } from "../types";
import { ExpenseEditForm, FormValues } from "../components/forms/ExpenseEditForm";
import { useAuth } from "../hooks/useAuth";
import moment from "moment";

export default function CreateExpenseScreen({ navigation, route }: RootStackScreenProps<'CreateExpense'>) {
    const passwordHash = useAuth({ redirect: 'ifUnauthorized' });
    const [submit, { }] = useMutation<CreateExpenseMutation>(CreateExpenseDocument);

    function handleSubmit(vals: FormValues) {
        submit({
            variables: {
                passwordHash: passwordHash,
                amount: vals.amount,
                epochDate: moment(vals.date).unix(),
                merchantId: vals.merchantId || null,
                categoryId: vals.categoryId || null,
                desc: vals.desc || null,
            },
            onCompleted: (response) => {
                if (response.createExpense.__typename === 'ExpenseSuccess') {
                    navigation.navigate('Root', { screen: 'Expenses' });
                } else if (response.createExpense.__typename === 'FailurePayload') {
                    alert('Error creating expense: ' + response.createExpense.exceptionName);
                }
            },
        });
    }

    return (
        <ExpenseEditForm onSubmit={handleSubmit} />
    );
}
