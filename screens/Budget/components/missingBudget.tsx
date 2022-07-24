import { useMutation } from '@apollo/client';
import { View, Text, Button } from 'react-native'
import { CreateBudgetDocument, CreateBudgetMutation, GetBudgetsQuery } from '../../../components/generated';

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

    var closetBudget = undefined

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

    return (<View>
        <Text>
            Wow such emptiness, make a budget for this month
            <Button
                title="New Budget from scratch"
                onPress={() => createBudget()}
            />
            <Button
                title="Copy Last Month's Budget"
                onPress={() => alert("not implemented")}
            />
        </Text>
    </View>)
}

export default MissingBudget