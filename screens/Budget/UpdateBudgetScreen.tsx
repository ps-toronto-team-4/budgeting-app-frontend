import { useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { RootStackScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import moment, { Moment } from "moment";
import { Budget, BudgetCategory, DeleteBudgetCategoryDocument, DeleteBudgetCategoryMutation, UpdateBudgetCategoryDocument, UpdateBudgetCategoryMutation } from "../../components/generated";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "../../components/Button";
import { ControlledInputDecimal, InputDecimal } from "../../components/InputDecimal";



export default function UpdateBudgetScreen({ navigation, route }: RootStackScreenProps<'UpdateBudget'>) {
    const [passwordHash, setpasswordHash] = useState('');
    const [amount, setAmount] = useState(0);
    const [amountLable, setAmountLabel] = useState('')
    const [BudgetCategory, setBudgetCategory] = useState<BudgetCategory | null>(null);

    const [updateBudget] = useMutation<UpdateBudgetCategoryMutation>(UpdateBudgetCategoryDocument, {
        variables: { passwordHash, id: BudgetCategory?.id, amount },
        onError: (error => {
            alert(error.message);
        }),
        onCompleted: ((response) => {
            if (response.updateBudgetCategory.__typename == 'BudgetCategorySuccess') {
                // triggerRefetch()
                navigation.goBack();
            }
        })
    })

    const [deleteBudget] = useMutation<DeleteBudgetCategoryMutation>(DeleteBudgetCategoryDocument, {
        variables: { passwordHash, id: BudgetCategory?.id },
        onCompleted: ((response) => {
            if (response.deleteBudgetCategory.__typename == 'DeleteSuccess') {
                navigation.goBack();
            }
        })
    })

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('passwordHash')
            if (value != null) {
                setpasswordHash(value);
            }
        } catch (e) {
            setpasswordHash('undefined');
        }
        setBudgetCategory(route.params.budgetCategory)
        setAmount(route.params.budgetCategory.amount)
        setAmountLabel(route.params.budgetCategory.amount.toFixed(2))
    }

    return (
        <View style={styles.screen}>
            <View style={styles.amountInputContainer}>
                <View style={styles.dollarSignAndAmountInput}>
                    <Text style={styles.dollarSign}>$</Text>
                    <ControlledInputDecimal
                        callbackNumber={setAmount}
                        label={amountLable}
                        callbackLable={setAmountLabel}
                        placeholder='Enter Amount'
                    />
                </View>
                <View>

                </View>
            </View>
            <View style={styles.detailsRow}>
                <View style={styles.detailsIconAndLabel}>
                    <Text style={styles.fieldLabel}>For Budget:</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    text="Update Budget"
                    accessibilityLabel="Button to Update Budget"
                    onPress={() => updateBudget()} />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    text="Delete Budget"
                    accessibilityLabel="Button to Delete Budget"
                    onPress={() => deleteBudget()} />
            </View>
        </View >
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