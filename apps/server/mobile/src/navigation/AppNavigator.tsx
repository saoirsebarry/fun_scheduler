import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import OnboardingBioScreen from '../screens/OnboardingBioScreen';
import DiaryScreen from '../screens/DiaryScreen';
import FriendListScreen from '../screens/FriendListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. The Main App (Tabs)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Diary') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Diary" component={DiaryScreen} options={{ title: 'Lively Diary' }} />
      <Tab.Screen name="Friends" component={FriendListScreen} options={{ title: 'My Circle' }} />
    </Tab.Navigator>
  );
}

// 2. The Root Navigator
export default function AppNavigator() {
  // In a real app, you'd check if the user has completed onboarding here
  const hasCompletedOnboarding = false; 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          // Onboarding Flow
          <Stack.Screen name="Onboarding" component={OnboardingBioScreen} />
        ) : null}
        
        {/* Main App Flow */}
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}