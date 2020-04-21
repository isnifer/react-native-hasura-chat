import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SettingsHome from './SettingsHome'
import ChatCustomize from './ChatCustomize'

const Stack = createStackNavigator()

export default function Settings() {
  return (
    <Stack.Navigator initialRouteName="Settings.Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings.Home" component={SettingsHome} />
      <Stack.Screen name="Settings.ChatCustomize" component={ChatCustomize} />
    </Stack.Navigator>
  )
}
