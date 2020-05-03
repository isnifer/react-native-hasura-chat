import React, { useState } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import colors from '@/constants/colors'

export default function ChatCustomize() {
  const [typingVibration, setTypingVibration] = useState(true)
  const [inAppSounds, setInAppSounds] = useState(false)
  const [showChatHead, setShowChatHead] = useState(true)
  const [showMessagePreview, setShowMessagePreview] = useState(true)

  return (
    <View style={styles.container}>
      <View style={styles.panelSettings}>
        <View style={styles.item}>
          <View>
            <Text style={styles.title}>Typing Vibration</Text>
            <Text style={styles.description}>Vibrate when you type keyboard</Text>
          </View>
          <Switch
            value={typingVibration}
            onValueChange={setTypingVibration}
            ios_backgroundColor={colors.inputSearch}
            trackColor={{ true: colors.accent }}
          />
        </View>
        <View style={styles.item}>
          <View>
            <Text style={styles.title}>In App Sounds</Text>
            <Text style={styles.description}>Notification sound enables</Text>
          </View>
          <Switch
            value={inAppSounds}
            onValueChange={setInAppSounds}
            ios_backgroundColor={colors.inputSearch}
            trackColor={{ true: colors.accent }}
          />
        </View>
        <View style={styles.item}>
          <View>
            <Text style={styles.title}>Show chat head</Text>
            <Text style={styles.description}>Chat head will preview</Text>
          </View>
          <Switch
            value={showChatHead}
            onValueChange={setShowChatHead}
            ios_backgroundColor={colors.inputSearch}
            trackColor={{ true: colors.accent }}
          />
        </View>
        <View style={styles.item}>
          <View>
            <Text style={styles.title}>Show message preview</Text>
            <Text style={styles.description}>There will showing message</Text>
          </View>
          <Switch
            value={showMessagePreview}
            onValueChange={setShowMessagePreview}
            ios_backgroundColor={colors.inputSearch}
            trackColor={{ true: colors.accent }}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  panelSettings: {
    flex: 1,
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.primary,
  },
  item: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.4,
    borderBottomColor: 'hsla(0, 100%, 100%, 0.1)',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 3,
  },
})
