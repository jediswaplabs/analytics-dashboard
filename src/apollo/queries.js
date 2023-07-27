import gql from 'graphql-tag'

const ETH_USDC_PAIR_ADDRESS = '0x04d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a'

export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!) {
    blocks(first: 1, orderBy: "timestamp", orderByDirection: "asc", where: { timestampGt: $timestampFrom }) {
      id
      number
      timestamp
    }
  }
`

export const GET_LATEST_BLOCK = gql`
  query blocks {
    blocks(first: 1, orderBy: "timestamp", orderByDirection: "desc") {
      id
      number
      timestamp
    }
  }
`

export const GET_BLOCKS = (timestamps) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: "timestamp", orderByDirection: "asc", where: { timestampGt: ${timestamp} }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const TOP_LPS_PER_PAIRS = gql`
  query lps($pair: String!) {
    liquidityPositions(where: { pair: $pair }, orderBy: "liquidity_token_balance", orderByDirection: "desc", first: 10) {
      user {
        id
      }
      pair {
        id
      }
      liquidityTokenBalance
    }
  }
`

export const HOURLY_PAIR_RATES = (pairAddress, blocks) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    (block) => `
      t${block.timestamp}: pairs(where: { id:"${pairAddress}" }, block: { number: ${block.number} }) { 
        token0Price
        token1Price
      }
    `
  )

  queryString += '}'
  return gql(queryString)
}

export const SHARE_VALUE = (pairAddress, blocks) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    (block) => `
      t${block.timestamp}:pairs(where: {id: "${pairAddress}"}, block: { number: ${block.number} }) { 
        reserve0
        reserve1
        reserveUSD
        totalSupply 
        token0{
          derivedETH
        }
        token1{
          derivedETH
        }
      }
    `
  )
  queryString += ','
  queryString += blocks.map(
    (block) => `
      b${block.timestamp}: pairs(
        where: {id: "${ETH_USDC_PAIR_ADDRESS}"}
        block: { number: ${block.number} }
      ) { 
        token1Price
      }
    `
  )
  queryString += '}'
  return gql(queryString)
}

export const ETH_PRICE = (block) => {
  const queryString = block
    ? `
    query price {
      pairs(
        first: 1
        block: {number: ${block}}
        where: {id: "${ETH_USDC_PAIR_ADDRESS}"}
      ) {
        id
        token1Price
      }
    }
  `
    : `
    query price {
      pairs(
        first: 1
        where: {id: "${ETH_USDC_PAIR_ADDRESS}"}
      ) {
        id
        token1Price
      }
    }
  `
  return gql(queryString)
}

export const USER_MINTS_BUNRS_PER_PAIR = gql`
  query events($user: String!, $pair: String!) {
    mints(where: { to: $user, pair: $pair }) {
      amountUSD
      amount0
      amount1
      timestamp
      pair {
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
    burns(where: { sender: $user, pair: $pair }) {
      amountUSD
      amount0
      amount1
      timestamp
      pair {
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
  }
`

export const USER_HISTORY = gql`
  query snapshots($user: String!, $skip: Int!) {
    liquidityPositionSnapshots(first: 1000, skip: $skip, where: { user: $user }) {
      timestamp
      liquidityTokenBalance
      liquidityTokenTotalSupply
      reserve0
      reserve1
      token0PriceUsd
      token1PriceUsd
      id
      user {
        id
      }
      pair {
        id
        reserveUSD
        token0Price
        token1Price
        reserve0
        reserve1
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
  }
`

export const USER_LP_CONTEST_HISTORY = gql`
  query lpContestSnapshots($user: String!, $skip: Int!) {
    lpContestBlocks(first: 1000, skip: $skip, where: { user: $user }, orderBy: "block", orderByDirection: "desc") {
      block
      contestValue
      timestamp
      isEligible
    }
  }
`
export const USER_LP_CONTEST_PERCENTILE = gql`
  query lpContestPercentile($user: String!) {
    lpContestPercentile(where: { user: $user }) {
      percentileRank
      rank
      contestValue
    }
  }
`

export const USER_POSITIONS = gql`
  query liquidityPositions($user: String!) {
    liquidityPositions(where: { user: $user }) {
      user {
        id
      }
      pair {
        id
        reserve0
        reserve1
        reserveUSD
        token0 {
          id
          symbol
          derivedETH
        }
        token1 {
          id
          symbol
          derivedETH
        }
        totalSupply
      }
      liquidityTokenBalance
    }
  }
`

export const USER_TRANSACTIONS = gql`
  query transactions($user: String!) {
    mints(orderBy: "block_timestamp", orderByDirection: "desc", where: { to: $user }) {
      id
      transactionHash
      timestamp
      pair {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    burns(orderBy: "timestamp", orderByDirection: "desc", where: { sender: $user }) {
      id
      transactionHash
      timestamp
      pair {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      sender
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    swaps(orderBy: "timestamp", orderByDirection: "desc", where: { to: $user }) {
      id
      transactionHash
      timestamp
      pair {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`

export const USER_LP_CONTEST_TRANSACTIONS = gql`
  query transactions($user: String!) {
    mints(orderBy: "block_timestamp", orderByDirection: "desc", where: { to: $user }) {
      id
      transactionHash
      timestamp
      pair {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    burns(orderBy: "timestamp", orderByDirection: "desc", where: { sender: $user }) {
      id
      transactionHash
      timestamp
      pair {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      sender
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    swaps(orderBy: "timestamp", orderByDirection: "desc", where: { to: $user }) {
      id
      transactionHash
      timestamp
      pair {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`

export const PAIR_CHART = gql`
  query pairDayDatas($pairAddress: String!, $skip: Int!) {
    pairDayDatas(first: 1000, skip: $skip, orderBy: "date", orderByDirection: "asc", where: { pair: $pairAddress }) {
      pairId
      date
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      reserveUSD
      token0Price
      token1Price
    }
  }
`

export const PAIR_DAY_DATA_BULK = (pairs, startTimestamp) => {
  let pairsString = `[`
  pairs.map((pair) => {
    return (pairsString += `"${pair}"`)
  })
  pairsString += ']'
  const queryString = `
    query days {
      pairDayDatas(first: 1000, orderBy: "date", orderByDirection: "asc", where: { pairIn: ${pairsString}, dateGt: ${startTimestamp} }) {
        pairId
        date
        dailyVolumeToken0
        dailyVolumeToken1
        dailyVolumeUSD
        totalSupply
        reserveUSD
      }
    } 
`
  return gql(queryString)
}

export const GLOBAL_CHART = gql`
  query exchangeDayDatas($startTime: Int!, $skip: Int!) {
    exchangeDayDatas(first: 1000, skip: $skip, where: { dateGt: $startTime }, orderBy: "date", orderByDirection: "asc") {
      id
      date
      totalVolumeUSD
      dailyVolumeUSD
      dailyVolumeETH
      totalLiquidityUSD
      totalLiquidityETH
    }
  }
`

export const GLOBAL_DATA = (block) => {
  const queryString = ` query jediswapFactories {
      jediswapFactories${block ? `(block: { number: ${block}})` : ``} {
        id
        totalVolumeUSD
        totalVolumeETH
        untrackedVolumeUSD
        totalLiquidityUSD
        totalLiquidityETH
        txCount
        pairCount
      }
    }`
  return gql(queryString)
}

export const GLOBAL_TXNS = gql`
  query transactions($skip: Int!) {
    transactions(first: 20, skip: $skip, orderBy: "block_timestamp", orderByDirection: "desc") {
      mints {
        transactionHash
        timestamp
        to
        liquidity
        amount0
        amount1
        amountUSD
        pair {
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
          }
        }
      }
      swaps {
        transactionHash
        timestamp
        pair {
          token0 {
            id
            name
            symbol
          }
          token1 {
            id
            name
            symbol
          }
        }
        amount0In
        amount0Out
        amount1In
        amount1Out
        amountUSD
        to
      }
      burns {
        transactionHash
        timestamp
        to
        sender
        liquidity
        amount0
        amount1
        amountUSD
        pair {
          token0 {
            id
            name
            symbol
          }
          token1 {
            id
            name
            symbol
          }
        }
      }
    }
  }
`

export const ALL_TOKENS = gql`
  query tokens($skip: Int!) {
    tokens(first: 100, skip: $skip) {
      id
      name
      symbol
      totalLiquidity
    }
  }
`

export const TOKEN_SEARCH = gql`
  query tokens($value: String, $id: String) {
    asSymbol: tokens(where: { symbolContains: $value }, orderBy: "total_liquidity", orderByDirection: "desc") {
      id
      symbol
      name
      totalLiquidity
    }
    asName: tokens(where: { nameContains: $value }, orderBy: "total_liquidity", orderByDirection: "desc") {
      id
      symbol
      name
      totalLiquidity
    }
    asAddress: tokens(where: { id: $id }, orderBy: "total_liquidity", orderByDirection: "desc") {
      id
      symbol
      name
      totalLiquidity
    }
  }
`

export const PAIR_SEARCH = gql`
  query pairs($tokens: [String!], $id: String) {
    as0: pairs(where: { token0In: $tokens }) {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    as1: pairs(where: { token1In: $tokens }) {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    asAddress: pairs(where: { id: $id }) {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

export const ALL_PAIRS = gql`
  query pairs($skip: Int!) {
    pairs(first: 100, skip: $skip, orderBy: "tracked_reserve_eth", orderByDirection: "desc") {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

const PairFields = `
  fragment PairFields on Pair {
    id
    txCount
    token0 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
    }
    token1 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
    }
    reserve0
    reserve1
    reserveUSD
    totalSupply
    trackedReserveETH
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    token0Price
    token1Price
    createdAtTimestamp
  }
`

export const PAIRS_CURRENT = gql`
  query pairs {
    pairs(first: 200, orderBy: "reserve_usd", orderByDirection: "desc") {
      id
    }
  }
`

export const LP_CONTEST_DATA = gql`
  query contest {
    lpContests(orderBy: "contest_value", orderByDirection: "desc") {
      contestValue
      isEligible
      user {
        id
      }
      block
    }
  }
`

export const LP_CONTEST_NFT_RANK = gql`
  query lpcontestnftrank {
    lpContestNftRank {
      L1P1Start
      L1P1End
      L1P2Start
      L1P2End
      L1P3Start
      L1P3End
      L1P4Start
      L1P4End
      L1P5Start
      L1P5End
    }
  }
`

export const PAIR_DATA = (pairAddress, block) => {
  const queryString = `
    ${PairFields}
    query pairs {
      pairs(${block ? `block: {number: ${block}}` : ``} where: { id: "${pairAddress}"} ) {
        ...PairFields
      }
    }`
  return gql(queryString)
}

export const PAIRS_BULK = (pairs) => {
  let pairsString = `[`
  pairs.map((pair) => {
    return (pairsString += `"${pair}"`)
  })
  pairsString += ']'

  const queryString = `
    ${PairFields}
    query pairs {
      pairs(first: 100, where: { idIn: ${pairsString} }, orderBy: "tracked_reserve_eth", orderByDirection: "desc") {
        ...PairFields
      }
    }
  `
  return gql(queryString)
}

export const PAIRS_HISTORICAL_BULK = (block, pairs) => {
  let pairsString = `[`
  pairs.map((pair) => {
    return (pairsString += `"${pair}"`)
  })
  pairsString += ']'
  let queryString = `
  query pairs {
    pairs(first: 200, where: {idIn: ${pairsString}}, block: {number: ${block}}, orderBy: "tracked_reserve_eth", orderByDirection: "desc") {
      id
      reserveUSD
      trackedReserveETH
      volumeUSD
      untrackedVolumeUSD
    }
  }
  `
  return gql(queryString)
}

export const TOKEN_CHART = gql`
  query tokenDayDatas($tokenAddr: String!, $skip: Int!) {
    tokenDayDatas(first: 1000, skip: $skip, orderBy: "date", orderByDirection: "asc", where: { token: $tokenAddr }) {
      dayId
      date
      priceUSD
      totalLiquidityToken
      totalLiquidityUSD
      totalLiquidityETH
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
    }
  }
`

const TokenFields = `
  fragment TokenFields on Token {
    id
    name
    symbol
    derivedETH
    tradeVolume
    tradeVolumeUSD
    untrackedVolumeUSD
    totalLiquidity
    txCount
  }
`

// used for getting top tokens by daily volume
export const TOKEN_TOP_DAY_DATAS = gql`
  query tokenDayDatas($date: Int) {
    tokenDayDatas(first: 20, orderByDirection: "desc", orderBy: "day_id", where: { dateGt: $date }) {
      tokenId
      date
    }
  }
`

export const TOKENS_HISTORICAL_BULK = (tokens, block) => {
  let tokenString = `[`
  tokens.map((token) => {
    return (tokenString += `"${token}",`)
  })
  tokenString += ']'
  let queryString = `
  query tokens {
    tokens(first: 50, where: {idIn: ${tokenString}}, ${block ? 'block: {number: ' + block + '}' : ''}  ) {
      id
      name
      symbol
      derivedETH
      tradeVolume
      tradeVolumeUSD
      untrackedVolumeUSD
      totalLiquidity
      txCount
    }
  }
  `
  return gql(queryString)
}

export const TOKEN_DATA = (tokenAddress, block) => {
  const queryString = `
    ${TokenFields}
    query tokens {
      tokens(${block ? `block : {number: ${block}}` : ``} where: {id:"${tokenAddress}"}) {
        ...TokenFields
      }
      pairs0: pairs(where: {token0: "${tokenAddress}"}, first: 50, orderBy: "reserve_usd", orderByDirection: "desc"){
        id
      }
      pairs1: pairs(where: {token1: "${tokenAddress}"}, first: 50, orderBy: "reserve_usd", orderByDirection: "desc"){
        id
      }
    }
  `
  return gql(queryString)
}

export const FILTERED_TRANSACTIONS = gql`
  query ($allPairs: [String!]) {
    mints(first: 20, where: { pairIn: $allPairs }, orderBy: "timestamp", orderByDirection: "desc") {
      transactionHash
      timestamp
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    burns(first: 20, where: { pairIn: $allPairs }, orderBy: "timestamp", orderByDirection: "desc") {
      transactionHash
      timestamp
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      sender
      liquidity
      amount0
      amount1
      amountUSD
    }
    swaps(first: 30, where: { pairIn: $allPairs }, orderBy: "timestamp", orderByDirection: "desc") {
      transactionHash
      timestamp
      id
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`
