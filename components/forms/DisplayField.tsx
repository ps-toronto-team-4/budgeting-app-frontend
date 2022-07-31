import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import Forms from "../../constants/Forms";

export interface DisplayFieldProps {
    label: string;
    value: string;
    onPress?: () => void;
    /**
     * Setting this prop only does anything if onPress is also set.
     * Should be set whenever onPress is set.
     */
    focused?: boolean;
}

/**
 * A simple field for displaying text. It can be interactive or non-interactive
 * depending on whether onPress is defined.
 */
export function DisplayField({ label, value, onPress, ...otherProps }: DisplayFieldProps) {
    const [focused, setFocused] = useState(otherProps.focused !== undefined ? otherProps.focused : false);
    const backgroundColor = !onPress || focused ? 'rgba(0,0,0,0.1)' : 'white';
    const containerStyle = useMemo(() => {
        return [styles.container, { backgroundColor }];
    }, [backgroundColor]);

    useEffect(() => {
        if (otherProps.focused !== undefined) setFocused(otherProps.focused);
    }, [otherProps.focused]);

    return (
        <TouchableHighlight
            style={containerStyle}
            onPress={() => { setFocused(true); onPress && onPress(); }}
            underlayColor="rgba(0,0,0,0.1)">
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </TouchableHighlight>
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
    value: {
        width: 220,
        fontSize: Forms.fontSize,
    },
});
