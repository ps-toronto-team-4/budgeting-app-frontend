import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { ColorValue } from "react-native"

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function ExpenseDetailsScreen() {
    return (
        <View>
            <Text>Hello from ExpenseDetailsScreen!</Text>
        </View>
    );
}



const styles = StyleSheet.create({

});
