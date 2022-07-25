import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native'
import { CreateBudgetDocument, CreateBudgetMutation, GetBudgetsQuery, MonthType, CopyBudgetMutation, CopyBudgetDocument } from '../../../components/generated';
import { MONTHS_ORDER, MONTH_TO_NUM_STRING } from "../../../constants/Months"

const MissingBudget = (
    {
        otherBudgets,
        triggerRefetch,
        passwordHash,
        month,
        year
    }
        :
        {
            otherBudgets: GetBudgetsQuery | undefined,
            triggerRefetch: Function,
            passwordHash: string,
            month: string,
            year: number
        }) => {

    const [closetBudgetId, setClosetBudgetId] = useState<number | undefined>()


    const [createBudget] = useMutation<CreateBudgetMutation>(CreateBudgetDocument, {
        variables: { passwordHash, month, year },
        onError: (error => {
            alert(error.message);
        }),
        onCompleted: ((response) => {
            if (response.createBudget.__typename == "BudgetSuccess") {
                triggerRefetch()
            }
        })
    })

    const [copyBudget] = useMutation<CopyBudgetMutation>(CopyBudgetDocument, {
        variables: { passwordHash, month, year, id: closetBudgetId },
        onError: (error => {
            alert(error.message);
        }),
        onCompleted: ((response) => {
            if (response.copyBudget.__typename == "BudgetSuccess") {
                triggerRefetch()
            }
        })
    })

    useEffect(() => {
        var closetBudget: string | undefined = ''
        if (otherBudgets?.budgets.__typename == 'BudgetsSuccess') {
            otherBudgets.budgets.budgets.forEach(ele => {
                const monthString = MONTH_TO_NUM_STRING(ele.month.valueOf())
                if (monthString === null || monthString === undefined) {
                    return
                }
                const curr = ele.year + "-" + MONTH_TO_NUM_STRING(ele.month)
                if (closetBudget === undefined && curr < year + '-' + month) {
                    closetBudget = curr
                } else if (closetBudget === undefined) {
                    return
                }
                else if ((curr > closetBudget && curr < year + '-' + month)) {
                    closetBudget = curr
                }
            })

        }
        const closetsMonth = closetBudget !== undefined ? MONTHS_ORDER[parseInt(closetBudget.split('-')[1])] : 'No Month found'
        const closetsYear = closetBudget !== undefined ? parseInt(closetBudget.split('-')[0]) : -1
        if (otherBudgets?.budgets.__typename == 'BudgetsSuccess') {
            const foundBudget = otherBudgets.budgets.budgets.find(bud => {
                return (bud.month == closetsMonth && bud.year == closetsYear)
            })
            setClosetBudgetId(foundBudget?.id)
        }
    }, [otherBudgets])

    return (<View>
        <Text>
            Wow such emptiness, make a budget for this month
            <Button
                title="New Budget from scratch"
                onPress={() => createBudget()}
            />
            <Button
                title="Copy Last Month's Budget"
                onPress={() => copyBudget()}
            />
        </Text>
    </View>)
}

export default MissingBudget