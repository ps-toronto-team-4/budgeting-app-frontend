import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';
import Styles from '../constants/Styles';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import Graphql from '../components/Graphql';
import { useRoute } from '@react-navigation/native';
import { Svg, G, Circle, Rect, Path, ClipPath, Defs } from 'react-native-svg';
import { RootTabScreenProps } from '../types';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {

  const [passwordHash, setpasswordHash] = React.useState("");

  useEffect(() => {
    getData();
  }, []);


  const storeData = async () => {
    try{
      await AsyncStorage 
    } catch (e){

    }
  }

  const getData = async() => {
    try{
      const value = await AsyncStorage.getItem('passwordHash')
      if(value != null){
        setpasswordHash(value);
      }
    } catch(e){
      setpasswordHash('undefined');
    }
  }

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>You have signed in. This is the home screen!</Text>
      <Text style={Styles.title}>{passwordHash}</Text>
    </View>
  );
}

