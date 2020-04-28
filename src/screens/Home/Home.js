import React from 'react'
import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import colors from '@/constants/colors'
import Chats from './Chats'
import Groups from './Groups'
import Calls from './Calls'

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

const TOP_TABS = [
  { name: 'Chats', component: Chats },
  { name: 'Groups', component: Groups },
  { name: 'Calls', component: Calls },
]

const tabBarOptions = {
  pressOpacity: 1,
  showIcon: true,
  renderIndicator: () => null,
  activeTintColor: colors.text,
  tabStyle: { backgroundColor: colors.primary },
}

const renderTab = ({ name, component }) => (
  <Tab.Screen
    key={name}
    name={name}
    component={component}
    options={{
      tabBarLabel: ({ focused }) => (
        <View style={styles.tabBarLabel}>
          <Text style={[styles.label, focused && styles.labelActive]}>{name}</Text>
          {focused && <View style={styles.status} />}
        </View>
      ),
    }}
  />
)

function HomeTabs() {
  return <Tab.Navigator tabBarOptions={tabBarOptions}>{TOP_TABS.map(renderTab)}</Tab.Navigator>
}

export default function Home() {
  return (
    <SafeAreaView style={styles.root}>
      <Stack.Navigator initialRouteName="Chats" headerMode="none">
        <Stack.Screen name="Chats" component={HomeTabs} />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tabBarLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.text,
  },
  status: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginLeft: 5,
  },
})
