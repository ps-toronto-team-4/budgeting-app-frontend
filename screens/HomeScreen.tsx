import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';
import Styles from '../constants/Styles';

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
    <View style={Styles.container}>
      <Text style={Styles.title}>You have signed in. This is the home screen!</Text>
    </View>
  );
}

