import { useEffect, createRef, useRef } from 'react'
import { Animated, Keyboard, Platform } from 'react-native'

export default function useKeyboardAvoid() {
  const animatedView = createRef()
  const animatedHeight = useRef(new Animated.Value(0)).current

  const moveScreenUp = event => {
    Animated.timing(animatedHeight, {
      toValue: event.endCoordinates.height,
      duration: event.duration,
      useNativeDriver: Platform.OS === 'Android',
    }).start()
  }

  const moveScreenDown = event => {
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: event.duration,
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
  }, [])

  return {
    animatedView,
    animatedHeight,
  }
}
