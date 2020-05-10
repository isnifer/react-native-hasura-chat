import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  StyleSheet,
} from 'react-native'
import { useSubscription, useMutation, gql } from '@apollo/client'
import useKeyboardAvoid from '@/hooks/useKeyboardAvoid'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'
import Spacer from '@/components/Spacer'

const LOAD_MESSAGES = gql`
  subscription LoadMessages($chatId: uuid!) {
    messages: chats_messages(where: { chat_id: { _eq: $chatId } }, order_by: { time: desc }) {
      id
      text
      userId: user_id
    }
  }
`

const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: uuid!, $userId: uuid, $text: String!) {
    insert_chats_messages(objects: { chat_id: $chatId, user_id: $userId, text: $text }) {
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

export default function Chat({ route }) {
  const { id: USER_ID } = getSyncProfile()
  const { chatId, opponent } = route.params
  const [message, setMessage] = useState('')
  const { loading, error, data } = useSubscription(LOAD_MESSAGES, { variables: { chatId } })
  const [sendMessage] = useMutation(SEND_MESSAGE)
  const { animatedView, animatedHeight } = useKeyboardAvoid()

  function handleAddMessage({ nativeEvent: { text } }) {
    sendMessage({ variables: { chatId, userId: USER_ID, text } })
    setMessage('')
  }

  function handlePressPlusButton() {}

  if (loading) {
    return (
      <View style={styles.container}>
        <Spinner flex />
      </View>
    )
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
      <Animated.View
        ref={animatedView}
        style={[styles.container, { marginBottom: animatedHeight }]}>
        <FlatList
          inverted
          data={messages}
          contentContainerStyle={styles.listContent}
          keyExtractor={item => item.id}
          renderItem={({ item: { text, userId }, index }) => {
            const isThisLastMessageInBlock = data.messages[index - 1]?.userId !== userId

            const opponentMessageStyles = [
              styles.message,
              isThisLastMessageInBlock && styles.messageLast,
            ]
            const myMessageStyles = [
              styles.myMessage,
              isThisLastMessageInBlock && styles.myMessageLast,
            ]

            return (
              <View>
                <View style={userId === opponent.id ? opponentMessageStyles : myMessageStyles}>
                  <Text style={userId === opponent.id ? styles.messageText : styles.myMessageText}>
                    {text}
                  </Text>
                </View>
                {isThisLastMessageInBlock && <Spacer small />}
              </View>
            )
          }}
        />
        <View style={styles.textInputContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.buttonPlus}
            onPress={handlePressPlusButton}>
            <Image source={require('./img/icon_plus.png')} style={styles.buttonPlusIcon} />
          </TouchableOpacity>
          <TextInput
            value={message}
            numberOfLines={10}
            blurOnSubmit={false}
            enablesReturnKeyAutomatically
            onSubmitEditing={handleAddMessage}
            clearButtonMode="while-editing"
            placeholder="Type your message"
            placeholderTextColor={colors.text}
            returnKeyType="send"
            returnKeyLabel="send"
            onChangeText={setMessage}
            style={styles.textInput}
          />
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  message: {
    maxWidth: '90%',
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
    maxWidth: '90%',
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
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
  },
  buttonPlus: {
    width: 45,
    height: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 23,
    marginRight: 10,
  },
  buttonPlusIcon: {
    width: 16,
    height: 16,
  },
  textInput: {
    flex: 1,
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
