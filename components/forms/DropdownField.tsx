import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableHighlight, View, Text, TextInput, ScrollView, Keyboard, KeyboardAvoidingView, Platform, ColorValue, ViewStyle, StyleProp } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Forms from "../../constants/Forms";
import { useRefresh } from "../../hooks/useRefresh";
import { ColorCircle } from "../ColorCircle";

export type DropdownFieldDatum = { id: string, value: string, color?: ColorValue }

interface DropdownItemProps {
    item: DropdownFieldDatum;
    onPress: (id: string, value: string) => void;
}

function DropdownItem({ item, onPress }: DropdownItemProps) {
    const { id, value, color } = item;
    const textStyle: StyleProp<ViewStyle> = useMemo(() => {
        return [styles.itemValue, { paddingLeft: color ? 20 : 80 }]
    }, [color]);

    return (
        <TouchableHighlight style={styles.container} onPress={() => onPress(id, value)} underlayColor="rgba(0,0,0,0.1)" key={id}>
            <View style={styles.content}>
                {
                    color &&
                    <View style={{ marginLeft: 40 }}>
                        <ColorCircle color={color} size={20} />
                    </View>
                }
                <Text style={textStyle}>{value}</Text>
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
    /**
     * Only does anything if `required` is true. Tells this component to check whether the field
     * is empty and, if so, display error.
     */
    check?: boolean;
    onCreateNew?: (value: string) => void;
    /**
     * Only does anything if onCreateNew is defined.
     */
    labelForCreateNew?: string;
}

/**
 * This component has a lot of moving parts. Modification can result in unexpected behaviour and is
 * done at your own risk. If you need any changes to this component, ask Hark.
 */
export function DropdownField({ label, placeholder, data, defaultValue, onChange, onFocus, required, check, onCreateNew, labelForCreateNew }: DropdownFieldProps) {
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
        return [styles.container, { backgroundColor, zIndex: -1, elevation: -1 }]
    }, [backgroundColor]);
    const [keyboardScreenY, setKeyboardScreenY] = useState(0);
    const [scrollViewScreenY, setScrollViewScreenY] = useState(0);
    const maxScrollViewHeight = keyboardScreenY - scrollViewScreenY - (Platform.OS === 'android' ? 25 : 0);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardScreenY(e.endCoordinates.screenY);
        });
    }, []);

    useEffect(() => {
        if (required && check && !cachedValue) setErrorMessage('This field is required.');
    }, [check]);

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

    const handleItemPress = (itemId: string, itemValue: string) => {
        onChange(itemId);
        setCachedValue(itemValue);
        setFocused(false);
    };

    const handlePress = useCallback(() => {
        setFocused(true);
        scrollViewStartRef.current?.measureInWindow((x, y) => {
            setScrollViewScreenY(y);
        });
    }, []);

    function handlePressCreateNew() {
        onCreateNew && onCreateNew(value);
        setCachedValue(value);
        setFocused(false);
    }

    return (
        <>
            <TouchableHighlight style={containerStyle} onPress={handlePress} underlayColor="rgba(0,0,0,0.1)">
                <>
                    <View style={styles.content}>
                        <Text style={styles.label}>{label}</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="grey"
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
                        {
                            onCreateNew &&
                            <DropdownItem
                                item={{ id: 'new', value: value ? `Add "${value}"` : `Create new ${labelForCreateNew || label.toLowerCase()}`, color: 'plus' }}
                                onPress={handlePressCreateNew} />
                        }
                    </ScrollView>
                }
            </View>
        </>
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
