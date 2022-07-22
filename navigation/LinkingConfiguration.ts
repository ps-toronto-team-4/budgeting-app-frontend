/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Welcome: '',
      SignIn: 'login',
      SignUp: 'register',
      CreateCategory: 'create-category',
      Root: {
        screens: {
          Expenses: 'expenses-list',
          Reports: 'reports',
          Budget: 'budget',
          Profile: 'profile',
        }
      },
      ExpenseDetails: 'expense-details',
      CreateExpense: 'create-expense',
      UpdateExpense: 'update-expense',
      ForgotPasswordModal: 'ForgotPassword',
      NotFound: '*',
      CreateMerchant: 'create-merchant',
      UpdateMerchant: 'update-merchant',
    },
  },
};

export default linking;
