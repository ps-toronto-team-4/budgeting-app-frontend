import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { CreateExpenseDocument, CreateExpenseMutation } from "../components/generated";
import { RootStackScreenProps } from "../types";
import { ExpenseEditForm, FormValues } from "../components/ExpenseEditForm";
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
            }
        });
        navigation.navigate("Root");
    }

    return (
        <ExpenseEditForm onSubmit={handleSubmit} />
    );
}
