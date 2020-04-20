import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import colors from '@/constants/colors'
import Spacer from '@/components/Spacer'
import List from '@/components/List'
import EmptyPlaceholder from '@/components/List/EmptyPlaceholder'
import Stories from '@/components/Stories'

const CHATS = gql`
  query Chats($id: uuid!) {
    chats(where: { _or: [{ user_id_1: { _eq: $id } }, { user_id_2: { _eq: $id } }] }) {
      id
      user1: user_1 {
        id
        firstName: first_name
        lastName: last_name
        photo
      }
      user2: user_2 {
        id
        firstName: first_name
        lastName: last_name
        photo
      }
    }
  }
`

const USER_ID = 'c107917b-3537-4b26-9d47-ee3e331c487e'

export default function Chats({ navigation }) {
  const { loading, error, data } = useQuery(CHATS, {
    variables: { id: USER_ID },
  })

  const chats = data?.chats ?? []

  function handlePressChat({ chatId, user }) {
    navigation.navigate('Chat', { chatId, user })
  }

  return (
    <View style={styles.container}>
      <Stories navigation={navigation} />
      {!error ? (
        <List
          userId={USER_ID}
          loading={loading}
          error={error}
          data={chats}
          navigation={navigation}
          handlePressItem={handlePressChat}
        />
      ) : (
        <EmptyPlaceholder navigation={navigation} />
      )}
      <Spacer auto />
      <Spacer auto />
      <Spacer auto />
      <Spacer auto />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.backgroundColor,
  },
})
