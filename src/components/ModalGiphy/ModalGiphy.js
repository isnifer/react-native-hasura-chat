import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import { debounce } from 'lodash'
import colors from '@/constants/colors'
import Input from '@/components/Input'

export default function ModalGiphy(props) {
  const [gifs, setGifs] = React.useState([])
  const [term, updateTerm] = React.useState('')
  const debouncedSearch = React.useRef(
    debounce(async newTerm => {
      try {
        const BASE_URL = 'http://api.giphy.com/v1/gifs/search'
        const response = await fetch(
          `${BASE_URL}?api_key=${process.env.CHAT_APP_GIPHY_API_KEY}&q=${newTerm}`
        ).then(data => data.json())
        setGifs(response.data)
      } catch (error) {
        console.warn(error) // eslint-disable-line no-console
      }
    }, 600)
  ).current

  function onEdit(newTerm) {
    updateTerm(newTerm)
    debouncedSearch(newTerm)
  }

  function hideModal() {
    setGifs([])
    updateTerm('')

    props.toggle()
  }

  function handlePressGif(uri) {
    setGifs([])
    updateTerm('')

    props.sendGIF(uri)
  }

  return (
    <Modal isVisible={props.isVisible} style={styles.modal}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Input
              value={term}
              placeholder="Search Giphy"
              style={styles.textInput}
              onChangeText={onEdit}
            />
            <TouchableOpacity style={styles.buttonCancel} onPress={hideModal}>
              <Text style={styles.buttonCancelTitle}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.list}>
            {gifs.map(({ images }) => {
              const { url: uri, width, height } = images.fixed_width

              return (
                <TouchableOpacity activeOpacity={0.95} onPress={() => handlePressGif(uri)}>
                  <Image
                    resizeMode="contain"
                    source={{ uri }}
                    style={[styles.image, { width: Number(width), height: Number(height) }]}
                  />
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

ModalGiphy.propTypes = {
  toggle: PropTypes.func.isRequired,
  sendGIF: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    margin: 0,
    backgroundColor: colors.text,
  },
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  textInput: {
    width: width - 40 - 70 - 10,
    marginRight: 10,
  },
  buttonCancel: {
    backgroundColor: 'purple',
    borderRadius: 5,
    height: 40,
    width: 70,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCancelTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  image: {
    borderWidth: 2,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
})
