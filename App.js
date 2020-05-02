import React from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, split, InMemoryCache } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'
import { setContext } from 'apollo-link-context'
import ConnectyCube from 'react-native-connectycube'
import Screens from '@/screens'

const httpLink = createHttpLink({ uri: 'https://rn-hasura-chat-app.herokuapp.com/v1/graphql' })

const wsLink = new WebSocketLink({
  uri: 'ws://rn-hasura-chat-app.herokuapp.com/v1/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': process.env.CHAT_APP_X_HASURA_ID,
      },
    },
  },
})

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

const authLink = setContext(async (_, { headers }) => ({
  headers: {
    ...headers,
    'x-hasura-admin-secret': process.env.CHAT_APP_X_HASURA_ID,
  },
}))

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(splitLink),
})

const CREDENTIALS = {
  appId: process.env.CONNECTYCUBE_APP_ID,
  authKey: process.env.CONNECTYCUBE_AUTH_KEY,
  authSecret: process.env.CONNECTYCUBE_AUTH_SECRET,
}

ConnectyCube.init(CREDENTIALS, { debug: { mode: 1 } })

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Screens />
    </ApolloProvider>
  )
}
