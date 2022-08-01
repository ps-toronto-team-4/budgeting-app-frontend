import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableHighlight, View, Text, TextInput, ScrollView, Keyboard, KeyboardAvoidingView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Forms from "../../constants/Forms";
import { useRefresh } from "../../hooks/useRefresh";

export type DropdownFieldDatum = { id: string, value: string }

interface DropdownItemProps {
    item: DropdownFieldDatum;
    onPress: (id: string, value: string) => void;
}

function DropdownItem({ item, onPress }: DropdownItemProps) {
    return (
        <TouchableHighlight style={styles.container} onPress={() => onPress(item.id, item.value)} underlayColor="rgba(0,0,0,0.1)" key={item.id}>
            <View style={styles.content}>
                <Text style={styles.itemValue}>{item.value}</Text>
            </View>
        </TouchableHighlight>
    );
}

export interface DropdownFieldProps {
    label: string;
    placeholder: string;
    data: DropdownFieldDatum[];
    defaultValue?: string;
    onChange: (id: string) => void;
    onFocus?: () => void;
    required?: boolean;
}

/**
 * This component has a lot of moving parts. Modification can result in unexpected behaviour and is
 * done at your own risk. If you need any changes to this component, ask Hark.
 */
export function DropdownField({ label, placeholder, data, defaultValue, onChange, onFocus, required }: DropdownFieldProps) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const scrollViewStartRef = useRef<View>(null);
    const [value, setValue] = useState(defaultValue || '');
    const [cachedValue, setCachedValue] = useState(defaultValue || '');
    const filteredData = useMemo(() => {
        return data.filter(datum => datum.value.toLowerCase().startsWith(value.toLowerCase()));
    }, [data, value]);
    const backgroundColor = focused ? 'rgba(0,0,0,0.1)' : 'white';
    const containerStyle = useMemo(() => {
        return [styles.container, { backgroundColor }]
    }, [backgroundColor]);
    const [keyboardScreenY, setKeyboardScreenY] = useState(0);
    const [scrollViewScreenY, setScrollViewScreenY] = useState(0);
    const maxScrollViewHeight = keyboardScreenY - scrollViewScreenY - 25;
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardScreenY(e.endCoordinates.screenY);
        });
    }, []);

    useEffect(() => {
        if (focused) {
            onFocus && onFocus();
            inputRef.current?.focus();
            setValue('');
        } else {
            setValue(cachedValue);
            if (required && !cachedValue) {
                setErrorMessage('This field is required.');
            } else {
                setErrorMessage('');
            }
        }
    }, [focused]);

    useRefresh(() => {
        setErrorMessage('');
    });

    const handleItemPress = useCallback((itemId: string, itemValue: string) => {
        onChange(itemId);
        setCachedValue(itemValue);
        setFocused(false);
    }, []);

    const handlePress = useCallback(() => {
        setFocused(true);
        scrollViewStartRef.current?.measureInWindow((x, y) => {
            setScrollViewScreenY(y);
        });
    }, []);

    return (
        <View>
            <TouchableHighlight style={containerStyle} onPress={handlePress} underlayColor="rgba(0,0,0,0.1)">
                <>
                    <View style={styles.content}>
                        <Text style={styles.label}>{label}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={!focused ? placeholder : 'start typing to search'}
                            editable={focused}
                            ref={inputRef}
                            onBlur={() => setFocused(false)}
                            value={value}
                            onChangeText={setValue} />
                        <AntDesign
                            name={focused ? 'up' : 'down'}
                            size={20}
                            color="black" />
                    </View>
                    {
                        errorMessage.length > 0 && !focused &&
                        <Text style={styles.error}>{errorMessage}</Text>
                    }
                </>
            </TouchableHighlight>
            <View ref={scrollViewStartRef} onLayout={() => scrollViewStartRef.current?.measureInWindow((x, y) => setScrollViewScreenY(y))} />
            <View>
                {
                    focused &&
                    <ScrollView style={[styles.scrollView, { maxHeight: maxScrollViewHeight }]} keyboardShouldPersistTaps="always">
                        {filteredData.map(datum => <DropdownItem item={datum} onPress={handleItemPress} key={datum.id} />)}
                    </ScrollView>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingVertical: Forms.verticalSpacing,
        alignItems: 'center',
    },
    content: {
        width: 320,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: Forms.fontSize,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'right',
        paddingRight: Forms.horizontalSpacing,
    },
    input: {
        width: 190,
        fontSize: Forms.fontSize,
        color: 'black',
        marginRight: 10,
    },
    itemValue: {
        fontSize: Forms.fontSize,
        fontWeight: '600',
        paddingVertical: 3,
        paddingLeft: 80,
    },
    scrollView: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'white',
        zIndex: 1,
        elevation: 1,
        top: 0,
        left: 0,
    },
    error: {
        paddingTop: 10,
        color: 'red',
        alignSelf: 'center',
        fontSize: Forms.errorFontSize,
    },
});
