import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import Graphql from '../components/Graphql';
import { useRoute } from '@react-navigation/native';
import { Svg, G, Circle, Rect, Path, ClipPath, Defs } from 'react-native-svg';
import { RootTabScreenProps } from '../types';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You have signed in. This is the home screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    width: '80%'
  },
  contactemail: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    width: '80%',
  },
  close: {
    display: "flex",
    alignSelf: 'flex-start',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: "center",
    marginVertical: '20%',
    marginHorizontal: '10%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingBottom: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  }
});
