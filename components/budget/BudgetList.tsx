import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FakeFlatList from './FakeFlatList';
import { BudgetCategory as BudgetCategoryType, GetMonthBreakdownQuery } from '../generated';
import { BudgetCategory } from './BudgetCategory';

export interface BudgetListProps {
    data: Array<BudgetCategoryType> | undefined | null;
    monthlyData: GetMonthBreakdownQuery | undefined;
    updateCallback: (budgetCategory: BudgetCategoryType) => void;
}

export function BudgetList({ data, monthlyData, updateCallback }: BudgetListProps) {
    // TODO move this component outside BudgetList component.
    const RowItem = (item: BudgetCategoryType) => {
        const applicableMonthlyData = monthlyData?.monthBreakdown.__typename == "MonthBreakdown" ?
            monthlyData.monthBreakdown.byCategory.find(x => x.category?.name == item.category.name) : undefined;
        const spent = applicableMonthlyData ? applicableMonthlyData.amountSpent : 0;

        return (
            <>
                <BudgetCategory
                    planned={parseInt(item.amount.toFixed(2))}
                    actual={parseInt(spent.toFixed(2))}
                    category={item.category.name}
                    color={'#' + item.category.colourHex}
                    onPressDots={() => updateCallback(item)} />
                <View style={styles.itemSeparator}></View>
            </>
        );
    }

    return (
        <View>
            <FakeFlatList
                data={data ? data : []}
                renderItem={({ item }) => <RowItem {...item} />}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    itemSeparator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
});
