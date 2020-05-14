import { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import updateCredentials from '@/utils/auth/updateCredentials'
import { UNAUTH_REASONS } from '@/constants'

export default function useAuthToken() {
  const [initializing, setInitializing] = useState(true)
  const [unauthReason, setUnauthReason] = useState()
  const [user, setUser] = useState()

  // Handle user state changes
  async function onAuthStateChanged(nextUser) {
    setUser(nextUser)

    // Logout
    if (user && !nextUser) {
      setUnauthReason(UNAUTH_REASONS.LOGGED_OUT)
    }

    // Unsuccessful login
    if (!user && !nextUser) {
      setUnauthReason(UNAUTH_REASONS.LOGIN)
    }

    if (initializing && !nextUser) {
      return setInitializing(false)
    }

    // Successful login
    if (!user && nextUser) {
      await updateCredentials(nextUser)

      if (!nextUser.displayName) {
        setUnauthReason(UNAUTH_REASONS.FILL_PROFILE)
      } else {
        handleSuccessLogin()
      }

      if (initializing) {
        return setInitializing(false)
      }
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)

    return subscriber // unsubscribe on unmount
  }, [])

  function handleSuccessLogin() {
    setUnauthReason(null)
  }

  return {
    user,
    initializing,
    unauthReason,
    setUnauthReason,
    handleSuccessLogin,
  }
}
