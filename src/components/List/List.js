import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { distanceInWordsToNow } from 'date-fns'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'

const DATA = [
  {
    id: 1,
    firstName: 'Diana',
    lastName: 'Smiley',
    message: 'Introducing yours identity',
    time: '2020-04-18T18:20:00Z',
    photo: require('./img/1.png'),
    unread: true,
    online: true,
  },
  {
    id: 2,
    firstName: 'Arden',
    lastName: 'Dean',
    message: 'Hey! Whats up, long time no see?',
    time: '2020-04-18T17:20:00Z',
    photo: require('./img/2.png'),
  },
  {
    id: 3,
    firstName: 'Gracelyn',
    lastName: 'Mason',
    message: 'We met new users',
    time: '2020-04-17T16:15:00Z',
    photo: require('./img/3.png'),
    typing: true,
    unread: true,
    online: true,
  },
  {
    id: 4,
    firstName: 'Leo',
    lastName: 'Gill',
    message: 'She is going to make it happen today',
    time: '2020-04-12T12:34:00Z',
    photo: require('./img/4.png'),
  },
  {
    id: 5,
    firstName: 'Merida',
    lastName: 'Swan',
    message: 'Free for a quick call?',
    time: '2020-04-09T10:49:00Z',
    photo: require('./img/5.png'),
    unread: true,
  },
  {
    id: 6,
    firstName: 'Lori',
    lastName: 'Bryson',
    message: 'Lets joinn the video call',
    time: '2020-04-01T8:32:00Z',
    photo: require('./img/6.png'),
    online: true,
  },
]

export default function List({ handlePressItem, userId, minimal, loading, error, data }) {
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

  return (
    <FlatList
      data={data}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      keyExtractor={item => item.id}
      renderItem={({ item: { id, user1, user2 } }) => {
        const user = user1.id === userId ? user2 : user1

        const time = `${distanceInWordsToNow(user.time || '2020-04-19T17:20:00Z')} ago`
          .replace('about', '')
          .replace(' minutes ', 'm ')
          .replace(' minute ', 'm ')
          .replace(' hours ', 'h ')
          .replace(' hour ', 'h ')
          .replace(' days ', 'd ')
          .replace(' day ', 'd ')

        const photoSource = typeof user.photo === 'string' ? { uri: user.photo } : user.photo

        return (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.item}
            onPress={() => handlePressItem({ chatId: id, user })}>
            <View style={styles.imageContainer}>
              <Image source={photoSource} style={styles.photo} />
              {user.online && <View style={styles.status} />}
            </View>
            <View style={styles.textContent}>
              <View style={[styles.text, minimal && styles.textMinimal]}>
                <View style={styles.header}>
                  <Text style={styles.name}>
                    {user.firstName} {user.lastName}
                  </Text>
                  {user.unread && <View style={styles.unreadMarker} />}
                </View>
                {!minimal && (
                  <Text
                    style={[styles.message, user.unread && styles.messageUnread]}
                    numberOfLines={1}>
                    {user.message || 'Last unread message'}
                  </Text>
                )}
              </View>
              {!minimal && (
                <View style={styles.statuses}>
                  <Text style={[styles.time, user.unread && styles.messageUnread]}>{time}</Text>
                  <Text style={styles.typing}>{user.typing ? 'Typing...' : ''}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

List.propTypes = {
  handlePressItem: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  data: PropTypes.array,
  minimal: PropTypes.bool,
}

List.defaultProps = {
  minimal: false,
  loading: false,
  error: undefined,
  data: DATA,
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 20,
  },
  textContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  photo: {
    width: 45,
    height: 45,
    borderRadius: 28,
  },
  status: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.backgroundColor,
    backgroundColor: colors.accent,
    bottom: -1,
    right: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  unreadMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginLeft: 5,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  messageUnread: {
    color: colors.text,
  },
  time: {
    color: colors.textSecondary,
    textAlign: 'right',
  },
  typing: {
    color: colors.textSecondary,
    textAlign: 'right',
    fontSize: 11,
  },
  text: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 3,
  },
  textMinimal: {
    justifyContent: 'space-around',
    paddingBottom: 0,
  },
  statuses: {
    justifyContent: 'space-between',
    paddingBottom: 3,
  },
})
