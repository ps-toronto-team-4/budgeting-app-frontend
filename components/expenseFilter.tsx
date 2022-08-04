import { useLazyQuery } from "@apollo/client";
import { isFor } from "@babel/types";
import React, { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useRefresh } from "../hooks/useRefresh";
import Button from "./buttons/Button"
import { GetCategoriesDocument, GetCategoriesQuery, GetMerchantQuery, GetMerchantsDocument, GetMerchantsQuery, GetMonthTotalsDocument, GetMonthTotalsQuery } from "./generated";

type Expenses = {
    __typename?: "Expense" | undefined;
    amount: number;
    id: number;
    date: string;
    description?: string | null | undefined;
    category?: {
        __typename?: "Category" | undefined;
        colourHex: string;
        name: string;
    } | null | undefined;
    merchant?: {
        __typename?: "Merchant" | undefined;
        name: string;
    } | null | undefined;
}[];

const ApplyFilter = (expenses: Expenses, filters: filterSet) => {

    //merchnat filter
    const merchnatFiltered = expenses.filter((ele) => {
        if (filters.merchant.length == 0) {
            return true
        }
        const foundIndex = filters.merchant.findIndex(merch => merch == ele.merchant?.name)
        return foundIndex != -1
    })

    //category filter
    const categoryFiltered = merchnatFiltered.filter((ele) => {
        if (filters.category.length == 0) {
            return true
        }
        const foundIndex = filters.category.findIndex(cat => cat == ele.category?.name)
        return foundIndex != -1
    })


    //date filter

    return categoryFiltered

}

function RadioButton({ style, selected, text, onPress }: { style?: any, selected: boolean, text: string, onPress?: () => void }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: 'row' }}>

                <View style={[{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: '#000',
                    alignItems: 'center',
                    justifyContent: 'center',
                }, style]}>
                    {
                        selected ?
                            <View style={{
                                height: 12,
                                width: 12,
                                borderRadius: 6,
                                backgroundColor: '#000',
                            }} />
                            : null
                    }
                </View>
                <Text style={{ fontSize: 20 }}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}

interface filterSet {
    date: any,
    category: string[],
    merchant: string[],
}

interface ExpenseFilterParams {
    filters: filterSet,
    setFilters: (item: filterSet) => void,
}

const ExpenseFilter = ({ filters, setFilters }: ExpenseFilterParams) => {
    const [modalVisible, setModalVisible] = useState(false);

    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getCategory()
            getMerchnat()
            getDate()
        },
        redirect: 'ifUnauthorized',
    });

    useRefresh(() => {
        categoryRefresh()
        merchnatRefresh()
        dateRefresh()
    })

    const [getCategory, { data: categroyData, refetch: categoryRefresh }] = useLazyQuery<GetCategoriesQuery>(GetCategoriesDocument,
        { variables: { passwordHash } })
    const [getMerchnat, { data: merchantData, refetch: merchnatRefresh }] = useLazyQuery<GetMerchantsQuery>(GetMerchantsDocument,
        { variables: { passwordHash } })
    const [getDate, { data: dateData, refetch: dateRefresh }] = useLazyQuery<GetMonthTotalsQuery>(GetMonthTotalsDocument,
        { variables: { passwordHash } })

    function handleSelect(item: string, group: 'category' | 'merchant' | 'date') {

        const copyArray = [...filters[group]]
        const index = copyArray.indexOf(item);
        if (index > -1) { // only splice array when item is found
            copyArray.splice(index, 1); // 2nd parameter means remove one item only
        } else {
            copyArray.push(item)
        }

        let newFilter = JSON.parse(JSON.stringify(filters));
        newFilter[group] = copyArray
        setFilters(newFilter)
    }

    function handleYearPress(year: string) {
        console.log("CLVIN")
        const copyDate = JSON.parse(JSON.stringify(filters.date))
        const previousSelected = year in filters.date
        if (previousSelected) {
            delete copyDate[year]
        } else {
            copyDate[year] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
        let newFilter = JSON.parse(JSON.stringify(filters));
        newFilter.date = copyDate
        setFilters(newFilter)
    }

    function handleMonthPress(year: string, month: string) {
        const copyDate = JSON.parse(JSON.stringify(filters.date))
        const index = filters.date[year].findIndex((mon: string) => mon == month)
        if (index != -1) {
            copyDate[year].splice(index, 1);
            if (copyDate[year].length == 0) {
                delete copyDate[year]
            }
        } else {
            copyDate[year].push(month)
        }
        let newFilter = JSON.parse(JSON.stringify(filters));
        newFilter.date = copyDate
        setFilters(newFilter)
    }

    const orderDates = useMemo(() => {
        let yearDict: any = {}
        if (dateData?.monthsTotals.__typename == 'MonthsTotals') {
            dateData.monthsTotals.byMonth.forEach(ele => {
                if (!(ele.year in yearDict)) {
                    yearDict[ele.year] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
            })
        }
        return yearDict
    }, [dateData])


    console.log('ca', orderDates)

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Text style={styles.modalText}>Filters</Text>
                            <View>

                                {/* <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Close</Text>
                                </Pressable> */}
                            </View>
                        </View>

                        <ScrollView style={{ width: "100%" }}>

                            <View style={{ width: "100%" }}>

                                <Text style={styles.typeDivitor}>Date</Text>

                                {Object.keys(orderDates).map((ele, index) => {
                                    const selected = ele in filters.date
                                    return <View key={index}>
                                        <RadioButton selected={selected} text={ele} onPress={() => handleYearPress(ele)} />
                                        {selected &&
                                            <View style={styles.monthContainer}>
                                                {orderDates[ele].map((month: string, mIndex: number) => {
                                                    const selectedMonth = filters.date[ele].find((searchMon: string) => searchMon == month)
                                                    return <RadioButton key={mIndex} selected={selectedMonth} text={month} onPress={() => handleMonthPress(ele, month)} />
                                                })}
                                            </View>}
                                    </View>
                                })}

                                <Text style={styles.typeDivitor}>Merchant</Text>
                                {merchantData?.merchants.__typename == 'MerchantsSuccess' &&
                                    merchantData.merchants.merchants.map((ele, index) => {
                                        const selected = filters.merchant.findIndex(fEle => fEle === ele.name) !== -1
                                        return <RadioButton key={index} selected={selected} text={ele.name} onPress={() => handleSelect(ele.name, 'merchant')}></RadioButton>
                                    })}

                                <Text style={styles.typeDivitor}>Category</Text>
                                {categroyData?.categories.__typename == 'CategoriesSuccess' &&
                                    categroyData.categories.categories.map((ele, index) => {
                                        const selected = filters.category.findIndex(fEle => fEle === ele.name) !== -1
                                        return <RadioButton key={index} selected={selected} text={ele.name} onPress={() => handleSelect(ele.name, 'category')}></RadioButton>
                                    })}

                            </View>

                        </ScrollView>

                        <Button text="Save Filter" onPress={() => setModalVisible(!modalVisible)} />
                    </View>
                </View>
            </Modal>
            <Button text="filters" onPress={() => setModalVisible(true)}></Button>
        </View>
    );
};




const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        height: "90%",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        fontSize: 36,
        marginBottom: 15,
        textAlign: "center"
    },
    typeDivitor: {
        marginTop: 20,
        fontSize: 26,
    },
    monthContainer: {
        marginLeft: 50
    }
});

export default ExpenseFilter
export { ApplyFilter }