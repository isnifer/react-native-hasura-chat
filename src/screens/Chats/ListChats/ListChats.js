import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'
import getRelativeTime from '@/utils/getRelativeTime'
import Spinner from '@/components/Spinner'
import EmptyListPlaceholder from '@/components/EmptyListPlaceholder'

export default function ListChats({ navigation, handlePressItem, loading, error, data }) {
  function handleSearchPeople() {
    navigation.navigate('Search')
  }

  if (loading) {
    return <Spinner flex />
  }

  if (error) {
    return (
      <View>
        <Text style={styles.error}>{JSON.stringify(error, null, 2)}</Text>
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
    <View style={styles.root}>
      <FlatList
        data={data}
        style={styles.list}
        contentContainerStyle={styles.container}
        keyExtractor={item => item.chatId}
        renderItem={({ item: { chatId, opponent } }) => {
          const time = getRelativeTime(opponent.time)

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.item}
              onPress={() => handlePressItem({ chatId, opponent })}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: opponent.photo }} style={styles.photo} />
                {opponent.online && <View style={styles.status} />}
              </View>
              <View style={styles.textContent}>
                <View style={styles.text}>
                  <View style={styles.header}>
                    <Text style={styles.name}>
                      {opponent.firstName} {opponent.lastName}
                    </Text>
                    {opponent.unread && <View style={styles.unreadMarker} />}
                  </View>
                  <Text
                    style={[styles.message, opponent.unread && styles.messageUnread]}
                    numberOfLines={1}>
                    {opponent.message || 'Last unread message'}
                  </Text>
                </View>
                <View style={styles.statuses}>
                  <Text style={[styles.time, opponent.unread && styles.messageUnread]}>{time}</Text>
                  <Text style={styles.typing}>{opponent.typing ? 'Typing...' : ''}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

ListChats.propTypes = {
  navigation: PropTypes.object.isRequired,
  handlePressItem: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  data: PropTypes.array,
}

ListChats.defaultProps = {
  loading: false,
  error: undefined,
  data: [],
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
  },
  container: {
    paddingHorizontal: 20,
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
  statuses: {
    justifyContent: 'space-between',
    paddingBottom: 3,
  },
  error: {
    color: colors.text,
  },
})
