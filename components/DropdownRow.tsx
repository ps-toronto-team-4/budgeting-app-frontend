import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, FlatList, TouchableHighlight, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Colors from "../constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import { Row } from "./Row";

export function DropdownItem({ name, onSelect }: { name: string, onSelect: (name: string) => void }) {
    return ( // todo fix below
        <Row onPress={() => { console.log('dropdown item caught press'); onSelect(name) }} topBorder>
            {/* <View style={[styles.fieldContainer, { paddingLeft: 70 }]}> */}
            <Text style={styles.listItem}>{name}</Text>
            {/* </View> */}
        </Row>
    );
};

export type DropdownRowProps = {
    label: string;
    data: { id: string, name: string }[];
    onSelect: (name: string) => void;
    expanded?: boolean;
    onExpand?: () => void;
    onCollapse?: () => void;
    defaultValue?: string;
    onCreateNew?: () => void;
    visible?: boolean;
    topBorder?: boolean;
    bottomBorder?: boolean;
    error?: string;
};

export function DropdownRow({
    label,
    data,
    onSelect,
    expanded: expandedProp,
    onExpand,
    onCollapse,
    defaultValue,
    onCreateNew,
    visible,
    topBorder,
    bottomBorder,
    error,
}: DropdownRowProps) {
    const inputRef = useRef<TextInput | null>(null);
    const [value, setValue] = useState(defaultValue || '');
    const [cachedValue, setCachedValue] = useState('');
    // this state is only used when expanded prop is undefined
    const [expandedState, setExpandedState] = useState(false);
    const expanded = expandedProp === undefined ? expandedState : expandedProp

    useEffect(() => {
        if (expanded) {
            setCachedValue(value);
            setValue('');
            inputRef.current?.focus();
        } else {
            if (value === '') {
                setValue(cachedValue);
            }
            inputRef.current?.blur();
        }
    }, [expanded]);

    useEffect(() => {
        console.log(defaultValue)
    }, []);

    const collapse = () => {
        if (expanded) {
            onCollapse && onCollapse();
            if (expandedProp === undefined) {
                setExpandedState(false);
            }
        }
    };

    const handleRowPress = () => {
        if (!expanded) {
            onExpand && onExpand();
            if (expandedProp === undefined) {
                setExpandedState(true);
            }
        }
    };

    const handleIconPress = () => {
        // propogate press event to merchant row because propagation
        // is prevented by the icon for some reason.
        handleRowPress();
        collapse();
    };

    function handleSelect(name: string) {
        setValue(name);
        collapse();
        onSelect(name);
    }

    return (
        <View style={{ display: visible === false ? 'none' : 'flex' }}>
            <Row
                topBorder={topBorder}
                bottomBorder={bottomBorder}
                onPress={() => handleRowPress()}
            >
                <View style={styles.fieldAndErrorContainer}>
                    <View style={styles.fieldLabelAndInputAndArrowContainer}>
                        <View style={styles.fieldLabelAndInputContainer}>
                            <Text style={styles.fieldLabel}>{label}:</Text>
                            <TextInput
                                style={styles.fieldInput}
                                editable={expanded}
                                placeholder={"Select " + label}
                                ref={inputRef}
                                value={value}
                                onChangeText={setValue}>
                            </TextInput>
                        </View>
                        <AntDesign
                            name={expanded ? 'up' : 'down'}
                            size={20}
                            color="black"
                            onPress={handleIconPress} />
                    </View>
                    {
                        !expanded && !!error?.length &&
                        <Text style={styles.error}>{error}</Text>
                    }
                </View>
            </Row>
            {
                expanded &&
                <ScrollView style={styles.scrollView}>
                    {
                        data.filter((item) => {
                            return item.name.toLowerCase().startsWith(value.toLowerCase())
                        }).map((item) => {
                            return <DropdownItem name={item.name} onSelect={handleSelect} key={item.id} />
                        })
                    }
                    {
                        onCreateNew &&
                        <DropdownItem name={`Create new ${label.toLowerCase()}`} onSelect={() => onCreateNew()} />
                    }
                </ScrollView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    fieldAndErrorContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
    },
    fieldLabelAndInputAndArrowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 320,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    fieldLabelAndInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 280,
    },
    fieldLabel: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    fieldInput: {
        fontSize: 15,
        width: 180
    },
    scrollView: {
        height: 150,
    },
    listItem: {
        fontSize: 15,
        paddingLeft: 40,
    },
    error: {
        paddingTop: 10,
        color: 'red',
        alignSelf: 'center',
    },
});
