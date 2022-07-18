import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import { GetCategoriesDocument, GetCategoriesQuery, Merchant } from "../components/generated";

import { StyleSheet, View, Text, TextInput, GestureResponderEvent, ScrollView, FlatList, TouchableOpacity, TouchableHighlight } from 'react-native';
import { RootTabScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "../constants/Colors";
import AdaptiveTextInput from "../components/AdaptiveTextInput";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../components/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../components/generated";

const MerchantItem = ({ name }: { name: string }) => (
    <View style={styles.row}>
        <View style={[styles.fieldContainer, { paddingLeft: 70 }]}>
            <Text style={styles.listItem}>{name}</Text>
        </View>
    </View>
);

const CategoryItem = ({ colourHex }: { colourHex: string }) => (
    <View style={styles.row}>
        <View style={[styles.fieldContainer, { paddingLeft: 70 }]}>
            <Text style={styles.listItem}>{colourHex}</Text>
        </View>
    </View>
);

const DropdownRow = ({ label }: { label: string }) => {
    const [expanded, setExpanded] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleRowPress = () => {
        if (!expanded) {
            setExpanded(true);
            inputRef.current?.focus();
        }
    };

    const handleIconPress = () => {
        // propogate press event to merchant row because propagation
        // is prevented by the icon for some reason.
        handleRowPress();

        if (expanded) {
            setExpanded(false);
            inputRef.current?.blur();
        }
    };

    return (
        <>
            <TouchableHighlight
                underlayColor="rgba(0,0,0,0.1)"
                style={expanded ? [styles.row, { backgroundColor: 'rgba(0,0,0,0.1)' }] : styles.row}
                onPress={handleRowPress}>
                <View style={styles.fieldContainer}>
                    <View style={styles.fieldLabelAndInputContainer}>
                        <Text style={styles.fieldLabel}>{label}:</Text>
                        <TextInput
                            style={styles.fieldInput}
                            editable={expanded}
                            placeholder="Select Merchant"
                            ref={inputRef}>
                        </TextInput>
                    </View>
                    <AntDesign
                        name={expanded ? 'up' : 'down'}
                        size={20}
                        color="black"
                        onPress={handleIconPress} />
                </View>
            </TouchableHighlight>
            {
                (expanded && !loading && data?.merchants?.__typename === 'MerchantsSuccess') ?
                    <FlatList
                        data={data.merchants.merchants}
                        renderItem={renderMerchantItem}
                        keyExtractor={merchant => merchant.id.toString()}>
                    </FlatList>
                    :
                    <View></View>
            }
        </>
    );
};

export default function CreateExpenseScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const [passwordHash, setpasswordHash] = useState('');
    const { loading: merchantDataLoading, error: merchantDataError, data: merchantData } = useQuery<GetMerchantsQuery>(GetMerchantsDocument, {
        variables: {
            passwordHash: passwordHash
        }
    });
    const { loading: categoryDataLoading, error: categoryDataError, data: categoryData } = useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
        variables: {
            passwordHash: passwordHash
        }
    });
    const [amount, setAmount] = useState('0.00');
    const [merchantListVisible, setMerchantListVisible] = useState(false);
    const [categoryListVisible, setCategoryListVisible] = useState(false);
    const merchantInputRef = useRef<TextInput>(null);
    const categoryInputRef = useRef<TextInput>(null);

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

    function renderMerchantItem({ item }: { item: Merchant }) {
        return (
            <MerchantItem name={item.name}></MerchantItem>
        );
    }

    function expandMerchants() {
        setMerchantListVisible(true);
    }

    function collapseMerchants() {
        setMerchantListVisible(false);
    }

    function toggleMerchants() {
        setMerchantListVisible(!merchantListVisible);
    }

    function handleMerchantRowPress() {
        if (!merchantListVisible) {
            expandMerchants();
            merchantInputRef.current?.focus();
        }
    }

    function handleMerchantArrowPress() {
        // propogate press event to merchant row because propagation
        // is prevented by the arrow for some reason.
        handleMerchantRowPress();

        if (merchantListVisible) {
            collapseMerchants();
            merchantInputRef.current?.blur();
        }
    }

    return (
        <View style={styles.screen}>
            <View style={styles.amountInputContainer}>
                <View style={styles.dollarSignAndAmountInput}>
                    <Text style={styles.dollarSign}>$</Text>
                    <AdaptiveTextInput keyboardType="numeric" style={{ fontSize: 50 }} charWidth={30} value={amount} onChangeText={handleAmountChange} onBlur={handleAmountBlur}></AdaptiveTextInput>
                </View>
            </View>
            <TouchableHighlight
                underlayColor="rgba(0,0,0,0.1)"
                style={merchantListVisible ? [styles.row, { backgroundColor: 'rgba(0,0,0,0.1)' }] : styles.row}
                onPress={handleMerchantRowPress}>
                <View style={styles.fieldContainer}>
                    <View style={styles.fieldLabelAndInputContainer}>
                        <Text style={styles.fieldLabel}>Merchant:</Text>
                        <TextInput style={styles.fieldInput} editable={merchantListVisible} placeholder="Select Merchant" ref={merchantInputRef}></TextInput>
                    </View>
                    <AntDesign
                        name={merchantListVisible ? 'up' : 'down'}
                        size={20}
                        color="black"
                        onPress={handleMerchantArrowPress} />
                </View>
            </TouchableHighlight>
            {
                (merchantListVisible && !merchantDataLoading && data?.merchants?.__typename === 'MerchantsSuccess') ?
                    <FlatList
                        data={data.merchants.merchants}
                        renderItem={renderMerchantItem}
                        keyExtractor={merchant => merchant.id.toString()}>
                    </FlatList>
                    :
                    <View></View>
            }
            <TouchableHighlight style={styles.row}>
                <View style={styles.fieldContainer}>
                    <View style={styles.fieldLabelAndInputContainer}>
                        <Text style={styles.fieldLabel}>Category:</Text>
                        <TextInput style={styles.fieldInput} placeholder="Select Category"></TextInput>
                    </View>
                    <AntDesign name="down" size={20} color="black" />
                </View>
            </TouchableHighlight>
            {
                (merchantListVisible && !merchantDataLoading && data?.merchants?.__typename === 'MerchantsSuccess') ?
                    <FlatList
                        data={data.merchants.merchants}
                        renderItem={renderMerchantItem}
                        keyExtractor={merchant => merchant.id.toString()}>
                    </FlatList>
                    :
                    <View></View>
            }
            <View style={styles.row}>
                <View style={styles.fieldContainer}>
                    <View style={styles.fieldLabelAndInputContainer}>
                        <Text style={styles.fieldLabel}>Date:</Text>
                        <TextInput style={styles.fieldInput} placeholder="Select Date"></TextInput>
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.fieldContainer}>
                    <View style={styles.fieldLabelAndInputContainer}>
                        <Text style={styles.fieldLabel}>Recurrence:</Text>
                        <TextInput style={styles.fieldInput} placeholder="One time"></TextInput>
                    </View>
                    <AntDesign name="down" size={20} color="black" />
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.detailsIconAndLabel}>
                    <Feather style={styles.detailsIcon} name="bar-chart" size={24} color="black" />
                    <Text style={styles.fieldLabel}>Details:</Text>
                </View>
                <TextInput style={styles.detailsInput} placeholder="Enter Details"></TextInput>
            </View>
            <View style={styles.buttonContainer}>
                <Button text="Save Expense" accessibilityLabel="Button to Save Expense"></Button>
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
    detailsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 27,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
    },
    detailsIconAndLabel: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        marginHorizontal: 0,
        alignItems: 'center',
    },
    detailsIcon: {
        transform: [{ rotateZ: '90deg' }, { rotateY: '180deg' }],
        marginRight: 5,
    },
    detailsInput: {
        fontSize: 15,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
    },
    listItem: {
        fontSize: 15,
    },
});
