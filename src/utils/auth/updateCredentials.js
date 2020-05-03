import Auth0 from 'react-native-auth0'
import { setGenericPassword } from 'react-native-keychain'
import authCredentials from '@/constants/auth0'
import { setSyncProfile } from './syncProfile'

const auth0 = new Auth0(authCredentials)

export default async function updateCredentials({ idToken, accessToken, refreshToken }) {
  const { updatedAt, ...userInfo } = await auth0.auth.userInfo({ token: accessToken })

  const userprofile = {
    id: userInfo['https://hasura.io/jwt/claims']['x-hasura-user-id'],
    email: userInfo.name,
    name: userInfo.nickname,
    picture: userInfo.picture,
  }

  setSyncProfile(userprofile)

  return setGenericPassword(
    idToken,
    JSON.stringify({ accessToken, refreshToken, updatedAt, userprofile })
  )
}
