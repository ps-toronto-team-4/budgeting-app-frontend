import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ImageBackground, TouchableOpacity } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useRefresh } from "../hooks/useRefresh";
import Button from "./buttons/Button"
import { GetCategoriesDocument, GetCategoriesQuery, GetMerchantQuery, GetMerchantsDocument, GetMerchantsQuery, GetMonthTotalsDocument, GetMonthTotalsQuery } from "./generated";

const ApplyFilter = () => {

    const filters = useState({
        date: [],
        category: [],
        merchant: [],
    })


    return (<>
        <Button text="Apply Filters"></Button>
        <Modal></Modal>
    </>
    )

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
    passwordHash: string,
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

    const orderDates = useMemo(() => {
        let yearDict: any = {}
        if (dateData?.monthsTotals.__typename == 'MonthsTotals') {
            dateData.monthsTotals.byMonth.forEach(ele => {
                if (ele.year in yearDict) {
                    yearDict[ele.year] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
            })
        }

    }, [dateData])


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
                        <View style={{ flexDirection: 'row' }}>

                            <Text style={styles.modalText}>Filters</Text>
                            <View>

                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Close</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View>

                            <Text style={styles.typeDivitor}>Date</Text>

                            {/* {orderDates.map( (ele,index)=>{
                                return <RadioButton key={index} text={ele}
                            })} */}

                            {/* {dateData?.monthsTotals.__typename == 'MonthsTotals' &&
                                dateData.monthsTotals.byMonth.map((ele, index) => {
                                    const selected = filters.date.findIndex(fEle => fEle === ele.name) !== -1
                                    return <RadioButton key={index} selected={selected} text={ele.name} onPress={() => handleSelect(ele.name, 'merchant')}></RadioButton>
                                })} */}

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

                    </View>
                </View>
            </Modal>
            <Button text="filters" onPress={() => setModalVisible(true)}></Button>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable>
        </View>
    );
};




const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
        elevation: 5
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
        fontSize: 26,
    }
});

export default ExpenseFilter