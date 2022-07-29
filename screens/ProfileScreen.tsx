import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableHighlight, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RootTabScreenProps } from "../types";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Styles from '../constants/Styles';
import { useQuery } from '@apollo/client';
import { GetUserDocument, GetUserQuery, GetUserQueryVariables } from '../components/generated';
import { useRefresh } from '../hooks/useRefresh';
import { SettingsBar } from '../components/profile/SettingsBar';

function formatPhoneNumber(phoneNumber: string): string {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
}

export default function ProfileScreen({ navigation }: RootTabScreenProps<'Profile'>) {
    const passwordHash = useAuth();
    const { data, refetch } = useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
        variables: { passwordHash }
    });
    useRefresh(refetch, [passwordHash]);
    useUnauthRedirect();

    const logout = () => {
        AsyncStorage.multiRemove(['passwordHash', 'New Category']).then(() => {
            navigation.navigate('Welcome');
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logout}>
                    <Text style={styles.logoutBtn}>Log Out</Text>
                </TouchableOpacity>
            )
        });
    }, []);

    if (!data) {
        return <Screen></Screen>
    } else if (data?.user.__typename !== 'User') {
        return <Text>Error fetching user data.</Text>;
    } else {
        const user = data.user;

        return (
            <ScrollView style={styles.screen}>
                <FontAwesome5 name="user-circle" size={80} color="black" style={styles.userIcon} />
                <View style={styles.userDetailsContainer}>
                    <View style={styles.userDetailsRow}>
                        <Text style={styles.userDetailsLabel}>First name</Text>
                        <Text style={styles.userDetailsValue}>{user.firstName}</Text>
                    </View>
                    <View style={styles.userDetailsRow}>
                        <Text style={styles.userDetailsLabel}>Last name</Text>
                        <Text style={styles.userDetailsValue}>{user.lastName}</Text>
                    </View>
                    <View style={styles.userDetailsRow}>
                        <Text style={styles.userDetailsLabel}>Username</Text>
                        <Text style={styles.userDetailsValue}>{user.username}</Text>
                    </View>
                    <View style={styles.userDetailsRow}>
                        <Text style={styles.userDetailsLabel}>Email</Text>
                        <Text style={styles.userDetailsValue}>{data.user.email}</Text>
                    </View>
                    <View style={styles.userDetailsRow}>
                        <Text style={styles.userDetailsLabel}>Phone</Text>
                        <Text style={styles.userDetailsValue}>{user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : 'None'}</Text>
                    </View>
                </View>
                <View style={styles.settingsList}>
                    <SettingsBar
                        title='Categories'
                        subtitle='Modify your list of existing categories'
                        onPress={() => navigation.navigate('CategorySettings')}
                        topBorder />
                    <SettingsBar
                        title='Merchants'
                        subtitle='Modify your list of existing merchants'
                        onPress={() => navigation.navigate('MerchantSettings')}
                        topBorder />
                    <SettingsBar
                        title='Security'
                        subtitle='View or change your password'
                        onPress={() => alert('Security screen is not yet implemented.')}
                        topBorder />
                    <SettingsBar
                        title='Notifications'
                        subtitle='Choose how often you want to recieve notifications'
                        onPress={() => alert('Notifications screen is not yet implemented.')}
                        topBorder />
                    <SettingsBar
                        title='Help'
                        subtitle='Contact our Helpdesk'
                        onPress={() => alert('Help screen is not yet implemented.')}
                        topBorder />
                    <SettingsBar
                        title='Privacy Policy'
                        subtitle='Learn more about this app'
                        onPress={() => alert('Privacy policy screen is not yet implemented.')}
                        topBorder
                        bottomBorder />
                </View>
            </ScrollView>
        );
    }
}

const userDetailsFontSize = 17;
const userDetailsVerticalSpacing = 5;
const userDetailsHorizontalSpacing = 20;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    logoutBtn: {
        color: 'red',
        paddingRight: 30,
        fontWeight: 'bold',
        fontSize: 17,
    },
    userIcon: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    userDetailsContainer: {
        alignItems: 'center',
    },
    userDetailsRow: {
        flexDirection: 'row',
        paddingVertical: userDetailsVerticalSpacing,
    },
    userDetailsLabel: {
        width: 100,
        textAlign: 'right',
        fontSize: userDetailsFontSize,
    },
    userDetailsValue: {
        fontWeight: 'bold',
        width: 250,
        paddingLeft: userDetailsHorizontalSpacing,
        paddingRight: 20,
        fontSize: userDetailsFontSize,
    },
    settingsList: {
        marginTop: 25,
        marginBottom: 20,
    },
});
