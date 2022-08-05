import { useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { RootStackScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import { Budget, BudgetCategory, DeleteBudgetCategoryDocument, DeleteBudgetCategoryMutation, DeleteBudgetCategoryMutationVariables, UpdateBudgetCategoryDocument, UpdateBudgetCategoryMutation, UpdateBudgetCategoryMutationVariables } from "../../components/generated";
import { View, Text, TextInput, StyleSheet, Modal } from "react-native";
import Button from "../../components/buttons/Button";
import { Row } from "../../components/forms/Row";
import { AmountInput } from "../../components/forms/AmountInput";
import { useAuth } from "../../hooks/useAuth";
import { Form } from "../../components/forms/Form";
import { InputRow } from "../../components/forms/InputRow";
import { TrashButton } from "../../components/buttons/TrashButton";
import { DisplayField } from "../../components/forms/DisplayField";
import modalStyle from "../../constants/Modal";

export default function UpdateBudgetScreen({ navigation, route }: RootStackScreenProps<'EditBudget'>) {
    const passwordHash = useAuth({ redirect: 'ifUnauthorized' });
    const [amount, setAmount] = useState(route.params.budgetCategory.amount);
    const budgetCategory = route.params.budgetCategory;
    const [amountError, setAmountError] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [updateBudget] = useMutation<UpdateBudgetCategoryMutation, UpdateBudgetCategoryMutationVariables>(UpdateBudgetCategoryDocument, {
        variables: { passwordHash, id: budgetCategory?.id, amount },
        onError: (error => {
            alert(error.message);
        }),
        onCompleted: ((response) => {
            if (response.updateBudgetCategory.__typename == 'BudgetCategorySuccess') {
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Root", { screen: "Budget" });
            }
        })
    });

    const [deleteBudget] = useMutation<DeleteBudgetCategoryMutation, DeleteBudgetCategoryMutationVariables>(DeleteBudgetCategoryDocument, {
        variables: { passwordHash, id: budgetCategory?.id },
        onCompleted: ((response) => {
            if (response.deleteBudgetCategory.__typename == 'DeleteSuccess') {
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Root", { screen: "Budget" });
            }
        })
    });

    useEffect(() => {
        navigation.setOptions({
            headerRight: (_) => <TrashButton onPress={() => setConfirmDelete(true)} />
        });
    }, []);

    function handleSubmit() {
        if (amount === 0) {
            setAmountError('Please enter a non-zero amount.');
            return;
        }
        updateBudget();
    }

    function handleChangeAmount(newAmount: number) {
        if (newAmount !== 0) {
            setAmountError('');
        }
        setAmount(newAmount);
    }

    return (
        <Form>
            <AmountInput defaultAmount={amount} onChangeAmount={handleChangeAmount} errorMessage={amountError} />
            <DisplayField label="Category" value={budgetCategory.category.name} />
            <View style={styles.buttonContainer}>
                <Button
                    text="Save Budget"
                    accessibilityLabel="Button to Save Budget"
                    onPress={handleSubmit} />
            </View>
            <Modal
                transparent={true}
                visible={confirmDelete}
                onRequestClose={() => setConfirmDelete(false)}
            >
                <View style={modalStyle.container}>
                    <Text style={modalStyle.title}>Delete Budget?</Text>
                    <Text style={modalStyle.text}>Are you sure you want to delete this budget?</Text>
                    <View style={modalStyle.buttonView}>
                        <Button text="Cancel" onPress={() => setConfirmDelete(false)} size='half' accessibilityLabel='Cancel button' />
                        <Button text="Delete" onPress={() => deleteBudget()} size='half' backgroundColor='red' accessibilityLabel='Delete Category button' />
                    </View>
                </View>
            </Modal>
        </Form>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 60,
    },
});
