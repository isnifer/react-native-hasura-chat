import React from 'react'
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

export default function Checkbox({ checked, activeOpacity, handlePress }) {
  const Component = handlePress ? TouchableOpacity : View
  const props = {}

  if (handlePress) {
    props.handlePress = handlePress
  }

  return (
    <Component {...props} activeOpacity={activeOpacity} style={styles.container}>
      {checked && <Image source={require('./img/checkbox.png')} />}
    </Component>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  activeOpacity: PropTypes.number,
  handlePress: PropTypes.func,
}

Checkbox.defaultProps = {
  checked: false,
  activeOpacity: 0.7,
  handlePress: null,
}

const styles = StyleSheet.create({
  container: {
    width: 19,
    height: 19,
    backgroundColor: colors.checkbox,
  },
  checked: {},
})
