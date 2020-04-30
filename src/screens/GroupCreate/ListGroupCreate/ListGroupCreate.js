import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { useImmer } from 'use-immer'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'
import Checkbox from '@/components/Checkbox'

export default function ListGroupCreate({ loading, error, data }) {
  const [selected, updateSelected] = useImmer({})

  function handlePressItem(id) {
    updateSelected(draft => {
      draft[id] = !draft[id]
    })
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

  return (
    <FlatList
      data={data}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      keyExtractor={item => item.id}
      renderItem={({ item: { id, photo, online, firstName, lastName } }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.item}
          onPress={() => handlePressItem(id)}>
          <View style={styles.header}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              {online && <View style={styles.status} />}
            </View>
            <Text style={styles.name}>
              {firstName} {lastName}
            </Text>
          </View>
          <Checkbox checked={selected[id]} />
        </TouchableOpacity>
      )}
    />
  )
}

ListGroupCreate.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  data: PropTypes.array,
}

ListGroupCreate.defaultProps = {
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 10,
  },
})
