import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Chat from './Chat'
import Chats from './Chats'
import Groups from './Groups'
import Calls from './Calls'

const Stack = createStackNavigator()

export default function Home() {
  return (
    <SafeAreaView style={styles.root}>
      <Stack.Navigator initialRouteName="Chats" headerMode="none">
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="Groups" component={Groups} />
        <Stack.Screen name="Calls" component={Calls} />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
