import { useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { RootStackScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import { Budget, BudgetCategory, DeleteBudgetCategoryDocument, DeleteBudgetCategoryMutation, DeleteBudgetCategoryMutationVariables, UpdateBudgetCategoryDocument, UpdateBudgetCategoryMutation, UpdateBudgetCategoryMutationVariables } from "../../components/generated";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "../../components/Button";
import { Row } from "../../components/Row";
import { AmountInput } from "../../components/AmountInput";
import { useAuth } from "../../hooks/useAuth";
import { Screen } from "../../components/Screen";
import { InputRow } from "../../components/InputRow";
import { TrashButton } from "../../components/TrashButton";

export default function UpdateBudgetScreen({ navigation, route }: RootStackScreenProps<'EditBudget'>) {
    const passwordHash = useAuth();
    const [amount, setAmount] = useState(route.params.budgetCategory.amount);
    const [budgetCategory, setBudgetCategory] = useState<BudgetCategory>(route.params.budgetCategory);

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
        <Screen>
            <AmountInput defaultAmount={amount} onChangeAmount={setAmount} />
            <InputRow label="Category:" disabled placeholder={budgetCategory.category.name} topBorder bottomBorder />

            <View style={styles.buttonContainer}>
                <Button
                    text="Save Budget"
                    accessibilityLabel="Button to Save Budget"
                    onPress={handleSubmit} />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 60,
    },
});