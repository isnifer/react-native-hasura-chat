import { useState, useEffect } from 'react'
import { getGenericPassword } from 'react-native-keychain'
import Auth0 from 'react-native-auth0'
import authCredentials from '@/constants/auth0'
import updateCredentials from '@/utils/auth/updateCredentials'
import { setSyncProfile } from '@/utils/auth/syncProfile'

const auth0 = new Auth0(authCredentials)
const AUTH0_TOKEN_EXPIRATION_TIME = 86400

export default function useAuthToken() {
  const [loading, setLoading] = useState(true)
  const [unauthReason, setUnauthReason] = useState(null)

  useEffect(() => {
    async function retriveAccessToken() {
      try {
        // Gettings current securely stored credentials
        const credentials = await getGenericPassword()
        if (!credentials) {
          throw new Error('There are no credentials')
        }

        if (!credentials.username) {
          throw new Error('No access token')
        }

        const { updatedAt, refreshToken } = JSON.parse(credentials.password)
        if (!updatedAt || !refreshToken) {
          throw new Error('There are no credentials')
        }

        // Checking last updated time
        const updatedAtSeconds = Math.round(new Date(updatedAt).getTime() / 1000)
        const nowSeconds = Math.round(new Date().getTime() / 1000)

        // If last updated time more than token expiration time — refreshToken
        if (nowSeconds - updatedAtSeconds >= AUTH0_TOKEN_EXPIRATION_TIME) {
          const freshCredentials = await auth0.auth.refreshToken({ refreshToken })
          await updateCredentials(Object.assign(freshCredentials, { refreshToken }))
        } else {
          // Success scenario
          const { password } = await getGenericPassword()
          setSyncProfile(JSON.parse(password).userprofile)
        }
      } catch (errorMessage) {
        setUnauthReason(JSON.stringify(errorMessage, null, 2))
      } finally {
        setLoading(false)
      }
    }

    retriveAccessToken()
  }, [])

  function handleSuccessLogin() {
    setUnauthReason(null)
  }

  function handleSuccessLogout() {
    setUnauthReason('You have successfully logged out')
  }

  return {
    loading,
    unauthReason,
    handleSuccessLogin,
    handleSuccessLogout,
  }
}
