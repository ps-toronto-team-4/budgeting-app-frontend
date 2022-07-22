import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";

export default function BudgetScreen({ navigation }: RootTabScreenProps<'Budget'>) {
    const passwordHash = useAuth();

    return (
        <View>
            <Text>Hello from BudgetScreen!</Text>
            <Text>The locally stored password hash is: {passwordHash}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
});