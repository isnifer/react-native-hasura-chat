import { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { resetGenericPassword } from 'react-native-keychain'
import { setSyncProfile } from '@/utils/auth/syncProfile'

export default function useAuth({ setUnauthReason } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const [confirm, setConfirm] = useState()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  // Handle the button press
  async function signInWithPhoneNumber() {
    if (!code) {
      const confirmation = await auth().signInWithPhoneNumber(phone)
      return setConfirm(confirmation)
    }

    return confirmCode()
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code)
    } catch (e) {
      setUnauthReason('Invalid confirmation code')
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
    phone,
    setPhone,
    code,
    setCode,
    signInWithPhoneNumber,
    logout,
  }
}
