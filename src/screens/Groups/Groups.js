import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import colors from '@/constants/colors'
import ListGroups from './ListGroups'

const GROUPS = gql`
  query UserGroups($userId: uuid!) {
    groups: groups_users(where: { user_id: { _eq: $userId } }) {
      group {
        id
        name
        picture
      }
    }
  }
`

export default function Groups({ navigation }) {
  const { id: userId } = getSyncProfile()
  const { loading, error, data, refetch } = useQuery(GROUPS, { variables: { userId } })
  const groups = data?.groups ?? []

  function handlePressItem({ group }) {
    navigation.navigate('GroupChat', { group, userId, picture: group.picture })
  }

  return (
    <View style={styles.container}>
      <ListGroups
        userId={userId}
        loading={loading}
        error={error}
        data={groups}
        navigation={navigation}
        handlePressItem={handlePressItem}
        handleRefresh={refetch}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.backgroundColor,
  },
})
