import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import { CreateExpenseDocument, CreateExpenseMutation, GetCategoriesDocument, GetCategoriesQuery } from "../components/generated";

import { StyleSheet, View, Text, TextInput, FlatList, TouchableHighlight } from 'react-native';
import { RootStackScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "../constants/Colors";
import AdaptiveTextInput from "../components/AdaptiveTextInput";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../components/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../components/generated";
import { DropdownRow } from "../components/DropdownRow";
import CalendarPicker from "react-native-calendar-picker";
import moment, { Moment } from "moment";

export default function CreateExpenseScreen({ navigation }: RootStackScreenProps<'CreateExpense'>) {
    const [passwordHash, setpasswordHash] = useState('');
    const { loading: merchantDataLoading, data: merchantData } = useQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: {
            passwordHash: passwordHash
        }
    });
    const { loading: categoryDataLoading, data: categoryData } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
        variables: {
            passwordHash: passwordHash
        }
    });
    const [amount, setAmount] = useState('0.00');
    const [merchantId, setMerchantId] = useState<number | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [merchantExpanded, setMerchantExpanded] = useState(false);
    const [categoryExpanded, setCategoryExpanded] = useState(false);
    const [detailsHeight, setDetailsHeight] = useState(20);
    const [calendarShown, setCalendarShown] = useState(false);
    const [date, setDate] = useState(moment());
    const [desc, setDesc] = useState('');
    const [submit, { loading: submitLoading, data: submitData }] = useMutation<CreateExpenseMutation>(CreateExpenseDocument, {
        variables: {
            passwordHash: passwordHash,
            amount: parseFloat(amount),
            epochDate: date.unix(),
            merchantId: merchantId,
            categoryId: categoryId,
            desc: desc || null,
        }
    });

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
        if (amount === '') {
            setAmount('0.00');
        }
    }

    function handleAmountChange(text: string) {
        setAmount(text);
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
        submit();
        navigation.navigate('Root');
    }

    return (
        <View style={styles.screen}>
            <View style={styles.amountInputContainer}>
                <View style={styles.dollarSignAndAmountInput}>
                    <Text style={styles.dollarSign}>$</Text>
                    <AdaptiveTextInput
                        keyboardType="numeric"
                        style={{ fontSize: 50 }}
                        charWidth={30}
                        value={amount}
                        onChangeText={handleAmountChange}
                        onBlur={handleAmountBlur}>
                    </AdaptiveTextInput>
                </View>
            </View>
            <DropdownRow
                label="Merchants"
                data={
                    merchantData?.merchants.__typename === 'MerchantsSuccess' ?
                        merchantData.merchants.merchants.map(x => x.name) : []
                }
                onSelect={selectMerchant}
                expanded={merchantExpanded}
                onExpand={() => { setMerchantExpanded(true); setCategoryExpanded(false); }}
                onCollapse={() => setMerchantExpanded(false)} />
            <DropdownRow
                label="Categories"
                data={
                    categoryData?.categories.__typename === 'CategoriesSuccess' ?
                        categoryData.categories.categories.map(x => x.name) : []
                }
                onSelect={selectCategory}
                expanded={categoryExpanded}
                onExpand={() => { setCategoryExpanded(true); setMerchantExpanded(false); }}
                onCollapse={() => setCategoryExpanded(false)} />
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
                                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.month()] +
                                    " " + date.date() + " " + date.year()
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
                                onDateChange={(date, type) => { setDate(date); setCalendarShown(false); }}
                                width={300} />
                        </View>
                        :
                        <View></View>
                }
            </View>
            <View style={styles.detailsRow}>
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
            <View style={styles.buttonContainer}>
                <Button
                    text="Save Expense"
                    accessibilityLabel="Button to Save Expense"
                    onPress={handleSubmit} />
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
