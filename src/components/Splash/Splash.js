import React from 'react'
import { Text, ImageBackground, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import colors from '@/constants/colors'

export default function Splash() {
  return (
    <ImageBackground source={require('@/assets/img/splash.jpg')} style={styles.backgroundImage}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.root}>
        <Text style={styles.logo}>Brand New Chat</Text>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    marginTop: 50,
  },
})
