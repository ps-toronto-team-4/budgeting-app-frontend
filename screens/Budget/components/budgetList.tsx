import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler';
import FakeFlatList from '../../../components/FakeFlatList';
import { BudgetCategory, GetMonthBreakdownQuery } from '../../../components/generated';

const ShowBudgets = ({ data, monthlyData }: { data: Array<BudgetCategory> | undefined | null, monthlyData: GetMonthBreakdownQuery | undefined }) => {

    const Separator = () => <View style={styles.itemSeparator} />;
    const RightSwipeOpen = () => {
        return (
            <View
                style={{ flex: 1, backgroundColor: '#fc0303', justifyContent: 'center', alignItems: 'flex-end' }}
            >
                <Text
                    style={{
                        color: 'white',
                        paddingHorizontal: 10,
                        fontWeight: 'bold',
                        paddingVertical: 20,
                    }}
                >
                    Delete
                </Text>
            </View>
        );
    }
    const RowItem = (item: BudgetCategory) => {
        const applicableMonthlyData = monthlyData?.monthBreakdown.__typename == "MonthBreakdown" ?
            monthlyData.monthBreakdown.byCategory.find(x => x.category?.name == item.category.name) : undefined
        const spent = applicableMonthlyData ? applicableMonthlyData.amountSpent : 0
        const overBudget = spent > item.amount
        const closeToBudget = !overBudget && spent > item.amount * 0.75

        return (
            <Swipeable
            // renderRightActions={RightSwipeOpen}
            // onSwipeableRightOpen={() => alert("dlete me")}
            >
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: 'white',
                }}>
                    <View style={{ flexBasis: 10, width: 10, backgroundColor: "#" + item.category.colourHex }}></View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>


                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignContent: "space-between",
                                paddingHorizontal: 30,
                                paddingVertical: 20,
                            }}
                        >
                            <View style={{ flex: 2, alignContent: "flex-start", flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: 24 }}>
                                    {item.category.name}
                                </Text>
                                <Text style={{ flex: 1 }}>
                                    {(closeToBudget && "Close to Budget")
                                        || (overBudget && "Over Budget")}
                                </Text>
                            </View>

                            <Text style={{ fontSize: 24 }}>
                                ...
                            </Text>
                        </View>
                        <View style={{
                            flex: 2,
                            flexDirection: "row",
                            alignContent: "space-between",
                            paddingHorizontal: 30,
                            paddingVertical: 20,
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text>Planed</Text>
                                <View style={{ borderColor: 'black', borderWidth: 2, minHeight: 50, justifyContent: 'center', alignItems: "center", }}>
                                    <Text>$ {item.amount.toFixed(2)}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text>Actual</Text>
                                <View style={{ borderColor: 'black', borderWidth: 2, minHeight: 50, justifyContent: 'center', alignItems: "center", }}>
                                    <Text>$ {spent.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </Swipeable>
        )
    }

    return <View>
        <FakeFlatList
            data={data ? data : []}
            renderItem={({ item }) => <RowItem {...item} />}
            ItemSeparatorComponent={() => <Separator />}
        />
    </View>
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemSeparator: {
        flex: 1,
        height: 3,
        flexBasis: 3,
        backgroundColor: '#969696',
    },
});


export default ShowBudgets