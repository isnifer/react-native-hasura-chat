const request = require('request-promise')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp(functions.config().firebase)

const updateClaims = uid =>
  admin.auth().setCustomUserClaims(uid, {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-user-id': uid,
    },
  })

exports.signup = functions.auth.user().onCreate(user => updateClaims(user.uid))

exports.refreshToken = functions.https.onRequest((req, res) => {
  console.log('TOKEN REFRESH', req.query.uid) // eslint-disable-line no-console

  cors(req, res, async () => {
    try {
      await updateClaims(req.query.uid)
      res.status(200).send({ success: true })
    } catch (error) {
      console.error('REFRESH ERROR', error) // eslint-disable-line no-console
      res.status(400).send(error)
    }
  })
})
