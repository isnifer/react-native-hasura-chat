import { useState } from 'react'
import Auth0 from 'react-native-auth0'
import { setGenericPassword } from 'react-native-keychain'

const auth0 = new Auth0({
  domain: 'isnifer.auth0.com',
  clientId: 'bAgNZHv7J2sltsHFSfLkdx6AkgEbBxcn',
})

export default function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function login() {
    try {
      setLoading(true)
      const credentials = await auth0.webAuth.authorize({ scope: 'openid profile email' })
      await setGenericPassword(credentials.idToken, credentials.accessToken)
    } catch (errorMessage) {
      setError(JSON.stringify(errorMessage, null, 2))
    } finally {
      setLoading(false)
    }
  }

  async function loadVerificationCode({ email }) {
    try {
      setLoading(true)
      await auth0.auth.passwordlessWithEmail({ email })
    } catch (errorMessage) {
      setError(JSON.stringify(errorMessage, null, 2))
    } finally {
      setLoading(false)
    }
  }

  async function loginViaEmail({ email, code }) {
    let success = false

    try {
      setLoading(true)
      const credentials = await auth0.auth.loginWithEmail({ email, code })
      await setGenericPassword(credentials.idToken, credentials.accessToken)

      success = true
    } catch (errorMessage) {
      setError(JSON.stringify(errorMessage, null, 2))
    } finally {
      setLoading(false)
    }

    return success
  }

  async function logout() {
    try {
      setLoading(true)
      await auth0.webAuth.clearSession({})
      await setGenericPassword(null)
    } catch (errorMessage) {
      setError(JSON.stringify(errorMessage, null, 2))
    }
  }

  return {
    loading,
    error,
    login,
    logout,
    loadVerificationCode,
    loginViaEmail,
  }
}
