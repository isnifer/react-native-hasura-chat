import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import colors from '@/constants/colors'

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: 'https://i.imgur.com/0Sd9PPp.jpg' }} style={styles.photo} />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>Jesse</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>Edwards</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Bio</Text>
          <Text style={styles.value}>
            Hello World! I{"'"}m lucky guy! This is my long bio story.
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>+1 800 555-34-34</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>@jesse.edwards</Text>
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
  profileInfo: {
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
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
  },
  value: {
    flex: 2,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'right',
  },
})
