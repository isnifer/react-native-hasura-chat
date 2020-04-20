import React from 'react'
import { Image, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import colors from '@/constants/colors'
import defaultScreenOptions from '@/constants/defaultScreenOptions'
import Home from './Home'
import Chat from './Chat'
import Profile from './Profile'
import Settings from './Settings'
import Search from './Search'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator initialRouteName="All Chats" screenOptions={defaultScreenOptions}>
        <Stack.Screen name="All Chats">
          {() => (
            <Tab.Navigator
              initialRouteName="All Chats"
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                  const icons = {
                    'All Chats': require('@/assets/img/Home.png'),
                    Profile: require('@/assets/img/Profile.png'),
                    Settings: require('@/assets/img/Settings.png'),
                  }

                  return (
                    <Image
                      source={icons[route.name]}
                      style={{ tintColor: focused ? colors.accent : colors.textSecondary }}
                    />
                  )
                },
              })}
              tabBarOptions={{
                activeTintColor: colors.accent,
                showLabel: false,
                tabStyle: { backgroundColor: colors.primary },
              }}>
              <Tab.Screen name="Profile" component={Profile} />
              <Tab.Screen name="All Chats" component={Home} />
              <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => {
            const { firstName, lastName } = route.params.user

            return { title: `${firstName} ${lastName}` }
          }}
        />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
