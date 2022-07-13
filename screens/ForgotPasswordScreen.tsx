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

export default function ForgotPasswordScreen({ navigation }: RootTabScreenProps<'Welcome'>) {
  const route = useRoute();
  // const { name, birthYear } = route.params;
  const name = route.params;
  const contactemail = 'admin@admin.com'

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => { navigation.goBack() }}
      >
        <View style={styles.centeredView}>
          <Ionicons style={styles.close} name='close' size={32} color='gray' onPress={() => navigation.goBack()} />
          <Text style={styles.title}>We apologize for the inconvenience</Text>
          <Svg width="205" height="171" viewBox="0 0 205 171" fill="none">
            <G clip-path="url(#clip0_61_75)">
              <Path d="M26.5205 105.266C34.1031 90.4073 46.8399 78.722 62.4178 72.3325C77.9958 65.943 95.3816 65.2729 111.418 70.4441C127.454 75.6152 141.078 86.2846 149.814 100.515C158.55 114.745 161.82 131.591 159.029 147.995L146.445 145.915C148.731 132.48 146.053 118.682 138.898 107.027C131.743 95.373 120.585 86.6346 107.451 82.3994C94.3171 78.1641 80.0779 78.7129 67.3194 83.946C54.5609 89.1791 44.1292 98.7495 37.919 110.919L26.5205 105.266Z" fill="#292D32" />
              <Circle cx="79" cy="28" r="9" fill="#292D32" />
              <Circle cx="127" cy="28" r="9" fill="#292D32" />
            </G>
            <Defs>
              <ClipPath id="clip0_61_75">
                <Rect width="205" height="171" fill="white" />
              </ClipPath>
            </Defs>
          </Svg>
          <Text style={styles.contactemail}>Please contact <strong>{contactemail}</strong> for assistance with resetting your password.</Text>
        </View>
      </Modal>
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
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
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
  }
});
