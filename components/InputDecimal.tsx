//Shamelessly stolen from:
//https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx:0-1287

import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";
import { setIn } from "formik";
import React, { FocusEventHandler, LegacyRef, useRef, useState } from "react";
import { NativeSyntheticEvent, TextInput, TextInputChangeEventData, TextInputFocusEventData } from "react-native";
import AdaptiveTextInput from "./AdaptiveTextInput";
import { View } from "./Themed";

export const InputDecimal = ({ callback, type, placeholder }: { callback: Function, type: string, placeholder: string }) => {

    const [input, setInput] = useState('')
    const [start, setStart] = useState(0)
    const inputRef = useRef(null)

    // const change = (e: any) => {
    //     // this.start = e.target.selectionStart;
    //     if (inputRef !== undefined && inputRef != null) {
    //         inputRef.current
    //     }
    //     const currentStart = inputRef.current
    //     let val = e.target.value;
    //     val = val.replace(/([^0-9.]+)/, "");
    //     val = val.replace(/^(0|\.)/, "");
    //     const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
    //     const value = match == null ? '0' : match[1] + match[2];
    //     e.target.value = value;
    //     this.setState({ input: value });
    //     if (val.length > 0) {
    //         e.target.value = Number(value).toFixed(2);
    //         e.target.setSelectionRange(this.start, this.start);
    //         this.setState({ input: Number(value).toFixed(2) });
    //         this.state.callback(Number(value).toFixed(2))
    //     }
    // };

    // const tempChange = (value: string) => {
    //     if (inputRef?.current == null) {
    //         return
    //     }
    //     if (value == '') {
    //         setInput('')
    //         inputRef.current.value = ''
    //     }
    //     console.log(inputRef.current)
    //     console.log(inputRef.current.value)
    //     //--
    //     const currentStart = inputRef.current.selectionStart
    //     let val = inputRef.current.value;
    //     val = val.replace(/([^0-9.]+)/, "");
    //     val = val.replace(/^(0|\.)/, "");
    //     const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
    //     let newVal = ''
    //     console.log('match', match, value, input)
    //     if (val.indexOf('.') >= 0 || (input == '')) {
    //         newVal = match == null ? '0' : match[1] + match[2];
    //     } else {
    //         newVal = match == null ? '0' : match[1].slice(0, match[0].length - 2)
    //         console.log('check', newVal)
    //     }
    //     // inputRef.current.value = value;

    //     if (val.length > 0) {
    //         setInput(Number(newVal).toFixed(2))
    //         inputRef.current.value = Number(newVal).toFixed(2);
    //         inputRef.current.setSelectionRange(currentStart, currentStart)
    //         // this.setState({ input: Number(value).toFixed(2) });
    //         // this.state.callback(Number(value).toFixed(2))
    //     } else {
    //         setInput(val)
    //     }
    // }

    // const secondChange = (e: any) => {
    //     console.log('log', e)
    //     const currentStart = e.target.selectionStart
    //     let val = e.target.value;
    //     if (val === undefined) {
    //         return
    //     }
    //     val = val.replace(/([^0-9.]+)/, "");
    //     val = val.replace(/^(0|\.)/, "");
    //     const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
    //     const value = match == null ? '0' : match[1] + match[2];
    //     e.target.value = value;
    //     if (val.length > 0) {
    //         e.target.value = Number(value).toFixed(2);
    //         e.target.setSelectionRange(currentStart, currentStart);
    //         setInput(Number(value).toFixed(2))
    //         // this.state.callback(Number(value).toFixed(2))
    //     }
    // }

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
