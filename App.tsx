import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { app, authentication, firestore_db } from './firebaseConfig';
import AdvancedUserScreen from './src/screens/AdvancedUser';
import LoginScreen from './src/screens/Login';
import SignupScreen from './src/screens/Signup';
import ProfileScreen from './src/screens/UserProfile';
import UserTypeSelectionScreen from './src/screens/UserTypeSelection';
import MedicalHistoryScreen from './src/screens/MedicalHistory';
import ParameterDetailsScreen from './src/screens/Details';
import SettingsScreen from './src/screens/Settings';
import InsightsScreen from './src/screens/Insights';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

export type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  ProfileScreen: undefined;
  AdvancedUserScreen: undefined;
  UserTypeSelectionScreen: { user: User };
  MedicalHistoryStack: undefined;
  ParameterDetailsScreen: undefined;
  SettingsScreen: undefined;
  Tabs: undefined;
  MedicalHistoryScreen: undefined;
  InsightsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MedicalHistoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MedicalHistoryScreen"
      component={MedicalHistoryScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ParameterDetailsScreen"
      component={ParameterDetailsScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const InsightsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
    name="ProfileScreen"
    component={ProfileScreen}
    options={{ headerShown: false }}
    />
    <Stack.Screen
      name="InsightsScreen"
      component={InsightsScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>

);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'MedicalHistoryStack') {
          iconName = 'document-outline';
        } else if (route.name === 'ProfileScreen') {
          iconName = 'person-outline';
        } else if (route.name === 'SettingsScreen') {
          iconName = 'settings-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#C83030',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#F8F3F3' },
    })}
  >
    <Tab.Screen
      name="ProfileScreen"
      component={InsightsStack}
      options={{
        title: 'Profile',
        headerStyle: {
          backgroundColor: '#F8F3F3',
        },
        headerTintColor: '#B83D37',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 27,
        },
      }}
    />
    <Tab.Screen
      name="MedicalHistoryStack"
      component={MedicalHistoryStack}
      options={{
        title: 'History',
        headerStyle: {
          backgroundColor: '#F8F3F3',
        },
        headerTintColor: '#B83D37',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 27,
        },
      }}
    />
    <Tab.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{
        title: 'Settings',
        headerStyle: {
          backgroundColor: '#F8F3F3',
        },
        headerTintColor: '#B83D37',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 27,
        },
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, async (currentUser) => {
      if (currentUser) {
        console.log("User is signed in:", currentUser);
        setUser(currentUser);
        const userDoc = await getDoc(doc(firestore_db, 'MedicalFiles', currentUser.uid));
        if (userDoc.exists() && userDoc.data().hasSelectedUserType) {
          console.log("User has selected user type. Setting initial route to Tabs.");
          setInitialRoute('Tabs');
        } else {
          console.log("User has not selected user type. Setting initial route to UserTypeSelectionScreen.");
          setInitialRoute('UserTypeSelectionScreen');
        }
      } else {
        console.log("No user is signed in. Setting initial route to LoginScreen.");
        setUser(null);
        setInitialRoute('LoginScreen');
      }
    });
    return unsubscribe;
  }, []);
  

  if (initialRoute === null) {
    // Optionally, you can add a loading screen here while determining the initial route
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignupScreen">
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="UserTypeSelectionScreen" component={UserTypeSelectionScreen} options={{headerShown : false}}/>
            <Stack.Screen name="AdvancedUserScreen" component={AdvancedUserScreen} options={{headerShown : false}}/>
            {/* <Stack.Screen name="BasicUserScreen" component={BasicUserScreen} /> */}

          </>
        ) : (
          <>
            <Stack.Screen name="SignupScreen" component={SignupScreen} options={{headerShown : false}} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown : false}}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
