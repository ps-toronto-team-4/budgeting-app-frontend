import { useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { RootStackScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import { Budget, BudgetCategory, DeleteBudgetCategoryDocument, DeleteBudgetCategoryMutation, DeleteBudgetCategoryMutationVariables, UpdateBudgetCategoryDocument, UpdateBudgetCategoryMutation, UpdateBudgetCategoryMutationVariables } from "../../components/generated";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "../../components/buttons/Button";
import { Row } from "../../components/forms/Row";
import { AmountInput } from "../../components/forms/AmountInput";
import { useAuth } from "../../hooks/useAuth";
import { Form } from "../../components/forms/Form";
import { InputRow } from "../../components/forms/InputRow";
import { TrashButton } from "../../components/buttons/TrashButton";
import { DisplayField } from "../../components/forms/DisplayField";

export default function UpdateBudgetScreen({ navigation, route }: RootStackScreenProps<'EditBudget'>) {
    const passwordHash = useAuth({ redirect: 'ifUnauthorized' });
    const [amount, setAmount] = useState(route.params.budgetCategory.amount);
    const budgetCategory = route.params.budgetCategory;

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
            headerRight: (_) => <TrashButton onPress={deleteBudget} />
        });
    }, []);

    function handleSubmit() {
        updateBudget();
    }

    return (
        <Form>
            <AmountInput defaultAmount={amount} onChangeAmount={setAmount} />
            <DisplayField label="Category" value={budgetCategory.category.name} />
            <View style={styles.buttonContainer}>
                <Button
                    text="Save Budget"
                    accessibilityLabel="Button to Save Budget"
                    onPress={handleSubmit} />
            </View>
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
