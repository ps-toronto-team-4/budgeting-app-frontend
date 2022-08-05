import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReactElement, useEffect, useMemo } from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { Keyboard, StyleSheet } from "react-native";
import { RootStackParamList, RootStackScreenProps, RootTabParamList } from "../../types";
import { View } from "../Themed";

export interface ScreenProps {
    children?: ReactElement<any, any> | ReactElement<any, any>[];
    onDismissKeyboard?: () => void;
    /**
     * If backdrop is enabled, to show an element on top of the backdrop give
     * it the styles: `zIndex: 1` and `elevation: 1`.
     */
    backdrop?: boolean;
}

export function Form({ children, onDismissKeyboard, backdrop }: ScreenProps) {
    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onDismissKeyboard && onDismissKeyboard(); }}>
            <SafeAreaView style={styles.screen}>
                {children}
                {
                    backdrop &&
                    <View style={styles.backdrop}></View>
                }
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
    },
});
