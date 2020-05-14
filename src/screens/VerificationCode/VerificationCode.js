import React, { useState, createRef, forwardRef, useRef } from 'react'
import { View, Text, TextInput, SafeAreaView, StyleSheet } from 'react-native'
import { range } from 'lodash'
import { useImmer } from 'use-immer'
import colors from '@/constants/colors'
import Spinner from '@/components/Spinner'

const CODE_LENGTH = 6

const VerificationCodeInput = forwardRef((inputProps, ref) => {
  const { index, nextInput, prevInput, setFocused, handleChange, ...props } = inputProps

  function handleFocus() {
    setFocused(index)
  }

  function handleChangeText(value) {
    handleChange(value, index)

    if (nextInput && value) {
      return nextInput.current.focus()
    }
  }

  function handleKeyPress(event) {
    if (event.nativeEvent.key === 'Backspace' && !props.value && prevInput) {
      return prevInput.current.focus()
    }
  }

  return (
    <TextInput
      {...props}
      selectTextOnFocus
      ref={ref}
      maxLength={1}
      style={styles.input}
      keyboardType="number-pad"
      onChangeText={handleChangeText}
      onKeyPress={handleKeyPress}
      onFocus={handleFocus}
    />
  )
})

export default function VerificationCode({ route }) {
  const inputs = useRef(range(6).map(() => createRef()))
  const [verificationCode, setVerificationCode] = useImmer([])
  const [focused, setFocused] = useState(0)
  const [codeVerificationInProgress, setCodeVerification] = useState(false)

  function handleChange(value, index) {
    setVerificationCode(draft => {
      draft[index] = value
    })
  }

  async function handleSubmit(code) {
    const codeString = code.join('')
    if (codeString.length === CODE_LENGTH) {
      setCodeVerification(true)
      await route.params.confirmVerificationCode(codeString)
      setCodeVerification(false)
    }
  }

  React.useEffect(() => {
    if (verificationCode.length === CODE_LENGTH) {
      handleSubmit(verificationCode)
    }
  }, [verificationCode])

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Verification{'\n'}Security Code</Text>
        <Text style={styles.subtitle}>
          Just enable the dark mode and be{'\n'}
          king to the nightmare world
        </Text>
      </View>
      <View style={styles.inputsContainer}>
        {inputs.current.map((ref, index) => (
          <View style={[styles.inputWrapper, !index && styles.inputWrapperFirst]}>
            <VerificationCodeInput
              key={index} // eslint-disable-line react/no-array-index-key
              ref={ref}
              index={index}
              autoFocus={!index}
              nextInput={inputs.current[index + 1]}
              prevInput={inputs.current[index - 1]}
              value={verificationCode[index]}
              setFocused={setFocused}
              handleChange={handleChange}
            />
            <View
              style={[styles.inputBackground, index === focused && styles.inputBackgroundFocused]}
              pointerEvents="box-none"
            />
          </View>
        ))}
      </View>
      {codeVerificationInProgress && (
        <View style={styles.spinnerContainer}>
          <Spinner />
          <Text style={styles.spinnerText}>Verifing Code</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  header: {
    marginTop: 56,
    marginLeft: 38,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtitle,
    marginTop: 17,
    lineHeight: 24,
  },
  inputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  inputWrapper: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 7,
    marginLeft: 7,
  },
  inputWrapperFirst: {
    marginLeft: 0,
  },
  inputBackground: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 7,
    position: 'absolute',
    zIndex: 1,
  },
  inputBackgroundFocused: {
    backgroundColor: colors.checkbox,
  },
  input: {
    width: 50,
    height: 50,
    borderRadius: 7,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 2,
  },
  inputFirst: {
    marginLeft: 0,
  },
  spinnerContainer: {
    marginTop: 35,
  },
  spinnerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
})
