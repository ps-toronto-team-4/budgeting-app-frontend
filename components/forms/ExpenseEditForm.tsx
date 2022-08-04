import { useLazyQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { CreateMerchantDocument, CreateMerchantMutation, CreateMerchantMutationVariables, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables, GetMerchantsQueryVariables, MerchantsAndCategoriesDocument, MerchantsAndCategoriesQuery, MerchantsAndCategoriesQueryVariables } from "../generated";

import { StyleSheet, View, Text, TextInput, TouchableHighlight, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import Colors from "../../constants/Colors";
import { AmountInput } from "./AmountInput";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../buttons/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../generated";
import { DropdownRow } from "./DropdownRow";
import CalendarPicker from "react-native-calendar-picker";
import moment, { Moment } from "moment";
import { useNavigation } from "@react-navigation/native";
import { InputRow } from "./InputRow";
import { Form } from "./Form";
import { useRefresh } from "../../hooks/useRefresh";
import { useAuth } from "../../hooks/useAuth";
import { DisplayField } from "./DisplayField";
import { InputField } from "./InputField";
import { DropdownField } from "./DropdownField";

export type FormValues = {
    amount: number;
    merchantId?: number;
    categoryId?: number;
    date: string;
    desc?: string;
};

export interface ExpenseEditFormProps {
    /**
     * Values to initial the form fields with.
     */
    initVals?: FormValues;
    onSubmit: (vals: FormValues) => void;
}

export function ExpenseEditForm({ initVals, onSubmit }: ExpenseEditFormProps) {
    const [getMerchantsAndCategories, { data, refetch }] = useLazyQuery<MerchantsAndCategoriesQuery, MerchantsAndCategoriesQueryVariables>(MerchantsAndCategoriesDocument, {
        onError: () => alert('Error occurred while fetching merchants and categories.'),
    });
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => getMerchantsAndCategories({ variables: { passwordHash } }),
    });
    useRefresh(refetch);

    const [createMerchant, { }] = useMutation<CreateMerchantMutation, CreateMerchantMutationVariables>(CreateMerchantDocument);

    const [amount, setAmount] = useState(initVals?.amount || 0);
    const [merchantId, setMerchantId] = useState(initVals?.merchantId);
    const [categoryId, setCategoryId] = useState(initVals?.categoryId);
    const [calendarShown, setCalendarShown] = useState(false);
    const [date, setDate] = useState(initVals?.date || moment().toISOString());
    const [desc, setDesc] = useState(initVals?.desc || '');
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][moment(date).month()];
    const day = moment(date).date();
    const year = moment(date).year();
    const [amountError, setAmountError] = useState('');
    const nav = useNavigation();
    const [defaultCategory, setDefaultCategory] = useState<string>();

    function handleSubmit() {
        if (amount === 0) {
            setAmountError('Please enter a non-zero amount.');
            return;
        }
        onSubmit({
            amount: amount,
            merchantId: merchantId,
            categoryId: categoryId,
            date: date,
            desc: desc,
        });
    }

    function handleAmountChange(newAmount: number) {
        if (newAmount !== 0) {
            setAmountError('');
        }
        setAmount(newAmount);
    }

    function handleMerchantChange(id: string) {
        if (data?.merchants.__typename === 'MerchantsSuccess') {
            const merchant = data.merchants.merchants.find(merch => merch.id === parseInt(id));
            setDefaultCategory(merchant?.defaultCategory?.name);
            setCategoryId(merchant?.defaultCategory?.id);
        }
        setMerchantId(parseInt(id));
    }

    function handleCreateMerchant(value: string) {
        if (!value) {
            nav.navigate('CreateMerchant');
            return;
        }
        createMerchant({
            variables: { passwordHash, name: value },
            onCompleted: (response) => {
                if (response.createMerchant.__typename === 'MerchantSuccess') {
                    refetch();
                    setMerchantId(response.createMerchant.merchant.id);
                } else {
                    alert('Failed to create merchant.');
                }
            },
        });
    }

    function handleCreateCategory(value: string) {
        nav.navigate('CreateCategory', { name: value });
    }

    return (
        <Form onDismissKeyboard={() => { setCalendarShown(false); }}>
            <AmountInput onChangeAmount={handleAmountChange} defaultAmount={initVals?.amount || 0} errorMessage={amountError} />
            <>
                {
                    data?.merchants.__typename === 'MerchantsSuccess' &&
                    <DropdownField
                        label="Merchant"
                        placeholder="optional"
                        data={
                            data.merchants.merchants.map(x => { return { id: x.id.toString(), value: x.name } })
                        }
                        defaultValue={
                            initVals ?
                                data.merchants.merchants.find((merch) => merch.id === initVals.merchantId)?.name
                                : undefined
                        }
                        onFocus={() => setCalendarShown(false)}
                        onChange={handleMerchantChange}
                        onCreateNew={handleCreateMerchant} />
                }
            </>
            <>
                {
                    data?.categories.__typename === 'CategoriesSuccess' &&
                    <DropdownField
                        label="Category"
                        placeholder="optional"
                        data={data.categories.categories.map(x => { return { id: x.id.toString(), value: x.name, color: '#' + x.colourHex } })}
                        defaultValue={
                            initVals ?
                                data.categories.categories.find((cat) => cat.id === initVals.categoryId)?.name
                                : undefined
                        }
                        cachedValue={defaultCategory}
                        onFocus={() => setCalendarShown(false)}
                        onChange={id => setCategoryId(parseInt(id))}
                        onCreateNew={handleCreateCategory} />
                }
            </>
            <>
                <DisplayField label="Date" value={`${month} ${day} ${year}`} onPress={() => setCalendarShown(true)} focused={calendarShown} />
                <View>
                    {
                        calendarShown &&
                        <View style={styles.calendarContainer}>
                            <CalendarPicker
                                onDateChange={(date, type) => { setDate(date.toISOString()); setCalendarShown(false); }}
                                initialDate={moment(date).toDate()}
                                selectedStartDate={moment(date).toDate()}
                                width={300} />
                        </View>
                    }
                </View>
                <View style={styles.detailsRow}>
                    <InputField label="Details" placeholder="optional" onChange={setDesc} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        text="Save Expense"
                        accessibilityLabel="Button to Save Expense"
                        onPress={handleSubmit} />
                </View>
            </>
        </Form>
    );
}

const styles = StyleSheet.create({
    categoriesRow: {
        zIndex: -1,
        elevation: -1,
    },
    detailsRow: {
        zIndex: -1,
        elevation: -1,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
        zIndex: -1,
        elevation: -1,
    },
    calendarContainer: {
        alignSelf: 'center',
        width: 300,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        position: 'absolute',
        top: -5,
        left: '50%',
        transform: [{ translateX: -150 }],
    },
});
