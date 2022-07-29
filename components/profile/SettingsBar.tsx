import { useMemo } from "react";
import { StyleSheet, TouchableHighlight, View, Text } from "react-native";
import { Entypo } from '@expo/vector-icons';

export interface SettingsBarProps {
    title: string,
    onPress: () => void;
    subtitle?: string,
    topBorder?: boolean;
    bottomBorder?: boolean;
}

export function SettingsBar({ title, onPress, subtitle, topBorder, bottomBorder }: SettingsBarProps) {
    const dynamicStyles = useMemo(() => {
        return StyleSheet.create({
            container: {
                backgroundColor: '#f5f5f5',
                borderTopWidth: topBorder ? 1 : 0,
                borderBottomWidth: bottomBorder ? 1 : 0,
                borderTopColor: 'rgba(0,0,0,0.2)',
                borderBottomColor: 'rgba(0,0,0,0.2)',
                paddingVertical: 20,
            }
        });
    }, [topBorder, bottomBorder]);

    return (
        <TouchableHighlight style={dynamicStyles.container} onPress={onPress} underlayColor="rgba(0,0,0,0.2)">
            <View style={staticStyles.content}>
                <View style={staticStyles.titlesContiainer}>
                    <Text style={staticStyles.title}>{title}</Text>
                    {
                        subtitle !== undefined && subtitle.length > 0 &&
                        <Text style={staticStyles.subtitle}>{subtitle}</Text>
                    }
                </View>
                <Entypo name="chevron-right" size={24} color="black" style={staticStyles.icon} />
            </View>
        </TouchableHighlight>
    );
}

const staticStyles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titlesContiainer: {
        width: 270,
        marginRight: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        paddingTop: 5,
    },
    icon: {},
});
