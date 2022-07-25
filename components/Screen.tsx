import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReactElement, useEffect } from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { Keyboard, StyleSheet } from "react-native";
import { RootStackParamList, RootStackScreenProps, RootTabParamList } from "../types";
import { View } from "./Themed";

export interface ScreenProps {
    children?: ReactElement<any, any> | ReactElement<any, any>[];
    onDismissKeyboard?: () => void;
}

export function Screen({ children, onDismissKeyboard}: ScreenProps) {
    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onDismissKeyboard && onDismissKeyboard(); }}>
            <SafeAreaView style={styles.screen}>
                {children}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    }
});
