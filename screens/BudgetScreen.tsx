import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { ColorValue } from "react-native"

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function BudgetScreen() {
    return (
        <View>
            <Text>Hello from BudgetScreen!</Text>
        </View>
    );
}



const styles = StyleSheet.create({

});