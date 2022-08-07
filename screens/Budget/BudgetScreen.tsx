import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { Budget, BudgetCategory, CopyBudgetDocument, CopyBudgetMutation, CopyBudgetMutationVariables, CreateBudgetCategoryDocument, CreateBudgetCategoryMutation, CreateBudgetCategoryMutationVariables, CreateBudgetDocument, CreateBudgetMutation, CreateBudgetMutationVariables, GetBudgetsDocument, GetBudgetsQuery, GetBudgetsQueryVariables, GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, MonthType } from "../../components/generated";
import { TouchableHighlight } from "react-native"
import { AntDesign } from "@expo/vector-icons";

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { RootTabScreenProps } from "../../types";
import { ChartDisplay } from "../../components/budget/ChartDisplay";
import { BudgetList } from "../../components/budget/BudgetList";
import { useRefresh } from "../../hooks/useRefresh";
import { useAuth } from "../../hooks/useAuth";
import { MONTHS_ORDER } from "../../constants/Months"
import Button from "../../components/buttons/Button";
import moment from "moment";
import { Feather } from '@expo/vector-icons';

interface HeaderButtonProps {
    direction: 'left' | 'right';
    onPress?: () => void;
    marginLeft?: number;
    marginRight?: number;
}

export function HeaderButton({ direction, onPress, marginLeft, marginRight }: HeaderButtonProps) {
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
    const now = moment();
    const [month, setMonth] = useState(MONTHS_ORDER[now.month()]);
    const [year, setYear] = useState(now.year());
    const currentMonthIsNotPast = (year > now.year() || (year === now.year() && MONTHS_ORDER.indexOf(month) >= now.month()));

    // useRefresh(() => {
    //     setMonth(MONTHS_ORDER[now.month()]);
    //     setYear(now.year());
    // });

    const [getBudgets, { data: budgetData, refetch: budgetRefetch }] = useLazyQuery<GetBudgetsQuery, GetBudgetsQueryVariables>(GetBudgetsDocument);
    const [getMonthlyBreakdown, { data: monthData, refetch: monthRefetch }] = useLazyQuery<GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables>(GetMonthBreakdownDocument);
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getBudgets({ variables: { passwordHash } });
            getMonthlyBreakdown({ variables: { passwordHash, month: month as MonthType, year } });
        },
        redirect: 'ifUnauthorized',
    });
    useRefresh(() => {
        budgetRefetch({ passwordHash });
        monthRefetch({ passwordHash, month: month as MonthType, year });
    }, [month, year]);

    const [createBudget] = useMutation<CreateBudgetMutation>(CreateBudgetDocument, {
        variables: { passwordHash, month, year },
    });
    const [createBudgetCategory] = useMutation<CreateBudgetCategoryMutation, CreateBudgetCategoryMutationVariables>(CreateBudgetCategoryDocument);
    const [copyBudget] = useMutation<CopyBudgetMutation, CopyBudgetMutationVariables>(CopyBudgetDocument);

    const selectedBudget = useMemo(() => {
        if (budgetData?.budgets.__typename == 'BudgetsSuccess') {
            return budgetData.budgets.budgets.find(bud => (bud.month == month && bud.year == year));
        }
    }, [month, year, budgetData]);

    const previousBudget = useMemo(() => {
        if (budgetData?.budgets.__typename === 'BudgetsSuccess') {
            const sorted = budgetData.budgets.budgets.slice().sort((a, b) => {
                if (a.year > b.year) {
                    return 1;
                } else if (a.year < b.year) {
                    return -1;
                } else {
                    if (MONTHS_ORDER.indexOf(a.month) > MONTHS_ORDER.indexOf(b.month)) {
                        return 1;
                    } else if (MONTHS_ORDER.indexOf(a.month) < MONTHS_ORDER.indexOf(b.month)) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            }).filter((budget) => budget.budgetCategories && budget.budgetCategories.length > 0);

            for (let i = sorted.length - 1; i >= 0; i--) {
                if (sorted[i].year < year || (sorted[i].year === year && MONTHS_ORDER.indexOf(sorted[i].month) < MONTHS_ORDER.indexOf(month))) {
                    return sorted[i];
                }
            }
        }
    }, [month, year, budgetData]);

    const plannedAmount = useMemo(() => {
        if (selectedBudget !== undefined) {
            return selectedBudget.budgetCategories?.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0);
        }
    }, [month, year, budgetData]);

    const actualAmount = useMemo(() => {
        if (selectedBudget !== undefined && monthData?.monthBreakdown.__typename === 'MonthBreakdown') {
            const calculated = { budgeted: 0, unbudgeted: 0 };
            monthData.monthBreakdown.byCategory.filter((monthBreakdownCat) => {
                if (monthBreakdownCat.category && selectedBudget.budgetCategories) {
                    return !!selectedBudget.budgetCategories?.find((cat) => {
                        return cat.category.name === monthBreakdownCat.category?.name;
                    });
                } else {
                    return false;
                }
            }).forEach((applicableMonthBreakdownCat) => {
                calculated.budgeted += applicableMonthBreakdownCat.amountSpent;
            });
            monthData.monthBreakdown.byCategory.forEach((monthBreakdownCat) => {
                calculated.unbudgeted += monthBreakdownCat.amountSpent;
            });
            calculated.unbudgeted = calculated.unbudgeted - calculated.budgeted;
            return calculated
        }
    }, [month, year, monthData, selectedBudget]);

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
            headerLeft: () => <HeaderButton direction="left" marginLeft={10} onPress={backAMonth} />,
            headerRight: () => <HeaderButton direction="right" marginRight={10} onPress={forwardAMonth} />,
        });
    }, [month]);

    function handleAddBudget() {
        if (selectedBudget) {
            navigation.navigate("CreateBudget", { budget: selectedBudget as Budget });
        } else {
            createBudget({
                onError: (error => {
                    alert(error.message);
                }),
                onCompleted: ((response) => {
                    if (response.createBudget.__typename == "BudgetSuccess") {
                        navigation.navigate('CreateBudget', { budget: response.createBudget.budget as Budget })
                    }
                })
            });
        }
    }

    function handleUsePreviousBudget() {
        if (!previousBudget) return;
        if (selectedBudget) {
            previousBudget?.budgetCategories?.forEach((budgetCategory) => {
                createBudgetCategory({
                    variables: {
                        passwordHash,
                        amount: budgetCategory.amount,
                        budgetId: selectedBudget.id,
                        categoryId: budgetCategory.category.id,
                    },
                    onCompleted: () => {
                        budgetRefetch();
                    }
                });
            });
        } else {
            copyBudget({
                variables: {
                    passwordHash,
                    month: month as MonthType,
                    year,
                    id: previousBudget.id,
                },
                onCompleted: () => {
                    budgetRefetch();
                }
            });
        }
    }

    return (
        <View style={styles.screen}>
            <ChartDisplay
                planned={plannedAmount || 0}
                actualBudgeted={actualAmount?.budgeted || 0}
                actualUnbudgeted={actualAmount?.unbudgeted || 0} />
            <>
                {
                    actualAmount && actualAmount.unbudgeted > 0 &&
                    <View style={styles.warningContainer}>
                        <Feather name="info" size={21} color="red" style={styles.warningIcon} />
                        <Text style={styles.warningText}>${actualAmount?.unbudgeted.toFixed(2)} of expenses {currentMonthIsNotPast ? "are" : "were"} unplanned.</Text>
                    </View>
                }
            </>
            {
                (selectedBudget && selectedBudget.budgetCategories && selectedBudget.budgetCategories.length > 0 &&
                    <>
                        <View style={{ alignSelf: 'center', marginBottom: 20, }}>
                            {
                                currentMonthIsNotPast &&
                                <Button text="Add Budget" onPress={handleAddBudget} />
                            }
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
                || (
                    <View style={{ alignItems: 'center', flex: 1, paddingTop: 70, }}>
                        {
                            currentMonthIsNotPast &&
                            <Button text="Add Budget" onPress={handleAddBudget} />
                        }
                        {
                            previousBudget && currentMonthIsNotPast &&
                            <Button text="Use Previous Budget" onPress={handleUsePreviousBudget} />
                        }
                    </View>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemSeparator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    warningContainer: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 10,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    warningIcon: {
        marginRight: 8,
    },
    warningText: {
        color: 'red',
        fontSize: 18,
        fontWeight: '700',
    },
});
