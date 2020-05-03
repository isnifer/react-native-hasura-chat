import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'

export default function List({ handlePressItem, loading, error, data }) {
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
      keyExtractor={item => item.id}
      renderItem={({ item: user }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.item}
          onPress={() => handlePressItem({ opponentId: user.id })}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: user.photo }} style={styles.photo} />
            {user.online && <View style={styles.status} />}
          </View>
          <View style={styles.textContent}>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  )
}

List.propTypes = {
  handlePressItem: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  data: PropTypes.array,
}

List.defaultProps = {
  loading: false,
  error: undefined,
  data: null,
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.primary,
    paddingHorizontal: 20,
  },
  textContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
})
