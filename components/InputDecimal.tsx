//Shamelessly stolen from:
//https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx:0-1287

import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";
import { setIn } from "formik";
import React, { FocusEventHandler, LegacyRef, useRef, useState } from "react";
import { NativeSyntheticEvent, TextInput, TextInputChangeEventData, TextInputFocusEventData } from "react-native";
import AdaptiveTextInput from "./AdaptiveTextInput";
import { View } from "./Themed";

export const InputDecimal = ({ callback, type, placeholder, initalVal }: { callback: Function, type: string, placeholder: string, initalVal?: Number }) => {

    const [input, setInput] = useState(initalVal === undefined ? '' : initalVal.toFixed(2))
    const [start, setStart] = useState(0)
    const inputRef = useRef(null)

    const noCursorChange = (newValue: string) => {
        let val = newValue;
        val = val.replace(/([^0-9.]+)/, "");
        val = val.replace(/^(0|\.)/, "");
        const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
        let newVal = ''

        newVal = match == null ? '0' : match[1] + match[2];
        setInput(newVal)
        const numericalVal = parseFloat(newVal)
        callback(numericalVal)
        // if (val.indexOf('.') >= 0 || (input == '')) {
        //     newVal = match == null ? '0' : match[1] + match[2];
        //     setInput(newVal)
        // } else {
        //     newVal = match == null ? '0' : match[1].slice(0, match[0].length - 2)
        //     console.log('check', newVal)
        //     setInput(newVal)
        // }
    }

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}
        >
            <TextInput
                ref={inputRef}
                onChangeText={value => noCursorChange(value)}
                value={input}
                keyboardType="numeric"
                placeholder="Enter Amount"
                style={{ maxWidth: 220, fontSize: 50, flex: 1, borderColor: 'black', borderWidth: 1 }}
            />
        </View>
    )
}

export const ControlledInputDecimal = ({
    callbackNumber,
    callbackLable,
    label,
    placeholder
}: {
    callbackNumber: Function,
    callbackLable: Function,
    placeholder: string,
    label: string,
    initalVal?: Number
}) => {

    const [input, setInput] = useState('')
    const inputRef = useRef(null)

    const noCursorChange = (newValue: string) => {
        let val = newValue;
        val = val.replace(/([^0-9.]+)/, "");
        val = val.replace(/^(0|\.)/, "");
        const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
        let newVal = ''

        newVal = match == null ? '0' : match[1] + match[2];
        callbackLable(newVal)
        const numericalVal = parseFloat(newVal)
        callbackNumber(numericalVal)
    }

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}
        >
            <TextInput
                ref={inputRef}
                onChangeText={value => noCursorChange(value)}
                value={label}
                keyboardType="numeric"
                placeholder={placeholder}
                style={{ maxWidth: 220, fontSize: 50, flex: 1, borderColor: 'black', borderWidth: 1 }}
            />
        </View>
    )
}
