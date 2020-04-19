import React from 'react'
import { View, SafeAreaView, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import colors from '@/constants/colors'

export default function Home({ navigation }) {
  function handleOpenSearch() {
    navigation.navigate('Search')
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.noChats}>
        <Image source={require('./img/no_chats.png')} />
        <Text style={styles.title}>No Conversation</Text>
        <Text style={styles.subtitle}>
          You didn{"'"}t make any conversation yet,{'\n'}please select a username
        </Text>
        <TouchableOpacity onPress={handleOpenSearch}>
          <Text style={styles.openSearch}>Chat People</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  noChats: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'hsla(0, 100%, 100%, 1)',
    textAlign: 'center',
    marginTop: 25,
  },
  subtitle: {
    fontSize: 16,
    color: 'hsla(0, 100%, 100%, 0.7)',
    textAlign: 'center',
    marginTop: 15,
  },
  openSearch: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.link,
    marginTop: 15,
  },
})
