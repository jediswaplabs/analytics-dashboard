import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const jediSwapClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.jediswap.xyz/graphql',
    headers: {
      // 'm-color': 'blue',
    },
  }),
  cache: new InMemoryCache({
    dataIdFromObject: (object) => {
      switch (object.__typename) {
        // case 'Block': {
        //   return object.id;
        // }
        // case 'Factory': {
        //   return object.id;
        // }
        case 'Token': {
          return `${object.id}${object.name}`
        }
        // case 'Pair': {
        //   return object.id;
        // }
        // case 'User': {
        //   return object.id;
        // }
        // case 'Transaction': {
        //   return object.id;
        // }
        case 'Swap': {
          return `${object.transactionHash}${object.timestamp}`
        }
        case 'Mint': {
          return `${object.transactionHash}${object.timestamp}`
        }
        case 'Burn': {
          return `${object.transactionHash}${object.timestamp}`
        }
        case 'LiquidityPosition': {
          return `${object.user.id}${object.pair.id}`
        }
        case 'LiquidityPositionSnapshot': {
          return `${object.id}${object.user.id}${object.timestamp}`
        }
        case 'ExchangeDayData': {
          return `${object.id}${object.date}`
        }
        case 'PairDayData': {
          return `${object.pairId}${object.date}`
        }
        case 'TokenDayData': {
          return `${object.tokenId}${object.date}`
        }
        default: {
          return object.id || object._id
        }
      }
    },
  }),
  shouldBatch: true,
})
