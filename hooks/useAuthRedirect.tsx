import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

/**
 * Redirect to root screen if user is already authenticated.
 * Use on screens that should not be accessible if user is already logged in.
 */
export function useAuthRedirect() {
    const passwordHash = useAuth();
    const nav = useNavigation();

    useEffect(() => {
        if (passwordHash) {
            nav.navigate('Root');
        }
    }, [passwordHash]);
}
