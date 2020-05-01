import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import colors from '@/constants/colors'
import ListCalls from './ListCalls'

const CALLS = gql`
  query UserCalls($userId: uuid!) {
    calls: calls_users(where: { user_id: { _eq: $userId } }) {
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

const USER_ID = 'c107917b-3537-4b26-9d47-ee3e331c487e'

export default function Calls({ navigation }) {
  const { loading, error, data } = useQuery(CALLS, {
    variables: { userId: USER_ID },
  })

  const calls = data?.calls ?? []

  function handlePressItem({ name, photo, users, type }) {
    navigation.navigate('Call', { name, photo, users, type })
  }

  return (
    <View style={styles.container}>
      <ListCalls
        userId={USER_ID}
        loading={loading}
        error={error}
        data={calls}
        navigation={navigation}
        handlePressItem={handlePressItem}
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
