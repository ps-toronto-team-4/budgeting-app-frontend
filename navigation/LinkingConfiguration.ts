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
                    Settings: 'settings',
                }
            },
            CategorySettings: 'category-settings',
            MerchantSettings: 'merchant-settings',
            CreateCategory: 'create-category',
            EditCategory: 'update-category',
            ExpenseDetails: 'expense-details',
            CreateExpense: 'create-expense',
            UpdateExpense: 'update-expense',
            ForgotPasswordModal: 'forgot-password',
            NotFound: '*',
            CreateMerchant: 'create-merchant',
            CreateBudget: 'create-budget',
            EditBudget: 'update-budget',
            UpdateMerchant: 'update-merchant',
        },
    },
};

export default linking;
