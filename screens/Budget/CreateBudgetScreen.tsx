import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { RootStackScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import moment, { Moment } from "moment";
import { Budget, CreateBudgetCategoryDocument, CreateBudgetCategoryMutation, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables } from "../../components/generated";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "../../components/buttons/Button";
import { AmountInput } from "../../components/forms/AmountInput";
import { DropdownRow } from "../../components/forms/DropdownRow";
import { useAuth } from "../../hooks/useAuth";
import { Form } from "../../components/forms/Form";
import { InputRow } from "../../components/forms/InputRow";
import { useRefresh } from "../../hooks/useRefresh";
import { DisplayField } from "../../components/forms/DisplayField";
import { DropdownField } from "../../components/forms/DropdownField";

export default function CreateBudgetScreen({ navigation, route }: RootStackScreenProps<'CreateBudget'>) {
    const [getCategories, { data, refetch }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument);
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => getCategories({ variables: { passwordHash } }),
        redirect: 'ifUnauthorized',
    });
    useRefresh(() => refetch({ passwordHash }));

    const [amount, setAmount] = useState(0);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [budget, setBudget] = useState<Budget | null>(route.params.budget || null);
    const [categoryExpanded, setCategoryExpanded] = useState(false);
    const [amountError, setAmountError] = useState('');
    const [categoryError, setCategoryError] = useState('');

    const [createBudget] = useMutation<CreateBudgetCategoryMutation>(CreateBudgetCategoryDocument, {
        variables: { passwordHash, budgetId: budget?.id, categoryId, amount },
        onError: (error => {
            alert(error.message);
        }),
        onCompleted: ((response) => {
            if (response.createBudgetCategory.__typename == "BudgetCategorySuccess") {
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Root", { screen: "Budget" });
            }
        })
    });

    function selectCategory(name: string) {
        if (data?.categories.__typename === 'CategoriesSuccess') {
            const found = data?.categories.categories.find(cat => cat.name === name);
            if (found !== undefined) {
                setCategoryId(found?.id);
                setCategoryError('');
            }
        }
    }

    function handleBudgetCreation() {
        let noErrors = true;

        if (amount == 0) {
            setAmountError("Please enter a non-zero amount.");
            noErrors = false;
        }
        if (budget == null || budget.id == null) {
            alert("Parent budget not found");
            noErrors = false;
        }
        if (categoryId == null) {
            setCategoryError("This field is required.");
            noErrors = false;
        }

        if (noErrors) createBudget();
    }

    function handleChangeAmount(newAmount: number) {
        if (newAmount !== 0) {
            setAmountError('');
        }
        setAmount(newAmount);
    }

    return (
        <Form onDismissKeyboard={() => setCategoryExpanded(false)}>
            <AmountInput
                defaultAmount={0}
                onChangeAmount={handleChangeAmount}
                onSelect={() => setCategoryExpanded(false)}
                error={amountError} />
            <DropdownField
                label="Category"
                placeholder="required"
                data={
                    data?.categories.__typename === 'CategoriesSuccess' ?
                        data.categories.categories.filter(filterCat => {
                            const lookingForOverlap = budget?.budgetCategories?.find((other) => other.category.name == filterCat.name);
                            return lookingForOverlap === undefined;
                        }).map(x => { return { value: x.name, id: x.id.toString() } }) : []
                }
                onChange={(id) => setCategoryId(parseInt(id))}
                required />
            <DisplayField label="Month" value={`${budget?.month} ${budget?.year}`} />
            <View style={styles.buttonContainer}>
                <Button
                    text="Create New Budget"
                    accessibilityLabel="Button to Create New Budget"
                    onPress={() => handleBudgetCreation()} />
            </View>
        </Form>
    );
}

const styles = StyleSheet.create({
    dollarSign: {
        fontSize: 20,
        marginRight: 5,
        paddingBottom: 15,
    },
    amountInput: {
        fontSize: 50,
        height: 200,
        width: 100,
        padding: 0,
    },
    row: {
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    fieldContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 320,
    },
    fieldLabelAndInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
    },
    fieldLabel: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    fieldInput: {
        fontSize: 15,
        width: 180
    },
    detailsRow: {
        flexDirection: 'row',
        paddingHorizontal: 27,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
        zIndex: -1,
        elevation: -1,
    },
    detailsIconAndLabel: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        marginRight: 27,
        alignItems: 'center',
    },
    detailsIcon: {
        transform: [{ rotateZ: '90deg' }, { rotateY: '180deg' }],
        marginRight: 5,
    },
    detailsInput: {
        fontSize: 15,
        width: 250,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
        zIndex: -1,
        elevation: -1,
    },
    listItem: {
        fontSize: 15,
    },
    calendarContainer: {
        alignSelf: 'center',
        width: 300,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        position: 'absolute',
        top: 43,
        left: '50%',
        transform: [{ translateX: -150 }],
    },
});