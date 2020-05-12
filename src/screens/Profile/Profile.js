import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import formatPhone from '@/utils/formatPhone'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'

const LOAD_USER = gql`
  query UserProfile($userId: String!) {
    profile: users_by_pk(id: $userId) {
      id
      bio
      photo
      phone
      username
      firstName: first_name
      lastName: last_name
    }
  }
`

export default function Profile() {
  const { id: userId } = getSyncProfile()
  const { loading, error, data } = useQuery(LOAD_USER, { variables: { userId } })
  const profile = data?.profile ?? {}

  if (loading) {
    return <Spinner flex />
  }

  if (error) {
    return (
      <View>
        <Text style={styles.error}>{JSON.stringify(error, null, 2)}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: profile.photo }} style={styles.photo} />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{profile.firstName}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{profile.lastName}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Bio</Text>
          <Text style={styles.value}>{profile.bio}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{formatPhone(profile.phone)}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>@{profile.username}</Text>
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
  error: {
    color: colors.text,
  },
})
