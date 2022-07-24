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
    /**
     * If this prop is not undefined and it's state change, this component will refetch
     * data from the backend. You can use this like a refresh counter and increment
     * it when you want this component's data to be refetched.
     */
    refreshOnStateChange?: number;
    onSubmit: (vals: FormValues) => void;
}

export function ExpenseEditForm({ initVals, refreshOnStateChange: refresh, onSubmit }: ExpenseEditFormProps) {
    const [passwordHash, setpasswordHash] = useState(''); // TODO change this to useAuth()
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

    useEffect(() => {
        if (refresh !== undefined) {
            refetchMerchants({
                passwordHash: passwordHash,
            });
            refetchCategories({
                passwordHash: passwordHash,
            });
        }
    }, [refresh]);

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
    }

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
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setCalendarShown(false); }}>
            <View style={styles.screen}>
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
                                merchantData.merchants.merchants.map(x => x.name) : []
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
                        visible={merchantData?.merchants.__typename === 'MerchantsSuccess' && !categoryExpanded} />
                    <DropdownRow
                        label="Category"
                        data={
                            categoryData?.categories.__typename === 'CategoriesSuccess' ?
                                categoryData.categories.categories.map(x => x.name) : []
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
                        visible={categoryData?.categories.__typename === 'CategoriesSuccess' && !merchantExpanded} />
                {
                    !merchantExpanded && !categoryExpanded &&
                        <>
                            <View>
                                <TouchableHighlight
                                    style={calendarShown ? [styles.row, { backgroundColor: 'rgba(0,0,0,0.1)' }] : styles.row}
                                    underlayColor="rgba(0,0,0,0.1)"
                                    onPress={() => setCalendarShown(true)}>
                                    <View style={styles.fieldContainer}>
                                        <View style={styles.fieldLabelAndInputContainer}>
                                            <Text style={styles.fieldLabel}>Date:</Text>
                                            <TextInput
                                                style={styles.fieldInput}
                                                placeholder="Select Date"
                                                value={
                                                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][moment(date).month()] +
                                                    " " + moment(date).date() + " " + moment(date).year()
                                                }
                                                editable={false}>
                                            </TextInput>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                {
                                    calendarShown ?
                                        <View style={styles.calendarContainer}>
                                            <CalendarPicker
                                                onDateChange={(date, type) => { setDate(date.toString()); setCalendarShown(false); }}
                                                width={300} />
                                        </View>
                                        :
                                        <View></View>
                                }
                            </View>
                            <View style={styles.detailsRow}>
                                <View style={styles.detailsLabelAndInputContainer}>
                                    <View style={styles.detailsIconAndLabel}>
                                        <Feather style={styles.detailsIcon} name="bar-chart" size={16} color="black" />
                                        <Text style={styles.fieldLabel}>Details:</Text>
                                    </View>
                                    <TextInput
                                        style={[styles.detailsInput, { height: detailsHeight }]}
                                        placeholder="Enter Details"
                                        multiline={true}
                                        textAlignVertical="top"
                                        scrollEnabled={false}
                                        onContentSizeChange={(e) => setDetailsHeight(e.nativeEvent.contentSize.height)}
                                        onChangeText={setDesc}
                                        value={desc}>
                                    </TextInput>
                                </View>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button
                                    text="Save Expense"
                                    accessibilityLabel="Button to Save Expense"
                                    onPress={handleSubmit} />
                            </View>
                        </>
                }
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
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
        alignItems: 'center',
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
        zIndex: -1,
        elevation: -1,
    },
    detailsLabelAndInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 320,
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
