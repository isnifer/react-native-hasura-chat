import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { useSubscription, useMutation, gql } from '@apollo/client'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'
import Spacer from '@/components/Spacer'

const LOAD_MESSAGES = gql`
  subscription LoadMessages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }) {
      id
      text
      userId: user_id
    }
  }
`

const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: uuid!, $userId: uuid, $text: String!) {
    insert_messages(objects: { chat_id: $chatId, user_id: $userId, text: $text }) {
      returning {
        id
        text
        time
        chat_id
        user_id
      }
    }
  }
`

const USER_ID = 'c107917b-3537-4b26-9d47-ee3e331c487e'

export default function Home({ route }) {
  const { chatId, user } = route.params
  const [message, setMessage] = useState('')
  const { loading, error, data } = useSubscription(LOAD_MESSAGES, { variables: { chatId } })
  const [sendMessage] = useMutation(SEND_MESSAGE)

  function handleAddMessage({ nativeEvent: { text } }) {
    sendMessage({ variables: { chatId, userId: USER_ID, text } })
    setMessage('')
  }

  if (loading) {
    return <Spinner flex />
  }

  if (error) {
    return (
      <View>
        <Text>{JSON.stringify(error, null, 2)}</Text>
      </View>
    )
  }

  const messages = data?.messages ?? []

  return (
    <View style={styles.container}>
      <KeyboardAwareFlatList
        extraScrollHeight={15}
        data={messages}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyExtractor={item => item.id}
        ListFooterComponent={
          <View>
            <Spacer auto />
            <TextInput
              value={message}
              numberOfLines={10}
              blurOnSubmit={false}
              enablesReturnKeyAutomatically
              onSubmitEditing={handleAddMessage}
              clearButtonMode="while-editing"
              placeholder="Type your message"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="send"
              returnKeyLabel="send"
              onChangeText={setMessage}
              style={styles.textInput}
            />
          </View>
        }
        renderItem={({ item: { text, userId }, index }) => {
          const isThisLastMessageInBlock = data.messages[index + 1]?.userId !== userId

          return (
            <View>
              <View
                style={
                  userId === user.id
                    ? [styles.message, isThisLastMessageInBlock && styles.messageLast]
                    : [styles.myMessage, isThisLastMessageInBlock && styles.myMessageLast]
                }>
                <Text style={userId === user.id ? styles.messageText : styles.myMessageText}>
                  {text}
                </Text>
              </View>
              {isThisLastMessageInBlock && <Spacer small />}
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  list: {
    paddingHorizontal: 20,
  },
  listContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 20,
  },
  message: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 10,
  },
  messageLast: {
    borderBottomLeftRadius: 20,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'left',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 30,
  },
  myMessageLast: {
    borderBottomRightRadius: 20,
  },
  myMessageText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  textInput: {
    height: 45,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingTop: 13,
    paddingBottom: 10,
    borderRadius: 30,
  },
})
