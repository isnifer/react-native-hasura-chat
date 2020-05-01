import React, { useState } from 'react'
import { View, Text, TextInput, Image, StyleSheet } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { useSubscription, useMutation, gql } from '@apollo/client'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'
import Spacer from '@/components/Spacer'

const LOAD_GROUP_MESSAGES = gql`
  subscription LoadGroupMessages($groupId: uuid!) {
    messages: groups_messages(where: { group_id: { _eq: $groupId } }) {
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

  function handleAddMessage({ nativeEvent: { text } }) {
    sendMessage({ variables: { groupId, userId, text } })
    setMessage('')
  }

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
        renderItem={({ item: { text, user }, index }) => {
          const isThisLastMessageInBlock = data.messages[index + 1]?.user.id !== user.id
          const isThisFirstMessageInBlock = data.messages[index - 1]?.user.id !== user.id

          return (
            <View>
              <View
                style={[styles.messageContainer, user.id === userId && styles.myMessageContainer]}>
                {isThisFirstMessageInBlock && (
                  <Image
                    source={{ uri: user.photo }}
                    style={[styles.userPhoto, user.id === userId && styles.myPhoto]}
                  />
                )}
                <View
                  style={
                    user.id !== userId
                      ? [
                          styles.message,
                          isThisLastMessageInBlock && styles.messageLast,
                          !isThisFirstMessageInBlock && styles.messageMargin,
                        ]
                      : [
                          styles.myMessage,
                          isThisLastMessageInBlock && styles.myMessageLast,
                          !isThisFirstMessageInBlock && styles.myMessageMargin,
                        ]
                  }>
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
  messageContainer: {
    flexDirection: 'row',
  },
  myMessageContainer: {
    flexDirection: 'row-reverse',
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
  messageMargin: {
    marginLeft: 36,
  },
  myMessageMargin: {
    marginRight: 36,
  },
  myMessageText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
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
