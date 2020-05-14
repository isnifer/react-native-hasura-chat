import { useState } from 'react'
import { Keyboard } from 'react-native'
import auth from '@react-native-firebase/auth'
import { resetGenericPassword } from 'react-native-keychain'
import { setSyncProfile } from '@/utils/auth/syncProfile'
import { UNAUTH_REASONS } from '@/constants'

export default function useAuth({ setUnauthReason } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [confirm, setConfirm] = useState()

  // Handle the button press
  async function getVerificationCode(phone) {
    Keyboard.dismiss()

    const confirmation = await auth().signInWithPhoneNumber(phone)
    setConfirm(confirmation)

    return setUnauthReason(UNAUTH_REASONS.VERIFICATION_CODE)
  }

  async function confirmVerificationCode(code) {
    try {
      await confirm.confirm(code)
    } catch (e) {
      setUnauthReason(UNAUTH_REASONS.INVALID_VERIFICATION_CODE)
    }
  }

  async function logout() {
    try {
      setLoading(true)
      await auth().signOut()
      await resetGenericPassword()
      setSyncProfile({})
    } catch (errorMessage) {
      setError(JSON.stringify(errorMessage, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getVerificationCode,
    confirmVerificationCode,
    logout,
  }
}
