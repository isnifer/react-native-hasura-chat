import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { distanceInWordsToNow } from 'date-fns'
import colors from '@/constants/colors'

const DATA = [
  {
    id: 1,
    name: 'Diana Smiley',
    message: 'Introducing yours identity',
    time: '2020-04-19T18:20:00Z',
    image: require('./img/1.png'),
    unread: true,
    online: true,
  },
  {
    id: 2,
    name: 'Arden Dean',
    message: 'Hey! Whats up, long time no see?',
    time: '2020-04-19T17:20:00Z',
    image: require('./img/2.png'),
  },
  {
    id: 3,
    name: 'Gracelyn Mason',
    message: 'We met new users',
    time: '2020-04-19T16:15:00Z',
    image: require('./img/3.png'),
    typing: true,
    unread: true,
    online: true,
  },
  {
    id: 4,
    name: 'Leo Gill',
    message: 'She is going to make it happen today',
    time: '2020-04-19T12:34:00Z',
    image: require('./img/4.png'),
  },
  {
    id: 5,
    name: 'Merida Swan',
    message: 'Free for a quick call?',
    time: '2020-04-19T10:49:00Z',
    image: require('./img/5.png'),
    unread: true,
  },
  {
    id: 6,
    name: 'Lori Bryson',
    message: 'Lets joinn the video call',
    time: '2020-04-18T8:32:00Z',
    image: require('./img/6.png'),
    online: true,
  },
]

export default function List({ navigation }) {
  return (
    <FlatList
      data={DATA}
      style={styles.list}
      keyExtractor={item => `${item.id}`}
      renderItem={({ item }) => {
        const time = `${distanceInWordsToNow(item.time)} ago`
          .replace('about', '')
          .replace(' minutes ', 'm ')
          .replace(' minute ', 'm ')
          .replace(' hours ', 'h ')
          .replace(' hour ', 'h ')
          .replace(' days ', 'd ')
          .replace(' day ', 'd ')

        return (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.item}
            onPress={() => navigation.navigate('Chat', item)}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} />
              {item.online && <View style={styles.status} />}
            </View>
            <View style={styles.textContent}>
              <View style={styles.text}>
                <View style={styles.header}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.unread && <View style={styles.unreadMarker} />}
                </View>
                <Text
                  style={[styles.message, item.unread && styles.messageUnread]}
                  numberOfLines={1}>
                  {item.message}
                </Text>
              </View>
              <View style={styles.statuses}>
                <Text style={[styles.time, item.unread && styles.messageUnread]}>{time}</Text>
                <Text style={styles.typing}>{item.typing ? 'Typing...' : ''}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

List.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
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
  image: {
    width: 45,
    height: 45,
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
  },
  typing: {
    color: colors.textSecondary,
    textAlign: 'right',
  },
  text: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  statuses: {
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
})
