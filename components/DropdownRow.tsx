import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, FlatList, TouchableHighlight, Keyboard } from 'react-native';
import Colors from "../constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import { Row } from "./Row";

export function DropdownItem({ name, onSelect }: { name: string, onSelect: (name: string) => void }) {
    return ( // todo fix below
        <Row onPress={() => onSelect(name)} topBorder>
            {/* <View style={[styles.fieldContainer, { paddingLeft: 70 }]}> */}
            <Text style={styles.listItem}>{name}</Text>
            {/* </View> */}
        </Row>
    );
};

export type DropdownRowProps = {
    label: string;
    data: {id: number, name: string}[];
    onSelect: (name: string) => void;
    expanded?: boolean;
    onExpand?: () => void;
    onCollapse?: () => void;
    defaultValue?: string;
    onCreateNew?: () => void;
    createLabel?: string;
    visible?: boolean;
    topBorder?: boolean;
    bottomBorder?: boolean;
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
    createLabel,
    visible,
    topBorder,
    bottomBorder,
}: DropdownRowProps) {
    const inputRef = useRef<TextInput | null>(null);
    const [value, setValue] = useState(defaultValue || '');
    // this state is only used when expanded prop is undefined
    const [expandedState, setExpandedState] = useState(false);
    const expanded = expandedProp === undefined ? expandedState : expandedProp

    useEffect(() => {
        setValue(defaultValue || '')
    }, [defaultValue])

    useEffect(() => {
        if (expanded) {
            setValue('');
            inputRef.current?.focus();
        } else {
            inputRef.current?.blur();
        }
    }, [expanded]);

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

    function renderDropdownItem({ item }: { item: { id: string, name: string, onSelect: (name: string) => void } }) {
        return (
            <DropdownItem name={item.name} onSelect={item.onSelect}></DropdownItem>
        );
    }

    function handleSelect(name: string) {
        setValue(name);
        collapse();
        onSelect(name);
    }

    return (
        <View style={{display: visible === false ? 'none' : 'flex'}}>
            <Row
                topBorder={topBorder}
                bottomBorder={bottomBorder}
                onPress={() => handleRowPress()}
            >
                <View style={styles.fieldLabelAndInputContainer}>
                    <Text style={styles.fieldLabel}>{label}:</Text>
                    <TextInput
                        style={styles.fieldInput}
                        editable={expanded}
                        placeholder={expanded? ("Start typing to search") : ("Select " + label)}
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
            </Row>
            {
                (expanded) ?
                    <FlatList
                        data={
                            data.filter(item => {
                                return item.name.toLowerCase().startsWith(value.toLowerCase())
                            }).map(item => {
                                return { id: item.id.toString(), name: item.name, onSelect: handleSelect }
                            })
                        }
                        renderItem={renderDropdownItem}
                        keyExtractor={item => item.id}
                        ListFooterComponent={
                            onCreateNew &&
                                <DropdownItem
                                    name={'Create new ' + createLabel}
                                    onSelect={(_) => onCreateNew()} />
                        }
                    />
                :
                <></>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    fieldLabelAndInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 280,
    },
    fieldLabel: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingLeft: 5
    },
    fieldInput: {
        fontSize: 15,
        width: 160,
    },
    listItem: {
        fontSize: 15,
        paddingLeft: 40,
    },
});
