import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import { BudgetCategory } from '../../../components/BudgetCategory';
import FakeFlatList from '../../../components/FakeFlatList';
import { BudgetCategory as BudgetCategoryType, GetMonthBreakdownQuery } from '../../../components/generated';

const ShowBudgets = ({
    data,
    monthlyData,
    updateCallback
}
    : {
        data: Array<BudgetCategoryType> | undefined | null,
        monthlyData: GetMonthBreakdownQuery | undefined,
        updateCallback: Function
    }) => {

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
    const RowItem = (item: BudgetCategoryType) => {
        const applicableMonthlyData = monthlyData?.monthBreakdown.__typename == "MonthBreakdown" ?
            monthlyData.monthBreakdown.byCategory.find(x => x.category?.name == item.category.name) : undefined
        const spent = applicableMonthlyData ? applicableMonthlyData.amountSpent : 0
        const overBudget = spent > item.amount
        const closeToBudget = !overBudget && spent > item.amount * 0.75

        return (
            <BudgetCategory
                planned={parseInt(item.amount.toFixed(2))}
                actual={parseInt(spent.toFixed(2))}
                category={item.category.name}
                color={'#' + item.category.colourHex}
                onPressDots={() => updateCallback(item)} />
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