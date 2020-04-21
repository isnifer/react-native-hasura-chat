import { useState, useEffect } from 'react'
import { getGenericPassword } from 'react-native-keychain'

export default function useAuthToken() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(true)

  useEffect(() => {
    async function retriveAccessToken() {
      try {
        setLoading(true)
        const credentials = await getGenericPassword()

        if (credentials.username) {
          throw new Error('No access token')
        }
      } catch (errorMessage) {
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    retriveAccessToken()
  }, [])

  function handleSuccessLogin() {
    setError(null)
  }

  return {
    loading,
    error,
    handleSuccessLogin,
  }
}
