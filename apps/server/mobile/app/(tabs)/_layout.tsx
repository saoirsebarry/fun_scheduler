import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Using your updated color palette
const COLORS = {
  Wellness: '#0EA5E9',  // Sky Blue
  Adventure: '#F59E0B', // Sunset Orange
  Social: '#EC4899',    // Hot Pink
  Agent: '#1E293B',     // Midnight Blue
};

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: COLORS.Wellness, // Active tab matches the "Life" blue
      tabBarInactiveTintColor: '#94A3B8',
      tabBarStyle: { 
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        height: 60,
        paddingBottom: 8
      },
      headerShown: false, // We usually handle headers inside the screens for custom UI
    }}>
      <Tabs.Screen
        name="index" // This will now point to your Profile code
        options={{
          title: 'Vibe',
          tabBarIcon: ({ color }) => <Ionicons name="sparkles" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="diary" // This will now point to your Schedule/Diary code
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}