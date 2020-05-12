import auth from '@react-native-firebase/auth'
import { getGenericPassword, setGenericPassword } from 'react-native-keychain'
import { setSyncProfile } from './syncProfile'

const getAPIUrl = url => `https://us-central1-react-native-hasura-chat.cloudfunctions.net/${url}`

export default async function updateCredentials(firebaseUser) {
  const token = await firebaseUser.getIdToken()
  const idToken = await auth()
    .currentUser.getIdTokenResult()
    .then(result => {
      if (result.claims['https://hasura.io/jwt/claims']) {
        return token
      }

      return fetch(`${getAPIUrl('refreshToken')}?uid=${firebaseUser.uid}`).then(res => {
        if (res.status === 200) {
          return firebaseUser.getIdToken(true)
        }

        return res.json()
      })
    })

  const userprofile = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    phoneNumber: firebaseUser.phoneNumber,
    name: firebaseUser.displayName,
    picture: firebaseUser.photoURL,
  }

  setSyncProfile(userprofile)

  const { username, password } = await getGenericPassword()
  if (idToken !== username && firebaseUser.metadata.lastSignInTime !== password) {
    return setGenericPassword(idToken, firebaseUser.metadata.lastSignInTime)
  }
}
