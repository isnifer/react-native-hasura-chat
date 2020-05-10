import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSubscription, gql } from '@apollo/client'
import { orderBy } from 'lodash'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import colors from '@/constants/colors'
import ListGroups from './ListGroups'

const GROUPS = gql`
  subscription UserGroups($userId: uuid!) {
    groups: groups_users(where: { user_id: { _eq: $userId } }) {
      group {
        id
        name
        picture
        messages(order_by: { time: desc }, limit: 1) {
          text
          time
          userId: user_id
        }
      }
    }
  }
`

function extractLastMessageTime(item) {
  return item?.group.messages[0]?.time ?? ''
}

export default function Groups({ navigation }) {
  const { id: userId } = getSyncProfile()
  const { loading, error, data, refetch } = useSubscription(GROUPS, { variables: { userId } })
  const rawGroups = data?.groups ?? []
  const groups = orderBy(rawGroups, extractLastMessageTime, 'desc')

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
