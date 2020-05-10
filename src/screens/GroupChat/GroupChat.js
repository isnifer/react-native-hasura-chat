import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  StyleSheet,
} from 'react-native'
import { useSubscription, useMutation, gql } from '@apollo/client'
import useKeyboardAvoid from '@/hooks/useKeyboardAvoid'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'
import Spacer from '@/components/Spacer'

const LOAD_GROUP_MESSAGES = gql`
  subscription LoadGroupMessages($groupId: uuid!) {
    messages: groups_messages(where: { group_id: { _eq: $groupId } }, order_by: { time: desc }) {
      id
      text
      time
      user {
        id
        photo
        username
        firstName: first_name
        lastName: last_name
      }
    }
  }
`

const SEND_GROUP_MESSAGE = gql`
  mutation SendGroupMessage($groupId: uuid!, $userId: uuid, $text: String!) {
    insert_groups_messages(objects: { group_id: $groupId, user_id: $userId, text: $text }) {
      returning {
        id
        text
        time
        userId: user_id
        user {
          id
          photo
          username
          firstName: first_name
          lastName: last_name
        }
      }
    }
  }
`

export default function GroupChat({ route }) {
  const { group, userId } = route.params
  const groupId = group.id

  const [message, setMessage] = useState('')
  const { loading, error, data } = useSubscription(LOAD_GROUP_MESSAGES, { variables: { groupId } })
  const [sendMessage] = useMutation(SEND_GROUP_MESSAGE)

  const { animatedView, animatedHeight } = useKeyboardAvoid()

  function handleAddMessage({ nativeEvent: { text } }) {
    sendMessage({ variables: { groupId, userId, text } })
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
          renderItem={({ item: { text, user }, index }) => {
            const isThisLastMessageInBlock = data.messages[index - 1]?.user.id !== user.id
            const isThisFirstMessageInBlock = data.messages[index + 1]?.user.id !== user.id

            const messageContainerStyles = [
              styles.messageContainer,
              user.id === userId && styles.myMessageContainer,
            ]
            const photoStyles = [styles.userPhoto, user.id === userId && styles.myPhoto]
            const opponentMessageStyles = [
              styles.message,
              // Check inverted
              isThisFirstMessageInBlock && styles.messageLast,
              !isThisLastMessageInBlock && styles.messageMargin,
            ]
            const myMessageStyles = [
              styles.myMessage,
              // Check inverted
              isThisFirstMessageInBlock && styles.myMessageLast,
              !isThisLastMessageInBlock && styles.myMessageMargin,
            ]

            return (
              <View>
                <View style={messageContainerStyles}>
                  {isThisLastMessageInBlock && (
                    <Image source={{ uri: user.photo }} style={photoStyles} />
                  )}
                  <View style={user.id !== userId ? opponentMessageStyles : myMessageStyles}>
                    <Text style={user.id !== userId ? styles.messageText : styles.myMessageText}>
                      {text}
                    </Text>
                  </View>
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
            <Image
              source={require('@/screens/Chat/img/icon_plus.png')}
              style={styles.buttonPlusIcon}
            />
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
    paddingHorizontal: 20,
  },
  messageContainer: {
    flexDirection: 'row',
  },
  myMessageContainer: {
    flexDirection: 'row-reverse',
  },
  message: {
    maxWidth: '70%',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingRight: 24,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 10,
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
  },
  myMessage: {
    maxWidth: '70%',
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
    paddingLeft: 24,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 10,
    marginBottom: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 30,
  },
  myMessageLast: {
    borderBottomRightRadius: 20,
  },
  messageMargin: {
    marginLeft: 36,
  },
  myMessageMargin: {
    marginRight: 36,
  },
  myMessageText: {
    fontSize: 16,
    color: colors.text,
  },
  userPhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  myPhoto: {
    alignSelf: 'flex-start',
    marginRight: 0,
    marginLeft: 5,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
