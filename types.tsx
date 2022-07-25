/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Moment } from 'moment';

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
  ExpenseDetails: { expenseId: number, refresh: boolean };
  UpdateExpense: { id: number, amount: number, merchant?: { id?: number, name?: string }, category?: { id?: number, name?: string }, date: string, desc?: string } | undefined,
  ForgotPasswordModal: undefined;
  CreateExpense: { refresh: boolean };
  CreateCategory: undefined;
  EditCategory: { id: number, name: string, color: string, details?: string | null };
  CategorySettings: undefined;
  NotFound: undefined;
  CreateMerchant: undefined;
  UpdateMerchant: { id: number, name: string, description?: string | null, category?: { id?: number, name?: string } };
  MerchantSettings: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Expenses?: { refresh?: boolean };
  Budget: undefined;
  Reports: undefined;
  Profile?: { refresh?: boolean };
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
