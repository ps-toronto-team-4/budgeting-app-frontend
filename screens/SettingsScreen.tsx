import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableHighlight, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RootTabScreenProps } from "../types";
import Button from "../components/buttons/Button";
import { useAuth } from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Styles from '../constants/Styles';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GetUserDocument, GetUserQuery, GetUserQueryVariables } from '../components/generated';
import { useRefresh } from '../hooks/useRefresh';
import { SettingsBar } from '../components/profile/SettingsBar';
import { UserDetail } from '../components/profile/UserDetail';

function formatPhoneNumber(phoneNumber: string): string {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
}

export default function SettingsScreen({ navigation }: RootTabScreenProps<'Settings'>) {
    const [getUser, { data, refetch }] = useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument);
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => getUser({ variables: { passwordHash } }),
        redirect: 'ifUnauthorized',
    });
    useRefresh(() => refetch({ passwordHash }));

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
        return <View style={styles.screen}></View>;
    } else if (data?.user.__typename !== 'User') {
        return <View style={styles.screen}><Text>Error fetching user data.</Text></View>;
    } else {
        const user = data.user;

        return (
            <ScrollView style={styles.screen}>
                <FontAwesome5 name="user-circle" size={80} color="black" style={styles.userIcon} />
                <View style={styles.userDetailsContainer}>
                    <UserDetail label="First name" value={user.firstName} />
                    <UserDetail label="Last name" value={user.lastName} />
                    <UserDetail label="Username" value={user.username} />
                    <UserDetail label="Email" value={user.email} />
                    <UserDetail label="Phone" value={user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : 'None'} />
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
    settingsList: {
        marginTop: 25,
        marginBottom: 20,
    },
});
