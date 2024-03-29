/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Animated, ColorSchemeName, Keyboard } from 'react-native';
import ForgotPasswordScreen from '../screens/UserAuthScreens/ForgotPasswordScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import SignInScreen from '../screens/UserAuthScreens/SignInScreen';
import SignUpScreen from '../screens/UserAuthScreens/SignUpScreen';
import WelcomeScreen from '../screens/UserAuthScreens/WelcomeScreen';
import { RootStackParamList, RootTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ExpensesScreen from '../screens/ExpensesScreen';
import BudgetScreen from '../screens/Budget/BudgetScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ExpenseDetailsScreen from '../screens/ExpenseDetailsScreen';
import CreateCategoryScreen from '../screens/CategoryScreens/CreateCategoryScreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import CreateBudgetScreen from '../screens/Budget/CreateBudgetScreen';
import UpdateBudgetScreen from '../screens/Budget/UpdateBudgetScreen';

import UpdateExpenseScreen from '../screens/UpdateExpenseScreen';
import EditCategoryScreen from '../screens/CategoryScreens/EditCategoryScreen';
import CategorySettingsScreen from '../screens/CategoryScreens/CategorySettingsScreen';
import UpdateMerchantScreen from '../screens/MerchantScreens/UpdateMerchantScreen';
import CreateMerchant from '../screens/MerchantScreens/CreateMerchantScreen';
import MerchantSettingsScreen from '../screens/MerchantScreens/MerchantSettingsScreen';
import ExpandExpenseScreen from '../screens/ReportScreens/ExpandExpense';
import ExpandBudgetScreen from '../screens/ReportScreens/ExpandBudget';
import ExpandWheelScreen from '../screens/ReportScreens/ExpandWheel';
import ExpandBarCatScreen from '../screens/ReportScreens/ExpandBarCat';

import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import { useState } from 'react';
import { useEffect } from 'react';

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
        <Stack.Screen name="CategorySettings" component={CategorySettingsScreen} options={{ title: 'Categories' }} />
        <Stack.Screen name="EditCategory" component={EditCategoryScreen} options={{ title: 'Edit Category' }} />
        <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} options={{ headerTitle: 'Create Category' }} />
        <Stack.Screen name="UpdateExpense" component={UpdateExpenseScreen} options={{ headerTitle: 'Edit Expense' }} />
        <Stack.Screen name="EditBudget" component={UpdateBudgetScreen} options={{ headerTitle: 'Edit Budget' }} />
        <Stack.Screen name="CreateBudget" component={CreateBudgetScreen} options={{ headerTitle: 'Create Budget' }} />
        <Stack.Screen name="ExpandExpenses" component={ExpandExpenseScreen} options={{ headerTitle: 'Insights' }} />
        <Stack.Screen name="ExpandBudget" component={ExpandBudgetScreen} options={{ headerTitle: 'Insights' }} />
        <Stack.Screen name="ExpandWheel" component={ExpandWheelScreen} options={{ headerTitle: 'Insights' }} />
        <Stack.Screen name="ExpandBarCat" component={ExpandBarCatScreen} options={{ headerTitle: 'Insights' }} />
        <Stack.Screen name="MerchantSettings" component={MerchantSettingsScreen} options={{ headerTitle: 'Merchants' }} />
        <Stack.Screen name="UpdateMerchant" component={UpdateMerchantScreen} options={{ headerTitle: 'Update Merchant' }} />
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
  const focused = useIsFocused();
  const [tabBarVisible, setTabBarVisible] = useState(true);

  useEffect(() => {
    if (focused) {
      Keyboard.addListener('keyboardDidShow', () => {
        setTabBarVisible(false);
      });
      Keyboard.addListener('keyboardDidHide', () => {
        setTabBarVisible(true);
      });
    } else {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    }
    // Having no return value should not cause a memory leak here because react navigation will
    // set focused to false whenever root would have been unmounted. If memory leak occurs, add return
    // function that clears all listeners.
  }, [focused]);

  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Group screenOptions={{

        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { paddingBottom: 25, paddingTop: 5, height: 70, display: tabBarVisible ? 'flex' : 'none' },
        tabBarAllowFontScaling: true,
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.btnBackground,
      }}>
        <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="pricetags" size={24} color={color} />, }} />
        <Tab.Screen name="Budget" component={BudgetScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="wallet" size={24} color={color} /> }} />
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
        <Tab.Screen name="Reports" component={ReportsScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="pie-chart" size={24} color={color} /> }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="settings-sharp" size={24} color={color} /> }} />
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
