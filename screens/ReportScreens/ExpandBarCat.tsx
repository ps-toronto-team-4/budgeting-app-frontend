import { Text, View, StyleSheet } from "react-native";
import { RootStackScreenProps } from "../../types";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLazyQuery } from '@apollo/client';
import { GetMonthBreakdownDocument, GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables, MonthType } from "../../components/generated";



export default function ExpandExpense({ navigation, route }: RootStackScreenProps<'ExpandExpenses'>) {

    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => {
            getMonthlyBreakdown()
        },
        redirect: 'ifUnauthorized',
    });

    const [month, setMonth] = useState(route.params.month)
    const [year, setYear] = useState(route.params.year)

    const [getMonthlyBreakdown, { loading: monthlyBreakdownLoading, data: monthlyBreakdownData, refetch: monthlyBreakdownRefetch }] = useLazyQuery<GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables>(GetMonthBreakdownDocument,
        { variables: { passwordHash, month: month as MonthType, year } });

    return <View style={staticStyles.screen}>
        {/* <MonthlyVsBudgetedCategory
                        data={monthlyBreakdownData?.monthBreakdown.__typename === "MonthBreakdown" ? monthlyBreakdownData.monthBreakdown.byCategory : []}
                        budgetReferenceData={budgetsData?.budgets.__typename === 'BudgetsSuccess' ?
                            budgetsData.budgets.budgets.find(ele => {
                                return ele.month == month && ele.year == year
                            }) as Budget : undefined} /> */}
        <View>

            <Text>
                Your month is :{month}

            </Text>
        </View>

        <View>
            <Text>
                Your year is :{year}
            </Text>
        </View>
    </View >
}

const staticStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
})