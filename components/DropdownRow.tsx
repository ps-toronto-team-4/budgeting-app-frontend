import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, FlatList, TouchableHighlight, Keyboard } from 'react-native';
import Colors from "../constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import { TouchableRow } from "./TouchableRow";

export function DropdownItem({ name, onSelect }: { name: string, onSelect: (name: string) => void }) {
    return ( // todo fix below
        <TouchableRow onPress={() => onSelect(name)} topBorder={true}>
            {/* <View style={[styles.fieldContainer, { paddingLeft: 70 }]}> */}
            <Text style={styles.listItem}>{name}</Text>
            {/* </View> */}
        </TouchableRow>
    );
};

export type DropdownRowProps = {
    label: string;
    data: string[];
    onSelect: (name: string) => void;
    expanded?: boolean;
    onExpand?: () => void;
    onCollapse?: () => void;
    defaultValue?: string;
    onCreateNew?: () => void;
    visible?: boolean;
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
}: DropdownRowProps) {
    const inputRef = useRef<TextInput | null>(null);
    const [value, setValue] = useState(defaultValue || '');
    // this state is only used when expanded prop is undefined
    const [expandedState, setExpandedState] = useState(false);
    const expanded = expandedProp === undefined ? expandedState : expandedProp

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

    function renderDropdownItem({ item }: { item: { name: string, onSelect: (name: string) => void } }) {
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
            <TouchableRow
                topBorder={true}
                onPress={() => handleRowPress()}>
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
            </TouchableRow>
            {
                (expanded) ?
                    <FlatList
                        data={
                            data.filter(name => {
                                return name.toLowerCase().startsWith(value.toLowerCase())
                            }).map(name => {
                                return { name: name, onSelect: handleSelect }
                            })
                        }
                        renderItem={renderDropdownItem}
                        keyExtractor={item => item.name}
                        ListFooterComponent={
                            onCreateNew ?
                                <DropdownItem
                                    name={'Create new ' + label.toLowerCase()}
                                    onSelect={(_) => onCreateNew()} />
                                : <View></View>
                        }>
                    </FlatList>
                    :
                    <View></View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        paddingHorizontal: 30,
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
    listItem: {
        fontSize: 15,
    },
});
