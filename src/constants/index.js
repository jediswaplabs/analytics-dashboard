import { isStagingEnvironment } from '../utils'

const getDefaultTokensListUrl = () => {
  const getUrl = (env = '', name = 'jediswap-default.tokenlist.json') => `https://static.${env ? `${env}.` : ''}jediswap.xyz/tokens-list/${name}`

  if (isStagingEnvironment()) {
    return getUrl('staging')
  }

  return getUrl()
}

export const timeframeOptions = {
  WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  // YEAR: '1 year',
  HALF_YEAR: '6 months',
  ALL_TIME: 'All time',
}

// token list urls to fetch tokens from - use for warnings on tokens and pairs
export const SUPPORTED_LIST_URLS__NO_ENS = [getDefaultTokensListUrl(), 'https://cloudflare-ipfs.com/ipns/tokens.jediswap.xyz/']

export const DEFAULT_TOKENS_WHITELIST = [
  '0xda114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
  '0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
  '0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
  '0x3fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
  '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
]

// warnings to display if page contains info about blocked token
export const BLOCKED_WARNINGS = {}

/**
 * For tokens that cause erros on fee calculations
 */
export const FEE_WARNING_TOKENS = []

export const UNTRACKED_COPY = 'Derived USD values may be inaccurate without liquid stablecoin or ETH pairings.'

// pairs that should be tracked but arent due to lag in subgraph
export const TRACKED_OVERRIDES_PAIRS = []

// tokens that should be tracked but arent due to lag in subgraph
// all pairs that include token will be tracked
export const TRACKED_OVERRIDES_TOKENS = []
