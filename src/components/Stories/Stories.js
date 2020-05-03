import React from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

const DATA = [
  {
    id: 1,
    name: 'Diana Smiley',
    message: 'Introducing yours identity',
    image: 'https://i.imgur.com/e7wQICs.jpg',
    unread: true,
    online: true,
    live: true,
  },
  {
    id: 2,
    name: 'Arden Dean',
    image: 'https://i.imgur.com/j2MGH1j.jpg',
  },
  {
    id: 3,
    name: 'Gracelyn Mason',
    message: 'We met new users',
    image: 'https://i.imgur.com/CzwdPAk.jpg',
    unread: true,
    online: true,
  },
  {
    id: 4,
    name: 'Leo Gill',
    image: 'https://i.imgur.com/bjisMYO.jpg',
  },
  {
    id: 5,
    name: 'Merida Swan',
    image: 'https://i.imgur.com/B4nweNh.jpg',
    unread: true,
  },
  {
    id: 6,
    name: 'Lori Bryson',
    image: 'https://i.imgur.com/XYbAjJP.jpg',
    online: true,
  },
  {
    id: 7,
    name: 'Abella Danger',
    message: 'Introducing yours identity',
    image: 'https://i.imgur.com/0Sd9PPp.jpg',
    unread: true,
    online: true,
  },
  {
    id: 8,
    name: 'Keiran Lee',
    image: 'https://i.imgur.com/XUEGjYD.jpg',
  },
]

export default function List({ navigation }) {
  return (
    <View>
      <FlatList
        horizontal
        data={DATA}
        showsHorizontalScrollIndicator={false}
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
              <Image source={{ uri: item.image }} style={styles.image} />
              {item.online && <View style={styles.status} />}
            </View>
            <Text style={styles.name}>{item.name.split(' ')[0]}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

List.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 15,
    paddingBottom: 5,
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
