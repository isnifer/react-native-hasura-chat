import { useEffect, useRef } from 'react'
import { Animated, Keyboard, Platform } from 'react-native'

const DEFAULT_EVENT_DURATION = 250

export default function useKeyboardAvoid(initialValue = 0) {
  const animatedHeight = useRef(new Animated.Value(initialValue)).current

  const moveScreenUp = event => {
    let toValue = event.endCoordinates.height
    toValue = initialValue !== 0 ? initialValue - toValue : toValue

    console.log(initialValue, toValue, event.endCoordinates.height)

    Animated.timing(animatedHeight, {
      toValue,
      duration: event.duration || DEFAULT_EVENT_DURATION,
      useNativeDriver: Platform.OS === 'Android',
    }).start()
  }

  const moveScreenDown = event => {
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: event.duration || DEFAULT_EVENT_DURATION,
      useNativeDriver: Platform.OS === 'Android',
    }).start()
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', moveScreenUp)
    Keyboard.addListener('keyboardWillHide', moveScreenDown)

    return () => {
      Keyboard.removeListener('keyboardWillShow', moveScreenUp)
      Keyboard.removeListener('keyboardWillHide', moveScreenDown)
    }
  }, [initialValue])

  return {
    animatedHeight,
  }
}
