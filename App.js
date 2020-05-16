import 'react-native-gesture-handler'
import React from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, split, InMemoryCache } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { setContext } from 'apollo-link-context'
import { getGenericPassword } from 'react-native-keychain'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import Screens from '@/screens'

const GRAPHQL_ENDPOINT = 'rn-hasura-chat-app.herokuapp.com/v1/graphql'

const httpLink = createHttpLink({ uri: `https://${GRAPHQL_ENDPOINT}` })

const wsClient = new SubscriptionClient(`wss://${GRAPHQL_ENDPOINT}`, {
  reconnect: true,
  lazy: true,
  connectionParams: async () => {
    const { id } = getSyncProfile()
    const { username: idToken } = await getGenericPassword()

    return {
      headers: {
        authorization: `Bearer ${idToken}`,
        'x-hasura-user-id': id,
      },
    }
  },
})

const wsLink = new WebSocketLink(wsClient)

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

const authLink = setContext(async (_, { headers }) => {
  const { id } = getSyncProfile()
  const { username: idToken } = await getGenericPassword()

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${idToken}`,
      'x-hasura-user-id': id,
    },
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(splitLink),
})

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Screens wsClient={wsClient} />
    </ApolloProvider>
  )
}
