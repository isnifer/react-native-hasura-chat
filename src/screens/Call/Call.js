import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { startCase } from 'lodash'
import colors from '@/constants/colors'

export default function Chat({ route }) {
  const { type } = route.params

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 32, color: 'white' }}>{startCase(type)} Call Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
})
