import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

const DATA = [
  {
    id: 1,
    name: 'Diana Smiley',
    message: 'Introducing yours identity',
    image: require('@/components/List/img/1.png'),
    unread: true,
    online: true,
    live: true,
  },
  {
    id: 2,
    name: 'Arden Dean',
    image: require('@/components/List/img/2.png'),
  },
  {
    id: 3,
    name: 'Gracelyn Mason',
    message: 'We met new users',
    image: require('@/components/List/img/3.png'),
    unread: true,
    online: true,
  },
  {
    id: 4,
    name: 'Leo Gill',
    image: require('@/components/List/img/4.png'),
  },
  {
    id: 5,
    name: 'Merida Swan',
    image: require('@/components/List/img/5.png'),
    unread: true,
  },
  {
    id: 6,
    name: 'Lori Bryson',
    image: require('@/components/List/img/6.png'),
    online: true,
  },
  {
    id: 7,
    name: 'Abella Danger',
    message: 'Introducing yours identity',
    image: require('@/components/List/img/1.png'),
    unread: true,
    online: true,
  },
  {
    id: 8,
    name: 'Keiran Lee',
    image: require('@/components/List/img/2.png'),
  },
]

export default function List({ navigation }) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={DATA}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      keyExtractor={item => `${item.id}`}
      ListHeaderComponent={
        <View style={styles.listHeaderComponent}>
          <TouchableOpacity style={[styles.image, styles.yourStory]}>
            <Image source={require('./img/icon_plus.png')} />
          </TouchableOpacity>
          <Text style={styles.name}>Your Story</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.item}
          onPress={() => navigation.navigate('Story', item)}>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} />
            {item.online && <View style={styles.status} />}
          </View>
          <Text style={styles.name}>{item.name.split(' ')[0]}</Text>
        </TouchableOpacity>
      )}
    />
  )
}

List.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 15,
    paddingBottom: 5,
    // height: 30,
  },
  listContent: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  item: {
    marginLeft: 10,
  },
  imageContainer: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 30,
    borderColor: colors.accent,
  },
  image: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: colors.backgroundColor,
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
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginTop: 3,
  },
  listHeaderComponent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  yourStory: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B3B3D',
    borderColor: '#3B3B3D',
  },
})
