/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Feather, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ExpensesScreen from '../screens/ExpensesScreen';
import BudgetScreen from '../screens/Budget/BudgetScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExpenseDetailsScreen from '../screens/ExpenseDetailsScreen';
import CreateCategoryScreen from '../screens/CategoryScreens/CreateCategoryScreen';
import CreateMerchant from '../screens/CreateMerchantScreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import CreateBudgetScreen from '../screens/Budget/CreateBudgetScreen';
import UpdateBudget from '../screens/Budget/UpdateBudgetScreen';

import { View } from '../components/Themed';
import UpdateExpenseScreen from '../screens/UpdateExpenseScreen';
import EditCategoryScreen from '../screens/CategoryScreens/EditCategoryScreen';
import CategorySettingsScreen from '../screens/CategoryScreens/CategorySettingsScreen';

// declare global {
//   namespace ReactNavigation{
//     interface RootParamList {
//       ForgotPasswordModal: { name: string};
//     }
//   }
// }  

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying ForgotPasswords on top of all other content.
 * https://reactnavigation.org/docs/ForgotPassword
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Group screenOptions={{ headerTitle: '', headerShadowVisible: false }}>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ headerShadowVisible: false, headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold' } }}>
        <Stack.Screen name="CreateMerchant" component={CreateMerchant} options={{ title: 'Create Merchant' }} />
        <Stack.Screen name="CreateExpense" component={CreateExpenseScreen} options={{ title: 'Create Expense' }} />
        <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} options={{ title: 'Expense Details' }} />
        <Stack.Screen name="CategorySettings" component={CategorySettingsScreen} options={{ title: 'Category Settings' }} />
        <Stack.Screen name="EditCategory" component={EditCategoryScreen} options={{ title: 'Edit Category' }} />
        <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} options={{ headerTitle: 'Create Category' }} />
        <Stack.Screen name="UpdateExpense" component={UpdateExpenseScreen} options={{ headerTitle: 'Edit Expense' }} />
        <Stack.Screen name="UpdateBudget" component={UpdateBudget} options={{ headerTitle: 'Update Budget' }} />
        <Stack.Screen name="CreateBudget" component={CreateBudgetScreen} options={{ headerTitle: 'Create Budget' }} />
      </Stack.Group>
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ headerShown: false, title: 'Oops!' }} />
      <Stack.Screen name="Root" component={Root} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
        <Stack.Screen name="ForgotPasswordModal" component={ForgotPasswordScreen} options={{ headerShown: false, title: 'Oops!' }} />
      </Stack.Group>
    </Stack.Navigator >
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

function Root() {
  return (
    <Tab.Navigator>
      <Tab.Group screenOptions={{ headerShadowVisible: false, headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold' } }}>
        <Tab.Screen name="Expenses" component={ExpensesScreen} />
        <Tab.Screen name="Budget" component={BudgetScreen} />
        <Tab.Screen name="Reports" component={ReportsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Group>
    </Tab.Navigator>
  );
}


/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
*/
/**
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="SignIn"
        component={SignInScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Sign In',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          // headerRight: () => (
          //   <Pressable
          //     onPress={() => navigation.navigate('')}
          //     style={({ pressed }) => ({
          //       opacity: pressed ? 0.5 : 1,
          //     })}>
          //     <FontAwesome
          //       name="info-circle"
          //       size={25}
          //       color={Colors[colorScheme].text}
          //       style={{ marginRight: 15 }}
          //     />
          //   </Pressable>
          // ),
        })}
      />
      <BottomTab.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
*/

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
/**
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
*/
