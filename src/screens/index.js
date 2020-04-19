import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Header from '@/components/Header'
import Home from './Home'
import Chat from './Chat'

const Stack = createStackNavigator()

function getHeaderTitle({ options, scene }) {
  if (options.headerTitle) {
    return options.headerTitle
  }

  if (options.title) {
    return options.title
  }

  return scene.route.name
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor
            const title = getHeaderTitle({ options, scene })

            return <Header title={title} previous={previous} goBack={navigation.goBack} />
          },
        }}>
        <Stack.Screen name="Home" component={Home} options={{ title: 'All Chats' }} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
