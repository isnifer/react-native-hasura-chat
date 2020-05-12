import React from 'react'
import { Text, TouchableOpacity, ViewPropTypes, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

export default function Button(props) {
  function handlePress(...args) {
    if (props.disabled) {
      return false
    }

    return props.onPress(...args)
  }

  const activeOpacity = props.disabled ? props.disabledOpacity : props.activeOpacity
  const buttonOpacity = props.disabled ? props.disabledOpacity : 1

  if (props.custom) {
    const style = [{ opacity: buttonOpacity }, props.style]

    return (
      <TouchableOpacity
        {...props}
        activeOpacity={activeOpacity}
        onPress={handlePress}
        style={style}>
        {props.children}
      </TouchableOpacity>
    )
  }
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={activeOpacity}
      onPress={handlePress}
      style={[{ opacity: buttonOpacity }, styles.button]}>
      <Text style={styles.buttonTitle}>{props.title}</Text>
    </TouchableOpacity>
  )
}

Button.propTypes = {
  disabled: PropTypes.bool,
  disabledOpacity: PropTypes.number,
  activeOpacity: PropTypes.number,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
  custom: PropTypes.bool,
}

Button.defaultProps = {
  disabled: false,
  disabledOpacity: 0.4,
  activeOpacity: 0.8,
  onPress: () => {},
  style: {},
  custom: false,
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button,
    borderRadius: 22.5,
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
})
