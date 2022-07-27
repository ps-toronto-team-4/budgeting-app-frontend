import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAuth(onRetrieved?: () => void): string {
  const [passwordHash, setPasswordHash] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('passwordHash').then((val) => {
      onRetrieved && onRetrieved();
      setPasswordHash(val || '');
    }).catch((e) => {
      console.log('Error retrieving passwordHash from AsyncStorage: ' + e);
    });
  }, []);

  return passwordHash;
}
