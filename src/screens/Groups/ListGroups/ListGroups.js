import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'
import getRelativeTime from '@/utils/getRelativeTime'
import Spinner from '@/components/Spinner'
import EmptyListPlaceholder from '@/components/EmptyListPlaceholder'

export default function ListChats({ navigation, handlePressItem, loading, error, data }) {
  function handleCreateGroup() {
    navigation.navigate('GroupCreate')
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
        image={require('./img/no_groups.png')}
        title="No Groups"
        subtitle="You don't participate in any group yet"
        actionTitle="Create Group"
        actionHandler={handleCreateGroup}
      />
    )
  }

  return (
    <FlatList
      data={data}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      keyExtractor={item => item.group.id}
      renderItem={({ item: { group } }) => {
        const lastMessage = group.messages[0] || { text: '' }
        const time = getRelativeTime(lastMessage.time)

        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handlePressItem({ group })}
            style={styles.item}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: group.picture }} style={styles.picture} />
            </View>
            <View style={styles.textContent}>
              <View style={styles.text}>
                <View style={styles.header}>
                  <Text style={styles.name}>{group.name}</Text>
                  {group.unread && <View style={styles.unreadMarker} />}
                </View>
                <Text
                  style={[styles.message, group.unread && styles.messageUnread]}
                  numberOfLines={1}>
                  {lastMessage.text || 'Last unread message'}
                </Text>
              </View>
              <View style={styles.statuses}>
                <Text style={[styles.time, group.unread && styles.messageUnread]}>{time}</Text>
                <Text style={styles.typing}>{group.typing ? 'Typing...' : ''}</Text>
              </View>
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
  picture: {
    width: 45,
    height: 45,
    borderRadius: 28,
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
})
