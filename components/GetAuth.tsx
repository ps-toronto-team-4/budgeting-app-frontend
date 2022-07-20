import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";


export const getAuth = async (callbackfn: Function) => {
    const navigation = useNavigation();
    try {
      const value = await AsyncStorage.getItem('passwordHash');
      if (value) {
        callbackfn(value);
      } else {
        Alert.alert("You must sign in first");
        navigation.navigate("Welcome");
      }
    } catch(e) {
      Alert.alert("Something went wrong")
    }
};