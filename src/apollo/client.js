import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const jediSwapClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.jediswap.xyz/graphql',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

