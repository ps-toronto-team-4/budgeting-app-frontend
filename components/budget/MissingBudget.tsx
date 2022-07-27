import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Button from '../../components/Button';
import { CreateBudgetDocument, CreateBudgetMutation, GetBudgetsQuery, MonthType, CopyBudgetMutation, CopyBudgetDocument, BudgetCategory, Budget } from '../generated';
import { MONTHS_ORDER, MONTH_TO_NUM_STRING } from "../../constants/Months";
import { useNavigation } from '@react-navigation/native';

export interface MissingBudgetProps {
    otherBudgets?: GetBudgetsQuery;
    triggerRefetch: () => void;
    passwordHash: string;
    month: string;
    year: number;
}

export function MissingBudget({ otherBudgets, triggerRefetch, passwordHash, month, year }: MissingBudgetProps) {
    const nav = useNavigation();;;;;;;;;;;;
    const [closetBudgetId, setClosetBudgetId] = useState<number | undefined>()

    const [createBudget, { }] = useMutation<CreateBudgetMutation>(CreateBudgetDocument, {
        variables: { passwordHash, month, year },
        onError: (error => {
            alert(error.message);
        }),
        onCompleted: ((response) => {
            if (response.createBudget.__typename == "BudgetSuccess") {
                // triggerRefetch()
                nav.navigate('CreateBudget', { budget: response.createBudget.budget as Budget })
            }
        })
    })

    const [copyBudget, { }] = useMutation<CopyBudgetMutation>(CopyBudgetDocument, {
        variables: { passwordHash, month, year, id: closetBudgetId },
        onError: ((error) => {
            alert(error.message);
        }),
        onCompleted: ((response) => {
            if (response.copyBudget.__typename == "BudgetSuccess") {
                triggerRefetch()
            }
        })
    })

    useEffect(() => {
        var closestBudget: string | undefined = ''
        if (otherBudgets?.budgets.__typename == 'BudgetsSuccess') {
            otherBudgets.budgets.budgets.forEach(ele => {
                const monthString = MONTH_TO_NUM_STRING(ele.month.valueOf())
                if (monthString === null) {
                    return
                }
                const curr = ele.year + "-" + MONTH_TO_NUM_STRING(ele.month)
                if (closestBudget === undefined && curr < year + '-' + month) {
                    closestBudget = curr
                } else if (closestBudget === undefined) {
                    return
                }
                else if ((curr > closestBudget && curr < year + '-' + month)) {
                    closestBudget = curr
                }
            })

        }
        const closestMonth = closestBudget !== undefined ? MONTHS_ORDER[parseInt(closestBudget.split('-')[1])] : 'No Month found'
        const closestYear = closestBudget !== undefined ? parseInt(closestBudget.split('-')[0]) : -1
        if (otherBudgets?.budgets.__typename == 'BudgetsSuccess') {
            const foundBudget = otherBudgets.budgets.budgets.find(bud => {
                return (bud.month == closestMonth && bud.year == closestYear)
            })
            setClosetBudgetId(foundBudget?.id)
        }
    }, [otherBudgets])

    return (
        <View style={{ alignItems: 'center', flex: 1, paddingTop: 70, }}>
            <Button
                text="Add Budget"
                accessibilityLabel='Create new budget'
                onPress={() => createBudget()}
            />
            <Button
                text="Use Previous Budget"
                accessibilityLabel='Copy last months budget'
                onPress={() => copyBudget()}
            />
        </View>
    );
}
