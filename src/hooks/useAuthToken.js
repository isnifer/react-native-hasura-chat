import { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import updateCredentials from '@/utils/auth/updateCredentials'

export default function useAuthToken() {
  const [initializing, setInitializing] = useState(true)
  const [unauthReason, setUnauthReason] = useState()
  const [user, setUser] = useState()

  // Handle user state changes
  async function onAuthStateChanged(nextUser) {
    setUser(nextUser)

    if (initializing && !nextUser) {
      setInitializing(false)
    }

    // Logout
    if (user && !nextUser) {
      return setUnauthReason('You have successfully logged out')
    }

    // Unsuccessful login
    if (!user && !nextUser) {
      return setUnauthReason('Please authenticate')
    }

    // Successful login
    if (!user && nextUser) {
      await updateCredentials(nextUser)

      if (initializing) {
        setInitializing(false)
      }

      if (!nextUser.displayName) {
        return setUnauthReason('Please, now Create a Profile')
      }

      return handleSuccessLogin()
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
