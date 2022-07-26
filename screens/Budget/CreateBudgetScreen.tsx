import { useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { RootStackScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import moment, { Moment } from "moment";
import { Budget, CreateBudgetCategoryDocument, CreateBudgetCategoryMutation, GetCategoriesDocument, GetCategoriesQuery } from "../../components/generated";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "../../components/Button";
import { AmountInput } from "../../components/AmountInput";
import { DropdownRow } from "../../components/DropdownRow";
import { useAuth } from "../../hooks/useAuth";
import { Screen } from "../../components/Screen";
import { InputRow } from "../../components/InputRow";
import { useRefresh } from "../../hooks/useRefresh";

export default function CreateBudgetScreen({ navigation, route }: RootStackScreenProps<'CreateBudget'>) {
    const passwordHash = useAuth();
    const { loading: categoryDataLoading, data: categoryData, refetch } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
        variables: {
            passwordHash: passwordHash
        }
    });
    const [amount, setAmount] = useState(0);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [budget, setBudget] = useState<Budget | null>(route.params.budget || null);
    const [categoryExpanded, setCategoryExpanded] = useState(false);

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

    useRefresh(refetch, [passwordHash]);

    function selectCategory(name: string) {
        if (categoryData?.categories.__typename === 'CategoriesSuccess') {
            const found = categoryData?.categories.categories.find(cat => cat.name === name);
            if (found !== undefined) setCategoryId(found?.id);
        }
    }

    function handleBudgetCreation() {
        if (amount == 0) {
            alert("Budgeted amount can't be zero")
        } else if (budget == null || budget.id == null) {
            alert("Parent budget not found")
        } else if (categoryId == null) {
            alert("Please select a catgeory")
        } else {
            createBudget()
        }

    }

    return (
        <Screen onDismissKeyboard={() => setCategoryExpanded(false)}>
            <View style={styles.amountInputContainer}>
                <AmountInput defaultAmount={0} onChangeAmount={setAmount} />
                <View>

                </View>
            </View>
            <DropdownRow
                label="Category"
                data={
                    categoryData?.categories.__typename === 'CategoriesSuccess' ?
                        categoryData.categories.categories.filter(filterCat => {
                            const lookingForOverlap = budget?.budgetCategories?.find(
                                other => other.category.name == filterCat.name
                            )
                            return lookingForOverlap === undefined
                        }).map(x => { return { name: x.name, id: x.id.toString() } }) : []
                }
                onSelect={selectCategory}
                expanded={categoryExpanded}
                onExpand={() => setCategoryExpanded(true)}
                onCollapse={() => setCategoryExpanded(false)}
                topBorder
                bottomBorder />

            <InputRow label="Month:" disabled bottomBorder value={`${budget?.month} ${budget?.year}`} />
            <View style={styles.buttonContainer}>
                <Button
                    text="Create New Budget"
                    accessibilityLabel="Button to Create New Budget"
                    onPress={() => handleBudgetCreation()} />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: Colors.light.background
    },
    amountInputContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dollarSignAndAmountInput: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
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