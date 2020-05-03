import React, { useState } from 'react'
import { View, Text, Image, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native'
import colors from '@/constants/colors'
import useAuth from '@/hooks/useAuth'

export default function Settings({ navigation, route }) {
  const [searchValue, setSearchValue] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [profileLock, setProfileLock] = useState(true)
  const { logout } = useAuth(route.params)

  return (
    <View style={styles.container}>
      <View style={styles.panelSearch}>
        <Image source={require('@/components/Header/img/search.png')} style={styles.iconSearch} />
        <TextInput
          value={searchValue}
          numberOfLines={10}
          blurOnSubmit={false}
          enablesReturnKeyAutomatically
          clearButtonMode="while-editing"
          placeholder="Search Settings"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="send"
          returnKeyLabel="send"
          onChangeText={setSearchValue}
          style={styles.inputSearch}
        />
      </View>
      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <View style={styles.menuItemName}>
            <Image source={require('./img/icon_dark_mode.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemTitle}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            ios_backgroundColor={colors.inputSearch}
            trackColor={{ true: colors.accent }}
          />
        </View>
        <View style={styles.menuItem}>
          <View style={styles.menuItemName}>
            <Image source={require('./img/icon_profile_lock.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemTitle}>Profile Lock</Text>
          </View>
          <Switch
            value={profileLock}
            onValueChange={setProfileLock}
            ios_backgroundColor={colors.inputSearch}
            trackColor={{ true: colors.accent }}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings.ChatCustomize')}
          style={styles.menuItem}>
          <View style={styles.menuItemName}>
            <Image source={require('./img/icon_chat_customize.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemTitle}>Chat Customize</Text>
          </View>
          <Image
            source={require('./img/icon_chevron_right.png')}
            style={styles.menuItemIconChevron}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.menuItem}>
          <View style={styles.menuItemName}>
            <Image source={require('./img/icon_notifications.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemTitle}>Notifications</Text>
          </View>
          <Image
            source={require('./img/icon_chevron_right.png')}
            style={styles.menuItemIconChevron}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.menuItem}>
          <View style={styles.menuItemName}>
            <Image source={require('./img/icon_privacy.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemTitle}>Privacy</Text>
          </View>
          <Image
            source={require('./img/icon_chevron_right.png')}
            style={styles.menuItemIconChevron}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity onPress={logout} style={styles.menuItem}>
          <View style={styles.menuItemName}>
            <Image source={require('./img/icon_logout.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemTitle}>Logout</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.menuItem}>
          <View style={styles.menuItemName}>
            <Image source={require('./img/icon_delete_account.png')} style={styles.menuItemIcon} />
            <Text style={[styles.menuItemTitle, styles.menuItemTitleDanger]}>Delete Account</Text>
          </View>
          <Image
            source={require('./img/icon_chevron_right.png')}
            style={styles.menuItemIconChevron}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.backgroundColor,
  },
  panelSearch: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'relative',
  },
  inputSearch: {
    height: 35,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.inputSearch,
    paddingRight: 20,
    paddingLeft: 45,
    borderRadius: 30,
  },
  iconSearch: {
    position: 'absolute',
    width: 15,
    height: 15,
    top: 20,
    left: 38,
  },
  menu: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    margin: 15,
    marginBottom: 0,
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuItemName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {},
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 10,
  },
  menuItemTitleDanger: {
    color: colors.danger,
  },
  menuItemIconChevron: {
    marginRight: 10,
  },
})
