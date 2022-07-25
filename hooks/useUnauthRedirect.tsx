import { useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { GetCategoriesDocument, GetCategoriesQuery } from "../components/generated";
import { useAuth } from "./useAuth";

export function useUnauthRedirect() {
    const nav = useNavigation();
    const passwordHash = useAuth();

    useQuery<GetCategoriesQuery>(GetCategoriesDocument, {
        variables: {
            passwordHash: passwordHash,
        },
        onCompleted: (data) => {
            if (passwordHash && data.categories.__typename === 'FailurePayload' && data.categories.exceptionName === 'NotAuthorizedException') {
                AsyncStorage.setItem('passwordHash', '').then((_) => {
                    nav.navigate('Welcome');
                }).catch((e) => {
                    console.log('Error occurred while trying to clear the invalid locally stored passwordHash.');
                });
            }
        },
    });
}
