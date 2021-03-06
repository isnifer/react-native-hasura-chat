import React, { Fragment, useEffect, useRef } from 'react'
import { View, Text, Image, StatusBar, Constants, Platform, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { UNAUTH_REASONS } from '@/constants'
import colors from '@/constants/colors'
import defaultScreenOptions from '@/constants/defaultScreenOptions'
import useAuthToken from '@/hooks/useAuthToken'
import useAuth from '@/hooks/useAuth'
import arrayToString from '@/utils/arrayToString'
import Toast from '@/components/Toast'
import Splash from '@/components/Splash'

// Screens
import Login from './Login'
import VerificationCode from './VerificationCode'
import FillProfile from './FillProfile'

import Chats from './Chats'
import Chat from './Chat'

import Groups from './Groups'
import GroupChat from './GroupChat'
import GroupCreate from './GroupCreate'
import GroupCreateName from './GroupCreate/GroupCreateName'
import HeaderGroupCreate from './GroupCreate/HeaderGroupCreate'

import Calls from './Calls'
import Call from './Call'
import CallCreate from './CallCreate'

import Search from './Search'
import Profile from './Profile'

import Settings from './Settings'
import SettingsChatCustomize from './SettingsChatCustomize'

const STATUS_BAR_HEIGHT = Platform.OS === 'Android' ? Constants.currentHeight : 20

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const TopTab = createMaterialTopTabNavigator()

const TOP_TABS = [
  { name: 'Chats', component: Chats },
  { name: 'Groups', component: Groups },
  { name: 'Calls', component: Calls },
]

const topTabBarOptions = {
  pressOpacity: 1,
  showIcon: true,
  renderIndicator: () => null,
  activeTintColor: colors.text,
  tabStyle: { backgroundColor: colors.primary },
}

const renderTab = ({ name, component }) => (
  <TopTab.Screen
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

const ChatsTabs = () => (
  <TopTab.Navigator lazy tabBarOptions={topTabBarOptions}>
    {TOP_TABS.map(renderTab)}
  </TopTab.Navigator>
)

function Home() {
  return (
    <Stack.Navigator initialRouteName="Chats" headerMode="none">
      <Stack.Screen name="Chats" component={ChatsTabs} />
    </Stack.Navigator>
  )
}

const tabBarIcons = {
  'Home.Chats': require('@/assets/img/Home.png'),
  'Home.Profile': require('@/assets/img/Profile.png'),
  'Home.Settings': require('@/assets/img/Settings.png'),
}

const tabBarOptions = {
  activeTintColor: colors.accent,
  showLabel: false,
  tabStyle: { backgroundColor: colors.primary },
}

const tabBarScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused }) => (
    <Image
      source={tabBarIcons[route.name]}
      style={{ tintColor: focused ? colors.accent : colors.textSecondary }}
    />
  ),
})

const HomeSettings = () => (
  <Stack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Settings.ChatCustomize" component={SettingsChatCustomize} />
  </Stack.Navigator>
)

const HomeScreen = () => (
  <Tab.Navigator
    initialRouteName="Home.Chats"
    screenOptions={tabBarScreenOptions}
    tabBarOptions={tabBarOptions}>
    <Tab.Screen name="Home.Profile" component={Profile} />
    <Tab.Screen name="Home.Chats" component={Home} />
    <Tab.Screen name="Home.Settings" component={HomeSettings} />
  </Tab.Navigator>
)

export default function Screens({ wsClient }) {
  const { initializing, unauthReason, setUnauthReason } = useAuthToken(wsClient)
  const { getVerificationCode, confirmVerificationCode } = useAuth({ setUnauthReason })

  const toastRef = useRef()

  useEffect(() => {
    if (
      // Check element
      toastRef.current &&
      // Check element show method
      toastRef.current.show &&
      // Check reason
      unauthReason &&
      // Exclude one reason from notifications
      unauthReason !== UNAUTH_REASONS.VERIFICATION_CODE
    ) {
      toastRef.current.show(unauthReason, 3000)
    }
  }, [unauthReason])

  if (initializing) {
    return <Splash />
  }

  let UnauthScreen
  switch (unauthReason) {
    case UNAUTH_REASONS.FILL_PROFILE: {
      UnauthScreen = (
        <Stack.Screen
          name="FillProfile"
          component={FillProfile}
          initialParams={{ setUnauthReason }}
        />
      )
      break
    }

    case UNAUTH_REASONS.INVALID_VERIFICATION_CODE:
    case UNAUTH_REASONS.VERIFICATION_CODE: {
      UnauthScreen = (
        <Stack.Screen
          name="VerificationCode"
          component={VerificationCode}
          initialParams={{ confirmVerificationCode }}
        />
      )
      break
    }

    case UNAUTH_REASONS.LOGIN:
    case UNAUTH_REASONS.LOGGED_OUT: {
      UnauthScreen = (
        <Stack.Screen name="Login" component={Login} initialParams={{ getVerificationCode }} />
      )
      break
    }

    default: {
      UnauthScreen = null
    }
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Toast
        ref={toastRef}
        position="top"
        fadeInDuration={1000}
        positionValue={STATUS_BAR_HEIGHT}
        style={styles.toast}
      />
      <Stack.Navigator
        headerMode="screen"
        initialRouteName="Home"
        screenOptions={unauthReason ? { headerShown: false } : defaultScreenOptions}>
        {unauthReason ? (
          UnauthScreen
        ) : (
          <Fragment>
            <Stack.Screen name="Home" options={{ title: 'All Chats' }} component={HomeScreen} />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={({ route: { params } }) => ({
                title: arrayToString([params.opponent.firstName, params.opponent.lastName], ' '),
              })}
            />
            <Stack.Screen
              name="GroupChat"
              component={GroupChat}
              options={({ route: { params } }) => ({ title: `${params.group.name}` })}
            />
            <Stack.Screen
              name="Call"
              component={Call}
              options={({ route: { params } }) => ({ title: params.name })}
            />
            <Stack.Screen name="CallCreate" component={CallCreate} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen
              name="GroupCreate"
              component={GroupCreate}
              options={{
                header: ({ navigation, scene }) => (
                  <HeaderGroupCreate scene={scene} navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="GroupCreateName"
              component={GroupCreateName}
              options={{
                header: ({ scene, navigation }) => (
                  <HeaderGroupCreate scene={scene} navigation={navigation} />
                ),
              }}
            />
          </Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
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
  toast: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 0,
  },
})
