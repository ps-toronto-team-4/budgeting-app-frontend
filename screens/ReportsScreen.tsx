import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import Styles from '../constants/Styles';
import { VictoryChart, VictoryLegend, VictoryPie } from 'victory-native';
import { useQuery } from '@apollo/client';
import { GetCategoriesDocument, GetCategoriesQuery, MonthBreakdownCategory } from '../components/generated';
import ByCategory from '../components/GraphDisplays/ByCategory';

export default function ReportsScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    const passwordHash = useAuth();

    useUnauthRedirect();

    const { loading: categoriesLoading, data: categoriesData } = useQuery<GetCategoriesQuery>(GetCategoriesDocument,
        { variables: { passwordHash: passwordHash } }
    );

    return (
        <Screen>
            <Text> This is the Reports Screen! </Text>
            <ByCategory CategoryData={[
                {
                    "category": null,
                    "amountSpent": 53.099999999999994
                },
                {
                    "category": {
                        "name": "Loans",
                        "colourHex": "97E2D5",
                        "id": 4
                    },
                    "amountSpent": 460.67
                },
                {
                    "category": {
                        "name": "Cell Phone Bill",
                        "colourHex": "EF7300",
                        "id": 8
                    },
                    "amountSpent": 434.2099999999999
                },
                {
                    "category": {
                        "name": "Electronics",
                        "colourHex": "C1A6FA",
                        "id": 6
                    },
                    "amountSpent": 147.42000000000002
                },
                {
                    "category": {
                        "name": "Car Insurance",
                        "colourHex": "FFC803",
                        "id": 7
                    },
                    "amountSpent": 132.38
                },
                {
                    "category": {
                        "name": "Dining Out",
                        "colourHex": "FEC600",
                        "id": 3
                    },
                    "amountSpent": 43.12
                },
                {
                    "category": {
                        "name": "Transportation",
                        "colourHex": "009418",
                        "id": 5
                    },
                    "amountSpent": 266.38
                },
                {
                    "category": {
                        "name": "Rent",
                        "colourHex": "0018F2",
                        "id": 2
                    },
                    "amountSpent": 339.97
                },
                {
                    "category": {
                        "name": "Groceries",
                        "colourHex": "5BEF007D",
                        "id": 1
                    },
                    "amountSpent": 232.66
                }
            ] as MonthBreakdownCategory[]} Month={'JANUARY'} Year={2022}></ByCategory>
        </Screen>
    );
}



const styles = StyleSheet.create({

});
