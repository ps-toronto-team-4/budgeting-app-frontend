import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables, GetMerchantsQueryVariables } from "../generated";

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
import { Screen } from "./Screen";
import { useRefresh } from "../../hooks/useRefresh";
import { useAuth } from "../../hooks/useAuth";

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
    const [getMerchants, { data: merchantData, refetch: refetchMerchants }] = useLazyQuery<GetMerchantsQuery, GetMerchantsQueryVariables>(GetMerchantsDocument);
    const [getCategories, { data: categoryData, refetch: refetchCategories }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument);
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMerchants({ variables: { passwordHash } });
            getCategories({ variables: { passwordHash } });
        },
    });
    useRefresh(() => {
        refetchMerchants({ passwordHash });
        refetchCategories({ passwordHash });
    });

    const nav = useNavigation();
    const [amount, setAmount] = useState(initVals?.amount || 0);
    const [merchantId, setMerchantId] = useState(initVals?.merchantId);
    const [categoryId, setCategoryId] = useState(initVals?.categoryId);
    const [merchantExpanded, setMerchantExpanded] = useState(false);
    const [categoryExpanded, setCategoryExpanded] = useState(false);
    const [calendarShown, setCalendarShown] = useState(false);
    const [date, setDate] = useState(initVals?.date || moment().toISOString());
    const [desc, setDesc] = useState(initVals?.desc || '');

    function selectMerchant(name: string) {
        if (merchantData && merchantData.merchants.__typename === 'MerchantsSuccess') {
            const found = merchantData.merchants.merchants.find(merchant => merchant.name === name);
            if (found !== undefined) {
                setMerchantId(found?.id);
                if (found.defaultCategory) {
                    setCategoryId(found.defaultCategory.id);
                }
            }
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
            amount: amount,
            merchantId: merchantId,
            categoryId: categoryId,
            date: date,
            desc: desc,
        });
    }

    return (
        <Screen onDismissKeyboard={() => { setCalendarShown(false); setMerchantExpanded(false); setCategoryExpanded(false); }}>
            <AmountInput onChangeAmount={setAmount} defaultAmount={initVals?.amount || 0} />
            <>
                {
                    merchantData?.merchants.__typename === 'MerchantsSuccess' &&
                    <DropdownRow
                        label="Merchant"
                        data={
                            merchantData.merchants.merchants.map(x => { return { id: x.id, name: x.name } })
                        }
                        onSelect={selectMerchant}
                        defaultValue={
                            initVals ?
                                merchantData.merchants.merchants.find((merch) => merch.id === initVals.merchantId)?.name
                                : undefined
                        }
                        onCreateNew={() => { nav.navigate('CreateMerchant'); setMerchantExpanded(false); }}
                        placeholder={merchantExpanded ? "Start typing to search" : "Select Merchant"}
                        expanded={merchantExpanded}
                        onExpand={() => { setMerchantExpanded(true); setCategoryExpanded(false); setCalendarShown(false); }}
                        onCollapse={() => setMerchantExpanded(false)}
                        visible={!categoryExpanded}
                        topBorder />
                }
            </>
            <>
                {
                    categoryData?.categories.__typename === 'CategoriesSuccess' &&
                    <DropdownRow
                        label="Category"
                        data={
                            categoryData.categories.categories.map(x => { return { id: x.id, name: x.name } })
                        }
                        onSelect={selectCategory}
                        defaultValue={
                            initVals ?
                                categoryData.categories.categories.find((cat) => cat.id === initVals.categoryId)?.name
                                : undefined
                        }
                        placeholder={categoryExpanded ? "Start typing to search" : "Uncategorized"}
                        onCreateNew={() => { nav.navigate('CreateCategory'); setCategoryExpanded(false); }}
                        expanded={categoryExpanded}
                        onExpand={() => { setCategoryExpanded(true); setMerchantExpanded(false); setCalendarShown(false); }}
                        onCollapse={() => setCategoryExpanded(false)}
                        visible={categoryData?.categories.__typename === 'CategoriesSuccess' && !merchantExpanded}
                        topBorder
                        value={categoryData.categories.categories.find((cat) => cat.id === categoryId)?.name} />
                }
            </>
            <>
                <View>
                    <InputRow
                        onPress={() => setCalendarShown(true)}
                        label="Date"
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
                        label="Details"
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
        </Screen>
    );
}

const styles = StyleSheet.create({
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
