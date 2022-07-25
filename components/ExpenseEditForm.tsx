import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GetCategoriesDocument, GetCategoriesQuery } from "../components/generated";

import { StyleSheet, View, Text, TextInput, TouchableHighlight, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "../constants/Colors";
import AdaptiveTextInput from "../components/AdaptiveTextInput";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../components/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../components/generated";
import { DropdownRow } from "../components/DropdownRow";
import CalendarPicker from "react-native-calendar-picker";
import moment, { Moment } from "moment";
import { useNavigation } from "@react-navigation/native";
import { InputRow } from "./InputRow";
import { Screen } from "./Screen";
import { useRefresh } from "../hooks/useRefresh";
import { useAuth } from "../hooks/useAuth";

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
    const passwordHash = useAuth();
    const nav = useNavigation();
    const { data: merchantData, refetch: refetchMerchants } =
        useQuery<GetMerchantsQuery>(GetMerchantsDocument, {
            variables: {
                passwordHash: passwordHash
            }
        });
    const { data: categoryData, refetch: refetchCategories } =
        useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
            variables: {
                passwordHash: passwordHash
            }
        });
    const [amountText, setAmountText] = useState(initVals?.amount.toString() || '0.00');
    const [merchantId, setMerchantId] = useState(initVals?.merchantId);
    const [categoryId, setCategoryId] = useState(initVals?.categoryId);
    const [merchantExpanded, setMerchantExpanded] = useState(false);
    const [categoryExpanded, setCategoryExpanded] = useState(false);
    const [detailsHeight, setDetailsHeight] = useState(20);
    const [calendarShown, setCalendarShown] = useState(false);
    const [date, setDate] = useState(initVals?.date || moment().toISOString());
    const [desc, setDesc] = useState(initVals?.desc || '');

    useRefresh(() => {
        refetchMerchants();
        refetchCategories();
    }, [passwordHash]);

    function handleAmountBlur() {
        if (amountText === '') {
            setAmountText('0.00');
        }
    }

    function selectMerchant(name: string) {
        if (merchantData?.merchants.__typename === 'MerchantsSuccess') {
            const found = merchantData?.merchants.merchants.find(merchant => merchant.name === name);
            if (found !== undefined) setMerchantId(found?.id);
        }
    }

    function selectCategory(name: string) {
        if (categoryData?.categories.__typename === 'CategoriesSuccess') {
            const found = categoryData?.categories.categories.find(cat => cat.name === name);
            if (found !== undefined) setCategoryId(found?.id);
        }
    }

    function handleSubmit() {
        onSubmit({
            amount: parseFloat(amountText),
            merchantId: merchantId,
            categoryId: categoryId,
            date: date,
            desc: desc,
        });
    }

    return (
        <Screen onDismissKeyboard={() => setCalendarShown(false)}>
            <View style={styles.amountInputContainer}>
                <View style={styles.dollarSignAndAmountInput}>
                    <Text style={styles.dollarSign}>$</Text>
                    <AdaptiveTextInput
                        keyboardType="numeric"
                        style={{ fontSize: 50 }}
                        charWidth={30}
                        value={amountText}
                        onChangeText={setAmountText}
                        onBlur={handleAmountBlur}>
                    </AdaptiveTextInput>
                </View>
            </View>
            <DropdownRow
                label="Merchant"
                data={
                    merchantData?.merchants.__typename === 'MerchantsSuccess' ?
                        merchantData.merchants.merchants.map(x => { return { id: x.id.toString(), name: x.name } }) : []
                }
                onSelect={selectMerchant}
                defaultValue={
                    initVals && merchantData?.merchants.__typename === 'MerchantsSuccess' ?
                        merchantData.merchants.merchants.find((merch) => merch.id === initVals.merchantId)?.name
                        : undefined
                }
                onCreateNew={() => { nav.navigate('CreateMerchant'); setMerchantExpanded(false); }}
                expanded={merchantExpanded}
                onExpand={() => { setMerchantExpanded(true); setCategoryExpanded(false); setCalendarShown(false); }}
                onCollapse={() => setMerchantExpanded(false)}
                visible={merchantData?.merchants.__typename === 'MerchantsSuccess' && !categoryExpanded}
                topBorder />
            <DropdownRow
                label="Category"
                data={
                    categoryData?.categories.__typename === 'CategoriesSuccess' ?
                        categoryData.categories.categories.map(x => { return { id: x.id.toString(), name: x.name } }) : []
                }
                onSelect={selectCategory}
                defaultValue={
                    initVals && categoryData?.categories.__typename === 'CategoriesSuccess' ?
                        categoryData.categories.categories.find((cat) => cat.id === initVals.categoryId)?.name
                        : undefined
                }
                onCreateNew={() => { nav.navigate('CreateCategory'); setCategoryExpanded(false); }}
                expanded={categoryExpanded}
                onExpand={() => { setCategoryExpanded(true); setMerchantExpanded(false); setCalendarShown(false); }}
                onCollapse={() => setCategoryExpanded(false)}
                visible={categoryData?.categories.__typename === 'CategoriesSuccess' && !merchantExpanded}
                topBorder />
            <>
                {
                    !merchantExpanded && !categoryExpanded &&
                    <>
                        <View>
                            <InputRow
                                onPress={() => setCalendarShown(true)}
                                label="Date:"
                                value={
                                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][moment(date).month()] +
                                    " " + moment(date).date() + " " + moment(date).year()
                                }
                                topBorder
                                disabled />
                            {
                                calendarShown &&
                                <View style={styles.calendarContainer}>
                                    <CalendarPicker
                                        onDateChange={(date, type) => { setDate(date.toISOString()); setCalendarShown(false); }}
                                        width={300} />
                                </View>
                            }
                        </View>
                        <View style={styles.detailsRow}>
                            <InputRow
                                label="Details:"
                                placeholder="Enter Details"
                                value={desc}
                                onChangeText={setDesc}
                                wrap
                                topBorder
                                bottomBorder />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                text="Save Expense"
                                accessibilityLabel="Button to Save Expense"
                                onPress={handleSubmit} />
                        </View>
                    </>
                }
            </>
        </Screen>
    );
}

const styles = StyleSheet.create({
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
        top: 43,
        left: '50%',
        transform: [{ translateX: -150 }],
    },
});