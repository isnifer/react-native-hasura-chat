import React from 'react'
import { Text, TouchableOpacity, ViewPropTypes, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

export default function Button({ disabled, ...props }) {
  function handlePress(...args) {
    if (disabled) {
      return props.onDisabled()
    }

    return props.onPress(...args)
  }

  const activeOpacity = disabled ? props.disabledOpacity : props.activeOpacity
  const buttonOpacity = disabled ? props.disabledOpacity : 1

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
  style: ViewPropTypes.style,
  onPress: PropTypes.func,
  onDisabled: PropTypes.func,
  custom: PropTypes.bool,
}

Button.defaultProps = {
  disabled: false,
  disabledOpacity: 0.4,
  activeOpacity: 0.8,
  style: {},
  onPress: () => {},
  onDisabled: () => {},
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
