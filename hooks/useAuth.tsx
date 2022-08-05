import { useLazyQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables } from "../components/generated";

export interface UseAuthArgs {
    /**
     * Callback which is called when passwordHash has been retrieved from
     * local AsyncStorage.
     */
    onRetrieved?: (passwordHash: string) => void;

    /**
     * Perform a redirect. `ifAuthorized` will redirect to Root screen if user is
     * already logged in. `ifUnauthorized` will redirect to Welcome screen if user
     * is not logged in or local passwordHash is invalid.
     */
    redirect?: 'ifAuthorized' | 'ifUnauthorized';
}

/**
 * Use this hook when you need the locally stored password hash.
 */
export function useAuth(args?: UseAuthArgs): string {
    const [passwordHash, setPasswordHash] = useState('');
    const nav = useNavigation();
    const [validatePasswordHash] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {
        onCompleted: (response) => {
            if (response.categories.__typename === 'FailurePayload' && response.categories.exceptionName === 'NotAuthorizedException') {
                // Clear the invalid locally stored passwordHash.
                AsyncStorage.setItem('passwordHash', '').then(() => {
                    nav.navigate('Welcome');
                }).catch((e) => {
                    console.log('Error occurred while trying to clear the invalid locally stored passwordHash.');
                });
            }
        }
    });

    useEffect(() => {
        AsyncStorage.getItem('passwordHash').then((val) => {
            args?.onRetrieved && args.onRetrieved(val || '');
            if (args?.redirect) {
                switch (args.redirect) {
                    case 'ifAuthorized':
                        if (val) nav.navigate('Root')
                        break;

                    case 'ifUnauthorized':
                        if (!val) {
                            nav.navigate('Welcome');
                        } else {
                            validatePasswordHash({ variables: { passwordHash: val } });
                        }
                        break;
                }
            }
            setPasswordHash(val || '');
        }).catch((e) => {
            console.log('Error retrieving passwordHash from AsyncStorage: ' + e);
        });
    }, []);

    return passwordHash;
}
