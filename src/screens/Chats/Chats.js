import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSubscription, gql } from '@apollo/client'
import { orderBy } from 'lodash'
import colors from '@/constants/colors'
import Stories from '@/components/Stories'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import ListChats from './ListChats'

const CHATS = gql`
  subscription UserChats($userId: String!) {
    chats: chats_users(where: { user_id: { _eq: $userId } }) {
      chatId: chat_id
      opponent {
        id
        photo
        username
        firstName: first_name
        lastName: last_name
      }
      chat {
        messages(order_by: { time: desc }, limit: 1) {
          text
          time
          type
          userId: user_id
        }
      }
    }
  }
`

function extractLastMessageTime(item) {
  return item.chat.messages[0]?.time ?? ''
}

export default function Chats({ navigation }) {
  const { id: userId } = getSyncProfile()
  const { loading, error, data, refetch } = useSubscription(CHATS, { variables: { userId } })
  const rawChats = data?.chats ?? []
  const chats = orderBy(rawChats, extractLastMessageTime, 'desc')

  function handlePressChat({ chatId, opponent }) {
    navigation.navigate('Chat', { chatId, opponent, picture: opponent.photo })
  }

  return (
    <View style={styles.container}>
      <Stories navigation={navigation} />
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
})
