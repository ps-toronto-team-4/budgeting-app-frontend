import { useState } from "react"
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from "../../components/buttons/Button";
import TextInput from "../../components/forms/TextInput";
import Colors from '../../constants/Colors';
import { Text, View } from '../../components/Themed';
import { RootStackScreenProps } from "../../types";
import { useLazyQuery } from '@apollo/client';
import { LoginDocument, LoginQuery, LoginQueryVariables } from "../../components/generated";
import Styles from "../../constants/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";
import { Form } from "../../components/forms/Form";

export default function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernamePayload, setUsernamePayload] = useState('');
    const [passwordPayload, setPasswordPayload] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useAuth({ redirect: 'ifAuthorized' });

    const setData = async () => {
        try {
            await AsyncStorage.setItem('passwordHash', data?.signIn.__typename == 'SignInSuccess' ? data.signIn.passwordHash : '');
            navigation.navigate('Root');
        } catch (error) {
            if (data?.signIn.__typename == 'FailurePayload') {
                alert(data.signIn.errorMessage);
            } else {
                alert('An error occured while writing to local storage.');
            }
        }
    };
    const [triggerLogin, { loading, error, data }] = useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, {
        variables: { username: usernamePayload, password: passwordPayload },
        onCompleted: (data) => {
            if (data?.signIn.__typename === 'SignInSuccess') {
                setData();
            }
        },
        onError: (data) => {
            // console.log(data);
        }
    });

    const handleLogin = () => {
        setUsernamePayload(username);
        setPasswordPayload(password);
        triggerLogin();
    }

    return (
        <Form>
            <View style={styles.screen}>
                <Text style={styles.title}>Sign into your account</Text>
                {!loading ? (
                    data?.signIn.__typename === 'SignInSuccess' ? (
                        <Text>Sign in successful</Text>
                    ) : (
                        <Text style={[Styles.alert, { paddingTop: 20 }]}>{data?.signIn.__typename === 'FailurePayload' && 'Invalid credentials.'}</Text>
                    )) : (
                    <ActivityIndicator size="large" />
                )}
                <View style={styles.textfields}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={(username) => setUsername(username)}
                        value={username}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={(password) => setPassword(password)}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordModal')} style={styles.helpLink}>
                    <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <Button text="Sign In" onPress={() => handleLogin()} accessibilityLabel={"Sign In Button"} />
                </View>
            </View>
        </Form>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    title: {
        marginTop: 25,
        fontSize: 36,
        fontWeight: 'bold',
        width: 250,
        textAlign: 'center',
    },
    input: {
        margin: 12,
    },
    textfields: {
        marginBottom: 0,
    },
    buttonContainer: {
        marginTop: 80,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
    helpContainer: {
        marginTop: 5,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        textAlign: 'center',
    },
});
