import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { CALLS_TYPES } from '@/constants'
import colors from '@/constants/colors'
import getRelativeTime from '@/utils/getRelativeTime'
import Spinner from '@/components/Spinner'
import EmptyListPlaceholder from '@/components/EmptyListPlaceholder'

export default function ListCalls({ navigation, handlePressItem, loading, error, data }) {
  function handleCreateCall() {
    navigation.navigate('CallCreate')
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
        image={require('./img/no_calls.png')}
        title="No Phone Calls"
        subtitle="You don't participate in any call yet"
        actionTitle="Make Phone Call"
        actionHandler={handleCreateCall}
      />
    )
  }

  return (
    <FlatList
      data={data}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      keyExtractor={item => item.call.id}
      renderItem={({ item: { call } }) => {
        const time = getRelativeTime()
        const callName =
          call.name || call.users.map(({ user }) => `${user.firstName} ${user.lastName}`).join(', ')
        const photo = call.name ? 'https://i.imgur.com/Ed9bc84.jpg' : call.users[0].user.photo

        return (
          <View style={styles.item}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: photo }} style={styles.picture} />
            </View>
            <View style={styles.textContent}>
              <View style={styles.text}>
                <View style={styles.header}>
                  <Text style={styles.name}>{callName}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <Image
                    source={require('./img/icon_answered_call.png')}
                    style={styles.iconStatus}
                  />
                  <Text style={styles.message} numberOfLines={1}>
                    Last called {time}
                  </Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    handlePressItem({
                      photo,
                      type: CALLS_TYPES.VIDEO,
                      users: call.users,
                      name: callName,
                    })
                  }
                  style={styles.videoActionContainer}>
                  <Image source={require('./img/icon_video_call.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handlePressItem({
                      photo,
                      type: CALLS_TYPES.AUDIO,
                      users: call.users,
                      name: callName,
                    })
                  }>
                  <Image source={require('./img/icon_audio_call.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }}
    />
  )
}

ListCalls.propTypes = {
  navigation: PropTypes.object.isRequired,
  handlePressItem: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  data: PropTypes.array,
}

ListCalls.defaultProps = {
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
  message: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  text: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStatus: {
    width: 13,
    height: 12,
    marginRight: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoActionContainer: {
    marginRight: 20,
  },
  error: {
    color: colors.text,
  },
})
