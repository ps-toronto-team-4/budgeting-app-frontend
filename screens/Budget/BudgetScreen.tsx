import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Budget, BudgetCategory, GetBudgetsDocument, GetBudgetsQuery, GetMonthBreakdownDocument, GetMonthBreakdownQuery } from "../../components/generated";
import { SafeAreaView, StatusBar, TouchableHighlight } from "react-native"
import { AntDesign } from "@expo/vector-icons";

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { RootTabScreenProps } from "../../types";
import { ChartDisplay } from "../../components/budget/ChartDisplay";
import { BudgetList } from "../../components/budget/BudgetList";
import { MissingBudget } from "../../components/budget/MissingBudget";
import { useRefresh } from "../../hooks/useRefresh";
import { useAuth } from "../../hooks/useAuth";
import { MONTHS_ORDER } from "../../constants/Months"
import { Screen } from "../../components/Screen";
import Button from "../../components/Button";
import moment from "moment";

interface HeaderButtonProps {
    direction: 'left' | 'right';
    onPress?: () => void;
    marginLeft?: number;
    marginRight?: number;
}

function HeaderButton({ direction, onPress, marginLeft, marginRight }: HeaderButtonProps) {
    return (
        <TouchableHighlight onPress={onPress} style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: marginLeft,
            marginRight: marginRight,
            width: 50,
            height: 50,
            borderRadius: 25,
        }} underlayColor="rgba(0,0,0,0.2)">
            <AntDesign name={direction} size={32} color="black" />
        </TouchableHighlight>
    );
}

export default function BudgetScreen({ navigation, route }: RootTabScreenProps<'Budget'>) {
    const passwordHash = useAuth();
    const now = moment();
    const [month, setMonth] = useState(MONTHS_ORDER[now.month()]);
    const [year, setYear] = useState(now.year());

    const { data: budgetData, refetch: budgetRefetch } = useQuery<GetBudgetsQuery>(GetBudgetsDocument, {
        variables: { passwordHash }
    });
    const { data: monthData, refetch: monthRefetch } = useQuery<GetMonthBreakdownQuery>(GetMonthBreakdownDocument, {
        variables: {
            passwordHash,
            month,
            year
        }
    });

    useRefresh(() => {
        budgetRefetch()
        monthRefetch()
    }, [passwordHash]);

    const selectedBudget = budgetData?.budgets.__typename == 'BudgetsSuccess' ? budgetData.budgets.budgets.find(bud => (bud.month == month && bud.year == year)) : undefined;
    const plannedAmount = selectedBudget === undefined ? 0 :
        selectedBudget.budgetCategories?.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0);

    const months = MONTHS_ORDER;

    const backAMonth = () => {
        const curIndex = months.indexOf(month)
        if (curIndex === 0) {
            setMonth(months[months.length - 1])
            setYear((prevYear) => prevYear - 1);
        } else {
            setMonth((prevMonth) => months[months.indexOf(prevMonth) - 1]);
        }
    };

    const forwardAMonth = () => {
        const curIndex = months.indexOf(month)
        if (curIndex === months.length - 1) {
            setMonth(months[0]);
            setYear((prevYear) => prevYear + 1);
        } else {
            setMonth((prevMonth) => months[months.indexOf(prevMonth) + 1]);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `${month} ${year}`,
            headerBackVisible: false,
            headerLeft: (_) => <HeaderButton direction="left" marginLeft={10} onPress={backAMonth} />,
            headerRight: (_) => <HeaderButton direction="right" marginRight={10} onPress={forwardAMonth} />,
        });
    }, [month]);

    return (
        <Screen>
            <ChartDisplay
                planned={plannedAmount ? plannedAmount : 0}
                actual={monthData?.monthBreakdown.__typename == 'MonthBreakdown' ? monthData.monthBreakdown.totalSpent : 0} />
            {(selectedBudget &&
                <>
                    <View style={{ alignSelf: 'center', marginBottom: 10, }}>
                        <Button
                            text="Add Budget"
                            accessibilityLabel="Create new budget"
                            onPress={() => navigation.navigate("CreateBudget", { budget: selectedBudget as Budget })}
                        />
                    </View>
                    <View style={styles.itemSeparator}></View>
                    <ScrollView>
                        <TouchableHighlight>
                            <BudgetList
                                data={selectedBudget.budgetCategories as BudgetCategory[]}
                                monthlyData={monthData}
                                updateCallback={(budCat: BudgetCategory) => {
                                    navigation.navigate("EditBudget", { budgetCategory: budCat })
                                }} />
                        </TouchableHighlight>
                    </ScrollView>
                </>)
                || <MissingBudget
                    otherBudgets={budgetData}
                    passwordHash={passwordHash}
                    triggerRefetch={() => { budgetRefetch(); monthRefetch(); }}
                    year={year}
                    month={month} />

            }
        </Screen>
    );
}


const styles = StyleSheet.create({
    itemSeparator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
});
