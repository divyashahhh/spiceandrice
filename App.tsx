import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import CreateScreen from './src/screens/CreateScreen';
import InboxScreen from './src/screens/InboxScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { CreditsProvider } from './src/context/CreditsContext';

const TikTokTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000',
    card: '#000',
    text: '#fff',
    border: 'rgba(255,255,255,0.08)'
  }
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CreditsProvider>
          <NavigationContainer theme={TikTokTheme}>
            <StatusBar style="light" />
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: '#000',
                  borderTopColor: 'rgba(255,255,255,0.08)',
                  height: Platform.OS === 'ios' ? 86 : 64,
                  paddingBottom: Platform.OS === 'ios' ? 24 : 10,
                  paddingTop: 8
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)'
              }}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />
                  )
                }}
              />
              <Tab.Screen
                name="Shop"
                component={ShopScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="pricetag" size={size} color={color} />
                  )
                }}
              />
              <Tab.Screen
                name="Create"
                component={CreateScreen}
                options={{
                  tabBarLabel: '',
                  tabBarIcon: () => (
                    <LinearGradient
                      colors={[ '#28D7F6', '#F62A54' ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.plusContainer}
                    >
                      <MaterialCommunityIcons name="plus" size={24} color="#000" />
                    </LinearGradient>
                  )
                }}
              />
              <Tab.Screen
                name="Inbox"
                component={InboxScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="chatbubble-ellipses" size={size} color={color} />
                  )
                }}
              />
              <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color} />
                  )
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </CreditsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  plusContainer: {
    width: 48,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }
});


