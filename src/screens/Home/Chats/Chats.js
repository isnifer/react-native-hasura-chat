import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import colors from '@/constants/colors'
import Stories from '@/components/Stories'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import ListChats from './ListChats'

const CHATS = gql`
  query UserChats($userId: uuid!) {
    chats: chats_users(where: { user_id: { _eq: $userId } }) {
      chatId: chat_id
      opponent {
        id
        photo
        username
        firstName: first_name
        lastName: last_name
      }
    }
  }
`

export default function Chats({ navigation }) {
  const { id: userId } = getSyncProfile()
  const { loading, error, data, refetch } = useQuery(CHATS, { variables: { userId } })
  const chats = data?.chats ?? []

  function handlePressChat({ chatId, opponent }) {
    navigation.navigate('Chat', { chatId, opponent, picture: opponent.photo })
  }

  return (
    <View style={styles.container}>
      <View style={styles.storiesContainer}>
        <Stories navigation={navigation} />
      </View>
      <View style={styles.chatsContainer}>
        <ListChats
          userId={userId}
          loading={loading}
          error={error}
          data={chats}
          navigation={navigation}
          handlePressItem={handlePressChat}
          handleRefresh={refetch}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  storiesContainer: {
    flex: 1,
  },
  chatsContainer: {
    flex: 4.5,
    justifyContent: 'center',
  },
})
