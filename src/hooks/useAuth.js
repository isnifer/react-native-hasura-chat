import { useState } from 'react'
import Auth0 from 'react-native-auth0'
import { getGenericPassword, setGenericPassword } from 'react-native-keychain'
import authCredentials from '@/constants/auth0'
import updateCredentials from '@/utils/auth/updateCredentials'

const auth0 = new Auth0(authCredentials)
const scope = 'openid profile email offline_access'
const audience = `https://${authCredentials.domain}/userinfo`

export default function useAuth(handleSuccessLogin) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Login via username and password inside application
  async function inAppLogin({ email, password }) {
    try {
      setLoading(true)
      const credentials = await auth0.auth.passwordRealm({
        scope,
        audience,
        password,
        username: email,
        realm: 'Username-Password-Authentication',
      })
      await updateCredentials(credentials)
      handleSuccessLogin()
    } catch (errorMessage) {
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Login via Auth0 Web Form
  async function login() {
    try {
      setLoading(true)
      const credentials = await auth0.webAuth.authorize({ scope })
      await updateCredentials(credentials)
      handleSuccessLogin()
    } catch (errorMessage) {
      setError(JSON.stringify(errorMessage, null, 2))
    } finally {
      setLoading(false)
    }
  }

  // Login via google immediately
  async function google() {
    try {
      setLoading(true)
      const credentials = await auth0.webAuth.authorize({
        scope,
        audience,
        connection: 'google-oauth2',
      })
      await updateCredentials(credentials)
      handleSuccessLogin()
    } catch (errorMessage) {
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      setLoading(true)
      await auth0.webAuth.clearSession({})

      const credentials = await getGenericPassword()
      const { refreshToken } = JSON.parse(credentials.password)

      await auth0.auth.revoke({ refreshToken })
      await setGenericPassword(
        '',
        JSON.stringify({
          accessToken: null,
          refreshToken: null,
          updatedAt: null,
          userprofile: null,
        })
      )
    } catch (errorMessage) {
      setError(JSON.stringify(errorMessage, null, 2))
    }
  }

  return {
    loading,
    error,
    login,
    logout,
    google,
    inAppLogin,
  }
}
