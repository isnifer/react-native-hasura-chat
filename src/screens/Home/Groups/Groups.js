import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, gql } from '@apollo/client'
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

const USER_ID = 'c107917b-3537-4b26-9d47-ee3e331c487e'

export default function Groups({ navigation }) {
  const { loading, error, data } = useQuery(GROUPS, {
    variables: { userId: USER_ID },
  })

  const groups = data?.groups ?? []

  function handlePressChat({ groupId, user }) {
    navigation.navigate('Group', { groupId, user })
  }

  return (
    <View style={styles.container}>
      <ListGroups
        userId={USER_ID}
        loading={loading}
        error={error}
        data={groups}
        navigation={navigation}
        handlePressItem={handlePressChat}
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
