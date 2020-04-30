import React, { useState } from 'react'
import { View, Text, TextInput, SafeAreaView, StyleSheet } from 'react-native'
import colors from '@/constants/colors'

export default function GroupCreateName({ navigation }) {
  const [picture, setPicture] = useState('')
  const [name, setName] = useState('')

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.panelSearch}>
        <TextInput
          value={picture}
          numberOfLines={1}
          blurOnSubmit={false}
          enablesReturnKeyAutomatically
          clearButtonMode="while-editing"
          placeholder="Group Picture"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="next"
          returnKeyLabel="next"
          onChangeText={setPicture}
          style={[styles.inputSearch, styles.inputSearchPicture]}
        />
        <TextInput
          value={name}
          numberOfLines={1}
          blurOnSubmit={false}
          enablesReturnKeyAutomatically
          clearButtonMode="while-editing"
          placeholder="Group Name"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="send"
          returnKeyLabel="send"
          onChangeText={setName}
          style={styles.inputSearch}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  inputSearchPicture: {
    marginBottom: 10,
  },
})
