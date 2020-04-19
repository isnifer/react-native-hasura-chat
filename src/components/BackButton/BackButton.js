import React from 'react'
import { Image, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default function BackButton({ goBack }) {
  return (
    <TouchableOpacity onPress={goBack}>
      <Image source={require('./img/back.png')} style={styles.backButtonIcon} />
    </TouchableOpacity>
  )
}

BackButton.propTypes = {
  goBack: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  backButtonIcon: {
    width: 22,
    height: 21,
  },
})
