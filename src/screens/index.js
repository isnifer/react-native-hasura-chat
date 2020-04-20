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

const icons = {
  'Home.Chats': require('@/assets/img/Home.png'),
  'Home.Profile': require('@/assets/img/Profile.png'),
  'Home.Settings': require('@/assets/img/Settings.png'),
}

const tabBarOptions = {
  activeTintColor: colors.accent,
  showLabel: false,
  tabStyle: { backgroundColor: colors.primary },
}

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused }) => (
    <Image
      source={icons[route.name]}
      style={{ tintColor: focused ? colors.accent : colors.textSecondary }}
    />
  ),
})

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home.Chats"
      screenOptions={screenOptions}
      tabBarOptions={tabBarOptions}>
      <Tab.Screen name="Home.Profile" component={Profile} />
      <Tab.Screen name="Home.Chats" component={Home} />
      <Tab.Screen name="Home.Settings" component={Settings} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        headerMode="screen"
        initialRouteName="Home"
        screenOptions={defaultScreenOptions}>
        <Stack.Screen name="Home" component={HomeTabs} options={{ title: 'All Chats' }} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route: { params } }) => ({
            title: `${params.user.firstName} ${params.user.lastName}`,
          })}
        />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
