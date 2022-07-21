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
import BudgetScreen from '../screens/BudgetScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExpenseDetailsScreen from '../screens/ExpenseDetailsScreen';
import CreateCategoryScreen from '../screens/CategoryScreens/CreateCategoryScreen';
import CreateMerchant from '../screens/CreateMerchantScreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';

import { View } from '../components/Themed';
import UpdateExpenseScreen from '../screens/UpdateExpenseScreen';
import EditCategoryScreen from '../screens/CategoryScreens/EditCategoryScreen';

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
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerTitle: '', headerShadowVisible: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerTitle: '', headerShadowVisible: false }} />
      <Stack.Screen name="CreateMerchant" component={CreateMerchant} options={{ headerTitle: 'Create Merchant', headerTransparent: true, headerTitleAlign: 'center', }} />
      <Stack.Screen name="CreateExpense" component={CreateExpenseScreen} options={{ headerTitle: '', headerShadowVisible: false }} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} options={{
        title: 'Expense Details',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "bold" },
      }} />
      <Stack.Screen name="EditCategory" component={EditCategoryScreen} options={{
        headerTitle: 'Edit Category',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: 'bold' }
      }} />
      <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} options={{
        headerTitle: 'Create New Category',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: 'bold' },
      }} />
      <Stack.Screen name="UpdateExpense" component={UpdateExpenseScreen} options={{ headerTitle: '', headerShadowVisible: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ headerShown: false, title: 'Oops!' }} />
      <Stack.Screen name="Root" component={Root} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="ForgotPasswordModal" component={ForgotPasswordScreen} options={{ headerShown: false, title: 'Oops!' }} />
      </Stack.Group>
    </Stack.Navigator >
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

function Root() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Budget" component={BudgetScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}></Tab.Screen>
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
