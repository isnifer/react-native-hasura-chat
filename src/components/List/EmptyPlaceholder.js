import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

export default function EmptyPlaceholder({ navigation }) {
  function handleOpenSearch() {
    navigation.navigate('Search')
  }

  return (
    <View style={styles.container}>
      <Image source={require('./img/no_chats.png')} />
      <Text style={styles.title}>No Conversation</Text>
      <Text style={styles.subtitle}>
        You didn{"'"}t make any conversation yet,{'\n'}please select a username
      </Text>
      <TouchableOpacity onPress={handleOpenSearch}>
        <Text style={styles.openSearch}>Chat People</Text>
      </TouchableOpacity>
    </View>
  )
}

EmptyPlaceholder.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 25,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
