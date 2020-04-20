import React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default function Spacer({ auto, small }) {
  let style = styles.spacer

  if (auto) {
    style = styles.auto
  }

  if (small) {
    style = styles.small
  }

  return <View style={style} />
}

Spacer.propTypes = {
  auto: PropTypes.bool,
  small: PropTypes.bool,
}

Spacer.defaultProps = {
  auto: false,
  small: false,
}

const styles = StyleSheet.create({
  auto: {
    flex: 1,
  },
  spacer: {
    height: 18,
  },
  small: {
    height: 8,
  },
})
