import { useIsFocused } from "@react-navigation/native";
import { useEffect, DependencyList } from "react";

/**
 * Call a callback whenever user navigates to the screen containing this hook.
 * Useful to refetch data which may have changed since user was last on the same screen.
 * Eg. `useRefresh(refetch, [passwordHash])`
 * @param onRefresh Callback to call when screen is navigated to.
 * @param deps Same as deps in useEffect. Call callback again whenever a dep changes.
 */
export function useRefresh(onRefresh: () => void, deps?: DependencyList) {
    const screenIsFocused = useIsFocused();

    useEffect(() => {
        if (screenIsFocused) onRefresh();
    }, [screenIsFocused].concat(deps || []));
}
