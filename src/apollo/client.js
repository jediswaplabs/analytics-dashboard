import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const jediSwapClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.jediswap.xyz/graphql',
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Block: {
        keyFields: ["id"]
      },
      Factory: {
        keyFields: ["id"]
      },
      Token: {
        keyFields: ["id", "name"]
      },
      Pair: {
        keyFields: ["id"]
      },
      User: {
        keyFields: ["id"]
      },
      Transaction: {
        keyFields: ["id"]
      },
      Swap: {
        keyFields: ["transactionHash", "timestamp"]
      },
      Mint: {
        keyFields: ["transactionHash", "timestamp"]
      },
      Burn: {
        keyFields: ["transactionHash", "timestamp"]
      },
      LiquidityPosition: {
        keyFields: ["id", "user", "pair"]
      },
      LiquidityPositionSnapshot: {
        keyFields: ["id", "user", "pair", "timestamp"]
      },
      ExchangeDayData: {
        keyFields: ["id", "date"]
      },
      PairDayData: {
        keyFields: ["pairId", "date"]
      },
      TokenDayData: {
        keyFields: ["tokenId", "date"]
      },
    }
  }),
  shouldBatch: true,
})

