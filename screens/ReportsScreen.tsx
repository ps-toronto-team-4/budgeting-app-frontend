import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { ColorValue } from "react-native"

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import Styles from '../constants/Styles';
import { VictoryChart, VictoryLegend, VictoryPie } from 'victory-native';
import { GetCategoriesDocument, GetCategoriesQuery } from '../components/generated';
import MonthlyExpenseGraph from '../components/GraphDisplays/monthlyExpenses';

export default function ReportsScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    const passwordHash = useAuth();

    useUnauthRedirect();

    return (
        <Screen>
            <Text>Hello from Reports Screen!</Text>
            <Text>The locally stored password hash is: {passwordHash}</Text>
        </Screen>
    );
}



const styles = StyleSheet.create({

});
