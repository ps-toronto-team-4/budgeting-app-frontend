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
    const [calendarShown, setCalendarShown] = useState(false);
    const [date, setDate] = useState(initVals?.date || moment().toISOString());
    const [desc, setDesc] = useState(initVals?.desc || '');
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][moment(date).month()];
    const day = moment(date).date();
    const year = moment(date).year();

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
        <Form onDismissKeyboard={() => { setCalendarShown(false); }}>
            <AmountInput onChangeAmount={setAmount} defaultAmount={initVals?.amount || 0} />
            <>
                {
                    merchantData?.merchants.__typename === 'MerchantsSuccess' &&
                    <DropdownField
                        label="Merchant"
                        placeholder="optional"
                        data={
                            merchantData.merchants.merchants.map(x => { return { id: x.id.toString(), value: x.name } })
                        }
                        defaultValue={
                            initVals ?
                                merchantData.merchants.merchants.find((merch) => merch.id === initVals.merchantId)?.name
                                : undefined
                        }
                        onFocus={() => setCalendarShown(false)}
                        onChange={id => setMerchantId(parseInt(id))} />
                }
            </>
            <>
                {
                    categoryData?.categories.__typename === 'CategoriesSuccess' &&
                    <DropdownField
                        label="Category"
                        placeholder="optional"
                        data={categoryData.categories.categories.map(x => { return { id: x.id.toString(), value: x.name } })}
                        defaultValue={
                            initVals ?
                                categoryData.categories.categories.find((cat) => cat.id === initVals.categoryId)?.name
                                : undefined
                        }
                        onFocus={() => setCalendarShown(false)}
                        onChange={id => setCategoryId(parseInt(id))} />
                }
            </>
            <>
                <View>
                    <DisplayField label="Date" value={`${month} ${day} ${year}`} onPress={() => setCalendarShown(true)} focused={calendarShown} />
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
