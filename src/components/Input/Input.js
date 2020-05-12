import React from 'react'
import { View, Text, TextInput, ViewPropTypes, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

export default function Input(props) {
  const isErrorVisible = props.touched && props.error
  const inputStyle = [props.style, styles.input, isErrorVisible && styles.inputError]

  function onFocus(...args) {
    if (props.onInputFocus) {
      props.onInputFocus(...args)
    }

    if (props.onFocus) {
      return props.onFocus(...args)
    }
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput {...props} onFocus={onFocus} style={inputStyle} />
      {isErrorVisible && (
        <View style={styles.error}>
          <Text style={styles.errorMessage}>{props.error}</Text>
          <View style={styles.errorBackground} />
        </View>
      )}
    </View>
  )
}

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  placeholder: PropTypes.string.isRequired,
  numberOfLines: PropTypes.number,
  enablesReturnKeyAutomatically: PropTypes.bool,
  clearButtonMode: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  returnKeyType: PropTypes.string,
  returnKeyLabel: PropTypes.string,
  blurOnSubmit: PropTypes.bool,
  onChangeText: PropTypes.func,
  style: ViewPropTypes.style,

  // Final Form Props
  touched: PropTypes.bool,
  error: PropTypes.string,

  // Extra Props
  onInputFocus: PropTypes.func,
}

Input.defaultProps = {
  numberOfLines: 1,
  enablesReturnKeyAutomatically: true,
  clearButtonMode: 'while-editing',
  placeholderTextColor: colors.placeholder,
  returnKeyType: 'next',
  returnKeyLabel: 'next',
  blurOnSubmit: true,
  onChangeText: () => {},
  style: {},
  touched: false,
  error: null,
  onInputFocus: null,
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 40,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    backgroundColor: colors.checkbox,
    paddingHorizontal: 22,
    paddingTop: 11,
    paddingBottom: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.checkbox,
    position: 'relative',
    zIndex: 2,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  error: {
    position: 'absolute',
    height: 16,
    top: -8,
    right: 15,
    zIndex: 3,
    paddingHorizontal: 4,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    color: colors.danger,
    position: 'relative',
    zIndex: 3,
  },
  errorBackground: {
    backgroundColor: colors.checkbox,
    position: 'absolute',
    bottom: 0,
    left: -1,
    right: -1,
    height: 8,
    zIndex: 1,
  },
})
