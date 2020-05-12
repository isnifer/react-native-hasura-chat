import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useQuery, useMutation, gql } from '@apollo/client'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import colors from '@/constants/colors'
import ListSearch from './ListSearch'

const USERS = gql`
  query Users($userId: String!) {
    users(where: { id: { _neq: $userId } }) {
      id
      photo
      firstName: first_name
      lastName: last_name
    }
  }
`

const LOAD_CONVERSATION = gql`
  query LoadConversation($userId: String!, $opponentId: String!) {
    chats: chats_users(
      where: { _and: [{ user_id: { _eq: $userId } }, { opponent_id: { _eq: $opponentId } }] }
    ) {
      chatId: chat_id
      opponent {
        id
        photo
        firstName: first_name
        lastName: last_name
      }
    }
  }
`

const CREATE_CHAT = gql`
  mutation CreateChat {
    insert_chats(objects: {}) {
      returning {
        id
      }
    }
  }
`

const ADD_USERS_TO_CHAT = gql`
  mutation AddUsersToChat($chatId: uuid!, $userId: String!, $opponentId: String!) {
    insert_chats_users(
      objects: [
        { chat_id: $chatId, user_id: $userId, opponent_id: $opponentId }
        { chat_id: $chatId, user_id: $opponentId, opponent_id: $userId }
      ]
    ) {
      returning {
        opponent {
          id
          photo
          firstName: first_name
          lastName: last_name
        }
      }
    }
  }
`

function useLazyQuery(query, options = {}) {
  return useQuery(query, { ...options, skip: true }).refetch
}

export default function Search({ navigation }) {
  const { id: userId } = getSyncProfile()
  const { loading, error, data } = useQuery(USERS, { variables: { userId } })

  const loadConveration = useLazyQuery(LOAD_CONVERSATION)
  const [createChat] = useMutation(CREATE_CHAT)
  const [addUsersToChat] = useMutation(ADD_USERS_TO_CHAT)

  const users = data?.users ?? []

  async function handlePressItem({ opponentId }) {
    let response = await loadConveration({ userId, opponentId })
    let { chatId, opponent } = response?.data.chats[0] ?? {}

    if (!chatId) {
      try {
        response = await createChat()
        // eslint-disable-next-line camelcase
        chatId = response.data.insert_chats.returning[0].id

        response = await addUsersToChat({ variables: { chatId, userId, opponentId } })
        // eslint-disable-next-line prefer-destructuring
        opponent = response.data.insert_chats_users.returning[0].opponent
      } catch (errorMessage) {
        // eslint-disable-next-line no-console
        console.log('Could not create a chat', errorMessage)
      }
    }

    navigation.popToTop()
    navigation.navigate('Chat', { chatId, opponent, picture: opponent.photo })
  }

  return (
    <SafeAreaView style={styles.root}>
      <ListSearch loading={loading} error={error} data={users} handlePressItem={handlePressItem} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.backgroundColor,
  },
})
