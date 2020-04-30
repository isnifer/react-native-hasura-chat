import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useQuery, useMutation, gql } from '@apollo/client'
import colors from '@/constants/colors'
import List from '@/components/List'

const USERS = gql`
  query Users($id: uuid!) {
    users(where: { id: { _neq: $id } }) {
      id
      firstName: first_name
      lastName: last_name
      photo
    }
  }
`

const CONVERSATION = gql`
  query Conversation($userId1: uuid!, $userId2: uuid!) {
    chats(where: { _and: { user_id_1: { _eq: $userId1 }, user_id_2: { _eq: $userId2 } } }) {
      id
      user_id_1
      user_id_2
    }
  }
`

const CREATE_CHAT = gql`
  mutation CreateChat($userId1: uuid!, $userId2: uuid!) {
    insert_chats(objects: { user_id_1: $userId1, user_id_2: $userId2 }) {
      returning {
        id
        user_2 {
          id
          firstName: first_name
          lastName: last_name
        }
      }
    }
  }
`

const USER_ID = 'c107917b-3537-4b26-9d47-ee3e331c487e'

function useLazyQuery(query, options = {}) {
  return useQuery(query, { ...options, skip: true }).refetch
}

export default function Search({ navigation }) {
  const { loading, error, data } = useQuery(USERS, {
    variables: { id: USER_ID },
  })

  const loadConveration = useLazyQuery(CONVERSATION)
  const [createChat] = useMutation(CREATE_CHAT)

  const users = data?.users ?? []

  async function handlePressContact({ id: foreignUserId }) {
    let chat

    const response = await loadConveration({ userId1: USER_ID, userId2: foreignUserId })
    if (!response.errors && !response.data.chats.length) {
      const response2 = await loadConveration({ userId1: foreignUserId, userId2: USER_ID })
      chat = !response2.errors ? response2.data.chats[0] : undefined
    } else {
      chat = data.chats[0] // eslint-disable-line
    }

    if (!chat) {
      const response3 = await createChat({
        variables: { userId1: USER_ID, userId2: foreignUserId },
      })

      const { id: chatId, user_2: user } = response3.data.insert_chats.returning[0]

      navigation.navigate('Chat', { chatId, user })
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <List
        minimal
        loading={loading}
        error={error}
        data={users}
        navigation={navigation}
        handlePressItem={handlePressContact}
      />
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
