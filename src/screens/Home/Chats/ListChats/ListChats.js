import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'
import getRelativeTime from '@/utils/getRelativeTime'
import Spinner from '@/components/Spinner'
import EmptyListPlaceholder from '@/components/EmptyListPlaceholder'

export default function ListChats(props) {
  const { navigation, handlePressItem, userId, minimal, loading, error, data } = props

  function handleSearchPeople() {
    navigation.navigate('Search')
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

  if (!data.length) {
    return (
      <EmptyListPlaceholder
        image={require('./img/no_chats.png')}
        title="No Conversation"
        subtitle={`You didn't make any conversation yet,${'\n'}please select a username`}
        actionTitle="Chat People"
        actionHandler={handleSearchPeople}
      />
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
        const time = getRelativeTime(user.time)
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

ListChats.propTypes = {
  navigation: PropTypes.object.isRequired,
  handlePressItem: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  data: PropTypes.array,
  minimal: PropTypes.bool,
}

ListChats.defaultProps = {
  minimal: false,
  loading: false,
  error: undefined,
  data: [],
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
