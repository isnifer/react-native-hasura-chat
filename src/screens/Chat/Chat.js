import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Animated,
  StyleSheet,
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'
import { useSubscription, useMutation, gql } from '@apollo/client'
import { nanoid } from 'nanoid/non-secure'
import useKeyboardAvoid from '@/hooks/useKeyboardAvoid'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'
import Spacer from '@/components/Spacer'
import ModalGiphy from '@/components/ModalGiphy'

const LOAD_MESSAGES = gql`
  subscription LoadMessages($chatId: uuid!) {
    messages: chats_messages(where: { chat_id: { _eq: $chatId } }, order_by: { time: desc }) {
      id
      text
      time
      type
      userId: user_id
    }
  }
`

const SEND_MESSAGE = gql`
  mutation SendMessage(
    $chatId: uuid!
    $userId: String!
    $text: String!
    $type: message_types_enum
  ) {
    insert_chats_messages(
      objects: { chat_id: $chatId, user_id: $userId, text: $text, type: $type }
    ) {
      returning {
        id
        text
        time
        type
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
  const { animatedHeight } = useKeyboardAvoid()

  const [isModalVisible, setModalVisible] = useState(false)
  const toggleGIFModal = () => setModalVisible(prevState => !prevState)

  function sendGIF(url) {
    sendMessage({ variables: { chatId, userId: USER_ID, text: url, type: 'Gif' } })
    toggleGIFModal()
  }

  function handleAddMessage({ nativeEvent: { text } }) {
    sendMessage({ variables: { chatId, userId: USER_ID, text } })
    setMessage('')
  }

  function handlePressPlusButton() {}

  function handlePressGalleryButton() {
    ImagePicker.openPicker({ multiple: true }).then(async images => {
      const paths = []

      // eslint-disable-next-line no-unused-vars
      for (const { filename, path } of images) {
        const extension = filename.split('.')[1] || '.jpg'
        const reference = storage().ref(`/chats/${chatId}/${nanoid()}.${extension}`)

        await reference.putFile(path)
        const imageURL = await reference.getDownloadURL()

        paths.push(imageURL)
      }

      sendMessage({
        variables: { chatId, userId: USER_ID, text: paths.join('\n'), type: 'Picture' },
      })
    })
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
      <Animated.View style={[styles.container, { marginBottom: animatedHeight }]}>
        <FlatList
          inverted
          data={messages}
          contentContainerStyle={styles.listContent}
          keyExtractor={item => item.id}
          renderItem={({ item: { text, userId, type }, index }) => {
            const isThisLastMessageInBlock = data.messages[index - 1]?.userId !== userId

            const opponentMessageStyles = [
              styles.message,
              isThisLastMessageInBlock && styles.messageLast,
              (type === 'Picture' || type === 'Gif') && styles.messagePicture,
            ]
            const myMessageStyles = [
              styles.myMessage,
              isThisLastMessageInBlock && styles.myMessageLast,
              (type === 'Picture' || type === 'Gif') && styles.myMessagePicture,
            ]

            return (
              <View>
                <View style={userId === opponent.id ? opponentMessageStyles : myMessageStyles}>
                  {type === 'Picture' || type === 'Gif' ? (
                    <View style={styles.standalonePictureContainer}>
                      <Image
                        source={{ uri: text }}
                        resizeMode="cover"
                        style={styles.standalonePicture}
                      />
                    </View>
                  ) : (
                    <Text
                      style={userId === opponent.id ? styles.messageText : styles.myMessageText}>
                      {text}
                    </Text>
                  )}
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
        <View style={styles.mediaButtons}>
          <ScrollView horizontal>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.mediaButton}
              onPress={handlePressGalleryButton}>
              <View
                style={[styles.mediaButtonIconContainer, styles.mediaButtonIconContainerGallery]}>
                <Image source={require('./img/icon_gallery.png')} style={styles.mediaButtonIcon} />
              </View>
              <Text style={styles.mediaButtonTitle}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.mediaButton} onPress={() => {}}>
              <View style={[styles.mediaButtonIconContainer, styles.mediaButtonIconContainerFiles]}>
                <Image source={require('./img/icon_files.png')} style={styles.mediaButtonIcon} />
              </View>
              <Text style={styles.mediaButtonTitle}>Files</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.mediaButton} onPress={() => {}}>
              <View
                style={[styles.mediaButtonIconContainer, styles.mediaButtonIconContainerLocation]}>
                <Image source={require('./img/icon_location.png')} style={styles.mediaButtonIcon} />
              </View>
              <Text style={styles.mediaButtonTitle}>Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.mediaButton}
              onPress={toggleGIFModal}>
              <View style={[styles.mediaButtonIconContainer, styles.mediaButtonIconContainerGif]}>
                <Image source={require('./img/icon_gif.png')} style={styles.mediaButtonIcon} />
              </View>
              <Text style={styles.mediaButtonTitle}>GIF</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.mediaButton} onPress={() => {}}>
              <View style={[styles.mediaButtonIconContainer, styles.mediaButtonIconContainerPlan]}>
                <Image source={require('./img/icon_plan.png')} style={styles.mediaButtonIcon} />
              </View>
              <Text style={styles.mediaButtonTitle}>Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.mediaButton} onPress={() => {}}>
              <View style={[styles.mediaButtonIconContainer, styles.mediaButtonIconContainerAudio]}>
                <Image source={require('./img/icon_mic.png')} style={styles.mediaButtonIcon} />
              </View>
              <Text style={styles.mediaButtonTitle}>Audio</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animated.View>
      <ModalGiphy isVisible={isModalVisible} toggle={toggleGIFModal} sendGIF={sendGIF} />
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
  messagePicture: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
    backgroundColor: 'transparent',
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
  myMessagePicture: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
    backgroundColor: 'transparent',
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
  mediaButtons: {
    height: 130,
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingLeft: 5,
  },
  mediaButton: {
    marginLeft: 15,
  },
  mediaButtonIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaButtonIconContainerGallery: {
    backgroundColor: '#3199FF',
  },
  mediaButtonIconContainerFiles: {
    backgroundColor: '#FF1D62',
  },
  mediaButtonIconContainerLocation: {
    backgroundColor: '#893BFF',
  },
  mediaButtonIconContainerGif: {
    backgroundColor: '#FF7731',
  },
  mediaButtonIconContainerPlan: {
    backgroundColor: '#FFBB00',
  },
  mediaButtonIconContainerAudio: {
    backgroundColor: '#22CFA0',
  },
  mediaButtonIcon: {},
  mediaButtonTitle: {
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginTop: 5,
  },
  standalonePictureContainer: {
    width: 300,
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
  standalonePicture: {
    width: '100%',
    height: '100%',
  },
})
