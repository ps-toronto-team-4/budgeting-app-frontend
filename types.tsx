/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ExpenseDetails: undefined;
  ForgotPasswordModal: undefined;
  ViewExpenses: undefined;
  NotFound: undefined;
  Home: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
<<<<<<< HEAD
  Expenses: undefined;
  Budget: undefined;
  Reports: undefined;
  Profile: undefined;
=======
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
>>>>>>> fa9e8f62b678810b345665130ab06f570d43272f
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
