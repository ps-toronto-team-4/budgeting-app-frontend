import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import { Category, GetCategoriesDocument, GetCategoriesQuery, Merchant } from "../components/generated";

import { StyleSheet, View, Text, TextInput, FlatList, TouchableHighlight } from 'react-native';
import { RootTabScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "../constants/Colors";
import AdaptiveTextInput from "../components/AdaptiveTextInput";
import { AntDesign, Feather } from '@expo/vector-icons';
import Button from "../components/Button";
import { GetMerchantsQuery, GetMerchantsDocument } from "../components/generated";

const DropdownItem = ({ name, onSelect }: { name: string, onSelect: (name: string) => void }) => (
    <TouchableHighlight
        style={styles.row}
        underlayColor="rgba(0,0,0,0.1)"
        onPress={() => onSelect(name)}>
        <View style={[styles.fieldContainer, { paddingLeft: 70 }]}>
            <Text style={styles.listItem}>{name}</Text>
        </View>
    </TouchableHighlight>
);

type DropdownRowProps = {
    label: string;
    data: string[];
    onSelect: (name: string) => void;
};

const DropdownRow = ({ label, data, onSelect }: DropdownRowProps) => {
    const [expanded, setExpanded] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const [value, setValue] = useState('');

    const collapse = () => {
        if (expanded) {
            setExpanded(false);
            inputRef.current?.blur();
        }
    };

    const handleRowPress = () => {
        if (!expanded) {
            setValue('');
            setExpanded(true);
            inputRef.current?.focus();
        }
    };

    const handleIconPress = () => {
        // propogate press event to merchant row because propagation
        // is prevented by the icon for some reason.
        handleRowPress();
        collapse();
    };

    function renderDropdownItem({ item }: { item: { name: string, onSelect: (name: string) => void } }) {
        return (
            <DropdownItem name={item.name} onSelect={item.onSelect}></DropdownItem>
        );
    }

    function handleSelect(name: string) {
        setValue(name);
        collapse();
        onSelect(name);
    }

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
                            placeholder={"Select " + label}
                            ref={inputRef}
                            value={value}
                            onChangeText={setValue}>
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
                (expanded) ?
                    <FlatList
                        data={
                            data.filter(name => {
                                return name.toLowerCase().startsWith(value.toLowerCase())
                            }).map(name => {
                                return { name: name, onSelect: handleSelect }
                            })
                        }
                        renderItem={renderDropdownItem}
                        keyExtractor={item => item.name}>
                    </FlatList>
                    :
                    <View></View>
            }
        </>
    );
};

export default function CreateExpenseScreen({ navigation }: RootTabScreenProps<'Budget'>) {
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
    const [merchant, setMerchant] = useState('');
    const [category, setCategory] = useState('');

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
                onSelect={(name) => { setMerchant(name); console.log(name); }} />
            <DropdownRow
                label="Categories"
                data={
                    categoryData?.categories.__typename === 'CategoriesSuccess' ?
                        categoryData.categories.categories.map(x => x.name) : []
                }
                onSelect={setCategory} />
            <View style={styles.row}>
                <View style={styles.fieldContainer}>
                    <View style={styles.fieldLabelAndInputContainer}>
                        <Text style={styles.fieldLabel}>Date:</Text>
                        <TextInput style={styles.fieldInput} placeholder="Select Date"></TextInput>
                    </View>
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
