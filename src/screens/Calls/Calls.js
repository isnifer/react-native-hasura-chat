import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import colors from '@/constants/colors'
import ListCalls from './ListCalls'

const CALLS = gql`
  query UserCalls($userId: String!) {
    calls: calls_users(where: { user_id: { _eq: $userId } }) {
      callId: call_id
      call {
        id
        name
        users(where: { user_id: { _neq: $userId } }) {
          user {
            id
            photo
            username
            firstName: first_name
            lastName: last_name
          }
        }
      }
    }
  }
`

export default function Calls({ navigation }) {
  const { id: userId } = getSyncProfile()
  const { loading, error, data, refetch } = useQuery(CALLS, { variables: { userId } })
  const calls = data?.calls ?? []

  function handlePressItem({ callId, name, photo, users, type }) {
    navigation.navigate('Call', { callId, name, photo, users, type })
  }

  return (
    <View style={styles.container}>
      <ListCalls
        userId={userId}
        loading={loading}
        error={error}
        data={calls}
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
