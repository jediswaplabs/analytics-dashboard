export const timeframeOptions = {
  WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  // YEAR: '1 year',
  HALF_YEAR: '6 months',
  ALL_TIME: 'All time',
}

// token list urls to fetch tokens from - use for warnings on tokens and pairs
export const SUPPORTED_LIST_URLS__NO_ENS = [
    "https://gateway.ipfs.io/ipns/tokens.jediswap.xyz"
]

// hide from overview list
export const TOKEN_BLACKLIST = []

export const TOKEN_WHITELIST = [
    '0xda114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
    '0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    '0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    '0x3fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
    '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
]

// pair blacklist
export const PAIR_BLACKLIST = [

]

export const PAIR_WHITELIST = [
    "0x4d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a",
    "0x45e7131d776dddc137e30bdd490b431c7144677e97bf9369f629ed8d3fb7dd6",
    "0x5801bdad32f343035fb242e98d1e9371ae85bc1543962fedea16c59b35bd19b",
    "0x7e2a13b40fc1119ec55e0bcf9428eedaa581ab3c924561ad4e955f95da63138",
    "0xcfd39f5244f7b617418c018204a8a9f9a7f72e71f0ef38f968eeb2a9ca302b",
    "0xf0f5b3eed258344152e1f17baf84a2e1b621cd754b625bec169e8595aea767",
    "0x260e98362e0949fefff8b4de85367c035e44f734c9f8069b6ce2075ae86b45c",
    "0x5a8054e5ca0b277b295a830e53bd71a6a6943b42d0dbb22329437522bc80c8",
    "0x39c183c8e5a2df130eefa6fbaa3b8aad89b29891f6272cb0c90deaa93ec6315",
    "0x44d13ad98a46fd2322ef2637e5e4c292ce8822f47b7cb9a1d581176a801c1a0",
    "0x4d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a"
]

// warnings to display if page contains info about blocked token
export const BLOCKED_WARNINGS = {

}

/**
 * For tokens that cause erros on fee calculations
 */
export const FEE_WARNING_TOKENS = []

export const UNTRACKED_COPY = 'Derived USD values may be inaccurate without liquid stablecoin or ETH pairings.'

// pairs that should be tracked but arent due to lag in subgraph
export const TRACKED_OVERRIDES_PAIRS = [

]

// tokens that should be tracked but arent due to lag in subgraph
// all pairs that include token will be tracked
export const TRACKED_OVERRIDES_TOKENS = []
