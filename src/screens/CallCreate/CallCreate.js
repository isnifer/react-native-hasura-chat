import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useQuery, useMutation, gql } from '@apollo/client'
import { CALLS_TYPES } from '@/constants'
import colors from '@/constants/colors'
import arrayToString from '@/utils/arrayToString'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import ListSearch from '@/screens/Search/ListSearch'

const USERS = gql`
  query Users($userId: uuid!) {
    users(where: { id: { _neq: $userId } }) {
      id
      photo
      firstName: first_name
      lastName: last_name
    }
  }
`

const LOAD_CALLS = gql`
  query LoadCalls($userId: uuid!) {
    calls: calls_users(where: { _and: [{ user_id: { _eq: $userId } }] }) {
      callId: call_id
      call {
        users(where: { user_id: { _neq: $userId } }) {
          user {
            id
            photo
            firstName: first_name
            lastName: last_name
          }
        }
      }
    }
  }
`

const CREATE_CALL = gql`
  mutation CreateCall {
    insert_calls(objects: {}) {
      returning {
        id
      }
    }
  }
`

const ADD_USERS_TO_CHAT = gql`
  mutation AddUsersToCall($callId: uuid!, $userId: uuid!, $opponentId: uuid!) {
    insert_calls_users(
      objects: [{ call_id: $callId, user_id: $userId }, { call_id: $callId, user_id: $opponentId }]
    ) {
      returning {
        user {
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

export default function CallCreate({ navigation }) {
  const { id: userId } = getSyncProfile()
  const { loading, error, data } = useQuery(USERS, { variables: { userId } })
  const allUsers = data?.users ?? []

  const loadCalls = useLazyQuery(LOAD_CALLS)
  const [createCall] = useMutation(CREATE_CALL)
  const [addUsersToCall] = useMutation(ADD_USERS_TO_CHAT)

  async function handlePressItem({ opponentId }) {
    let response = await loadCalls({ userId })
    let {
      callId,
      users: [opponent],
    } = response?.data.calls[0] ?? { users: [] }

    if (!callId) {
      try {
        response = await createCall()
        // eslint-disable-next-line camelcase
        callId = response.data.insert_calls.returning[0].id

        response = await addUsersToCall({ variables: { callId, userId, opponentId } })
        // eslint-disable-next-line prefer-destructuring
        opponent = response.data.insert_calls_users.returning[0].user
      } catch (errorMessage) {
        // eslint-disable-next-line no-console
        console.log('Could not create a chat', errorMessage)
      }
    }

    navigation.popToTop()
    navigation.navigate('Call', {
      callId,
      name: arrayToString([opponent.firstName, opponent.lastName], ' '),
      photo: opponent.photo,
      type: CALLS_TYPES.VIDEO,
    })
  }

  return (
    <SafeAreaView style={styles.root}>
      <ListSearch
        loading={loading}
        error={error}
        data={allUsers}
        handlePressItem={handlePressItem}
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
