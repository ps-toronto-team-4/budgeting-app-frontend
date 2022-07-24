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
      Root: {
        screens: {
          Expenses: 'expenses-list',
          Reports: 'reports',
          Budget: 'budget',
        }
      },
      ExpenseDetails: 'expense-details',
      CreateExpense: 'create-expense',
      ForgotPasswordModal: 'ForgotPassword',
      NotFound: '*',
      CreateMerchant: 'create-merchant',
      CreateBudget: 'create-budget',
      UpdateBudget: 'update-budget',
    },
  },
};

export default linking;
