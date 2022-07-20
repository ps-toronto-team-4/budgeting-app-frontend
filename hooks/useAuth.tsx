import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

export interface AuthResult {
  loading: boolean;
  passwordHash?: String | null;
}

export function useAuth() {
  const navigation = useNavigation();
    const Auth: AuthResult = {loading: true};
    try {
      AsyncStorage.getItem('passwordHash').then((value) => {
        Auth.passwordHash = value;
        Auth.loading = false;
        if (!Auth.passwordHash) {
          Alert.alert("You must sign in first");
          navigation.navigate("Welcome");
        }
      })
    } catch(e) {
      Auth.loading = false;
      console.log("couldn't get hash from async storage");
      Alert.alert("Something went wrong");
    }
    return Auth;
};
