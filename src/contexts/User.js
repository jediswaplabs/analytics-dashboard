import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { usePairData } from './PairData'
import { jediSwapClient } from '../apollo/client'
import {
  USER_TRANSACTIONS,
  USER_POSITIONS,
  USER_HISTORY,
  PAIR_DAY_DATA_BULK,
  USER_LP_CONTEST_TRANSACTIONS,
  USER_VOLUME_CONTEST_TRANSACTIONS,
  USER_LP_CONTEST_HISTORY,
  USER_LP_CONTEST_PERCENTILE,
} from '../apollo/queries'
import { useTimeframe, useStartTimestamp } from './Application'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEthPrice } from './GlobalData'
import { getLPReturnsOnPair, getHistoricalPairReturns } from '../utils/returns'
import { timeframeOptions } from '../constants'
import { convertDateToUnixFormat } from '../utils'

dayjs.extend(utc)

const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS'
const UPDATE_LP_CONTEST_TRANSACTIONS = 'UPDATE_LP_CONTEST_TRANSACTIONS'
const UPDATE_VOLUME_CONTEST_TRANSACTIONS = 'UPDATE_VOLUME_CONTEST_TRANSACTIONS'
const UPDATE_POSITIONS = 'UPDATE_POSITIONS '
const UPDATE_MINING_POSITIONS = 'UPDATE_MINING_POSITIONS'
const UPDATE_USER_POSITION_HISTORY = 'UPDATE_USER_POSITION_HISTORY'
const UPDATE_LP_CONTEST_USER_POSITION_HISTORY = 'UPDATE_LP_CONTEST_USER_POSITION_HISTORY'
const UPDATE_LP_CONTEST_PERCENTILE = 'UPDATE_LP_CONTEST_PERCENTILE'
const UPDATE_USER_PAIR_RETURNS = 'UPDATE_USER_PAIR_RETURNS'

const TRANSACTIONS_KEY = 'TRANSACTIONS_KEY'
const LP_CONTEST_TRANSACTIONS_KEY = 'LP_CONTEST_TRANSACTIONS_KEY'
const VOLUME_CONTEST_TRANSACTIONS_KEY = 'VOLUME_CONTEST_TRANSACTIONS_KEY'
const POSITIONS_KEY = 'POSITIONS_KEY'
const MINING_POSITIONS_KEY = 'MINING_POSITIONS_KEY'
const USER_SNAPSHOTS = 'USER_SNAPSHOTS'
const LP_CONTEST_USER_SNAPSHOTS = 'LP_CONTEST_USER_SNAPSHOTS'
const LP_CONTEST_PERCENTILE = 'LP_CONTEST_PERCENTILE'
const USER_PAIR_RETURNS_KEY = 'USER_PAIR_RETURNS_KEY'

const UserContext = createContext()

function useUserContext() {
  return useContext(UserContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_TRANSACTIONS: {
      const { account, transactions } = payload
      return {
        ...state,
        [account]: {
          ...state?.[account],
          [TRANSACTIONS_KEY]: transactions,
        },
      }
    }
    case UPDATE_LP_CONTEST_TRANSACTIONS: {
      const { account, transactions } = payload
      return {
        ...state,
        [account]: {
          ...state?.[account],
          [LP_CONTEST_TRANSACTIONS_KEY]: transactions,
        },
      }
    }
    case UPDATE_LP_CONTEST_PERCENTILE: {
      const { account, percentile } = payload
      return {
        ...state,
        [account]: {
          ...state?.[account],
          [LP_CONTEST_PERCENTILE]: percentile,
        },
      }
    }
    case UPDATE_VOLUME_CONTEST_TRANSACTIONS: {
      const { account, transactions } = payload
      return {
        ...state,
        [account]: {
          ...state?.[account],
          [VOLUME_CONTEST_TRANSACTIONS_KEY]: transactions,
        },
      }
    }
    case UPDATE_POSITIONS: {
      const { account, positions } = payload
      return {
        ...state,
        [account]: { ...state?.[account], [POSITIONS_KEY]: positions },
      }
    }
    case UPDATE_MINING_POSITIONS: {
      const { account, miningPositions } = payload
      return {
        ...state,
        [account]: { ...state?.[account], [MINING_POSITIONS_KEY]: miningPositions },
      }
    }

    case UPDATE_USER_POSITION_HISTORY: {
      const { account, historyData } = payload
      return {
        ...state,
        [account]: { ...state?.[account], [USER_SNAPSHOTS]: historyData },
      }
    }
    case UPDATE_LP_CONTEST_USER_POSITION_HISTORY: {
      const { account, historyData } = payload
      return {
        ...state,
        [account]: { ...state?.[account], [LP_CONTEST_USER_SNAPSHOTS]: historyData },
      }
    }
    case UPDATE_USER_PAIR_RETURNS: {
      const { account, pairAddress, data } = payload
      return {
        ...state,
        [account]: {
          ...state?.[account],
          [USER_PAIR_RETURNS_KEY]: {
            ...state?.[account]?.[USER_PAIR_RETURNS_KEY],
            [pairAddress]: data,
          },
        },
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

const INITIAL_STATE = {}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const updateTransactions = useCallback((account, transactions) => {
    dispatch({
      type: UPDATE_TRANSACTIONS,
      payload: {
        account,
        transactions,
      },
    })
  }, [])

  const updateLpContestTransactions = useCallback((account, transactions) => {
    dispatch({
      type: UPDATE_LP_CONTEST_TRANSACTIONS,
      payload: {
        account,
        transactions,
      },
    })
  }, [])

  const updateLpContestPercentile = useCallback((account, percentile) => {
    dispatch({
      type: UPDATE_LP_CONTEST_PERCENTILE,
      payload: {
        account,
        percentile,
      },
    })
  }, [])

  const updateVolumeContestTransactions = useCallback((account, transactions) => {
    dispatch({
      type: UPDATE_VOLUME_CONTEST_TRANSACTIONS,
      payload: {
        account,
        transactions,
      },
    })
  }, [])

  const updatePositions = useCallback((account, positions) => {
    dispatch({
      type: UPDATE_POSITIONS,
      payload: {
        account,
        positions,
      },
    })
  }, [])

  const updateMiningPositions = useCallback((account, miningPositions) => {
    dispatch({
      type: UPDATE_MINING_POSITIONS,
      payload: {
        account,
        miningPositions,
      },
    })
  }, [])

  const updateUserSnapshots = useCallback((account, historyData) => {
    dispatch({
      type: UPDATE_USER_POSITION_HISTORY,
      payload: {
        account,
        historyData,
      },
    })
  }, [])

  const updateLpContestUserSnapshots = useCallback((account, historyData) => {
    dispatch({
      type: UPDATE_LP_CONTEST_USER_POSITION_HISTORY,
      payload: {
        account,
        historyData,
      },
    })
  }, [])

  const updateUserPairReturns = useCallback((account, pairAddress, data) => {
    dispatch({
      type: UPDATE_USER_PAIR_RETURNS,
      payload: {
        account,
        pairAddress,
        data,
      },
    })
  }, [])

  return (
    <UserContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateTransactions,
            updateVolumeContestTransactions,
            updateLpContestTransactions,
            updatePositions,
            updateMiningPositions,
            updateUserSnapshots,
            updateLpContestUserSnapshots,
            updateUserPairReturns,
            updateLpContestPercentile,
          },
        ],
        [
          state,
          updateTransactions,
          updateLpContestTransactions,
          updateVolumeContestTransactions,
          updatePositions,
          updateMiningPositions,
          updateUserSnapshots,
          updateLpContestUserSnapshots,
          updateUserPairReturns,
          updateLpContestPercentile,
        ]
      )}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserTransactions(account) {
  const [state, { updateTransactions }] = useUserContext()
  const transactions = state?.[account]?.[TRANSACTIONS_KEY]
  useEffect(() => {
    async function fetchData(account) {
      try {
        let result = await jediSwapClient.query({
          query: USER_TRANSACTIONS,
          variables: {
            user: account,
          },
          fetchPolicy: 'no-cache',
        })
        if (result?.data) {
          updateTransactions(account, result?.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!transactions && account) {
      fetchData(account)
    }
  }, [account, transactions, updateTransactions])

  return transactions || {}
}

export function useUserLpCampaignTransactions(account) {
  const [state, { updateLpContestTransactions }] = useUserContext()
  const transactions = state?.[account]?.[LP_CONTEST_TRANSACTIONS_KEY]
  useEffect(() => {
    async function fetchData(account) {
      try {
        let result = await jediSwapClient.query({
          query: USER_LP_CONTEST_TRANSACTIONS,
          variables: {
            user: account,
          },
          fetchPolicy: 'no-cache',
        })
        if (result?.data) {
          updateLpContestTransactions(account, result?.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!transactions && account) {
      fetchData(account)
    }
  }, [account, transactions, updateLpContestTransactions])

  return transactions || {}
}

export function useUserVolumeCampaignTransactions({ account, timestampGte, timestampLte }) {
  const [state, { updateVolumeContestTransactions }] = useUserContext()
  const transactions = state?.[account]?.[VOLUME_CONTEST_TRANSACTIONS_KEY]
  useEffect(() => {
    async function fetchData(account) {
      try {
        let result = await jediSwapClient.query({
          query: USER_VOLUME_CONTEST_TRANSACTIONS({ account, timestampGte, timestampLte }),
          fetchPolicy: 'no-cache',
        })
        if (result?.data) {
          updateVolumeContestTransactions(account, result?.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!transactions && account) {
      fetchData(account)
    }
  }, [account, transactions, updateVolumeContestTransactions])

  return transactions || {}
}

/**
 * Store all the snapshots of liquidity activity for this account.
 * Each snapshot is a moment when an LP position was created or updated.
 * @param {*} account
 */
export function useUserSnapshots(account) {
  const [state, { updateUserSnapshots }] = useUserContext()
  const snapshots = state?.[account]?.[USER_SNAPSHOTS]

  useEffect(() => {
    async function fetchData() {
      try {
        let skip = 0
        let allResults = []
        let found = false
        while (!found) {
          let result = await jediSwapClient.query({
            query: USER_HISTORY,
            variables: {
              skip: skip,
              user: account,
            },
            fetchPolicy: 'cache-first',
          })
          const data = result.data.liquidityPositionSnapshots.map((position) => {
            const timestamp = convertDateToUnixFormat(position.timestamp)
            return {
              ...position,
              timestamp,
            }
          })
          allResults = allResults.concat(data)
          if (data.length < 1000) {
            found = true
          } else {
            skip += 1000
          }
        }
        if (allResults) {
          updateUserSnapshots(account, allResults)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!snapshots && account) {
      fetchData()
    }
  }, [account, snapshots, updateUserSnapshots])

  return snapshots
}

export function useLpContestUserSnapshots(account) {
  const [state, { updateLpContestUserSnapshots }] = useUserContext()
  const snapshots = state?.[account]?.[LP_CONTEST_USER_SNAPSHOTS]

  useEffect(() => {
    async function fetchData() {
      try {
        let skip = 0
        let allResults = []
        let found = false
        while (!found) {
          const result = await jediSwapClient.query({
            query: USER_LP_CONTEST_HISTORY,
            variables: {
              user: account,
              skip,
            },
            fetchPolicy: 'cache-first',
          })

          const processedResult = result?.data?.lpContestBlocks

          allResults = allResults.concat(processedResult)
          if (processedResult.length < 1000) {
            found = true
          } else {
            skip += 1000
          }
        }
        if (allResults) {
          updateLpContestUserSnapshots(account, allResults)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!snapshots && account) {
      fetchData()
    }
  }, [account, snapshots, updateLpContestUserSnapshots])

  return snapshots
}

export function useLpContestPercentile(account) {
  const [state, { updateLpContestPercentile }] = useUserContext()
  const percentile = state?.[account]?.[LP_CONTEST_PERCENTILE]

  useEffect(() => {
    async function fetchData(account) {
      try {
        let result = await jediSwapClient.query({
          query: USER_LP_CONTEST_PERCENTILE,
          variables: {
            user: account,
          },
          fetchPolicy: 'no-cache',
        })
        if (result?.data?.lpContestPercentile) {
          updateLpContestPercentile(account, result.data.lpContestPercentile)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!percentile && account) {
      fetchData(account)
    }
  }, [account, percentile, updateLpContestPercentile])

  return percentile
}

/**
 * For a given position (data about holding) and user, get the chart
 * data for the fees and liquidity over time
 * @param {*} position
 * @param {*} account
 */
export function useUserPositionChart(position, account) {
  const pairAddress = position?.pair?.id
  const [state, { updateUserPairReturns }] = useUserContext()

  // get oldest date of data to fetch
  const startDateTimestamp = useStartTimestamp()

  // get users adds and removes on this pair
  const snapshots = useUserSnapshots(account)
  const pairSnapshots =
    snapshots &&
    position &&
    snapshots.filter((currentSnapshot) => {
      return currentSnapshot.pair.id === position.pair.id
    })

  // get data needed for calculations
  const currentPairData = usePairData(pairAddress)
  const [currentETHPrice] = useEthPrice()

  // formatetd array to return for chart data
  const formattedHistory = state?.[account]?.[USER_PAIR_RETURNS_KEY]?.[pairAddress]

  useEffect(() => {
    async function fetchData() {
      let fetchedData = await getHistoricalPairReturns(startDateTimestamp, currentPairData, pairSnapshots, currentETHPrice)
      updateUserPairReturns(account, pairAddress, fetchedData)
    }
    if (
      account &&
      startDateTimestamp &&
      pairSnapshots &&
      !formattedHistory &&
      currentPairData &&
      Object.keys(currentPairData).length > 0 &&
      pairAddress &&
      currentETHPrice
    ) {
      fetchData()
    }
  }, [
    account,
    startDateTimestamp,
    pairSnapshots,
    formattedHistory,
    pairAddress,
    currentPairData,
    currentETHPrice,
    updateUserPairReturns,
    position.pair.id,
  ])

  return formattedHistory
}

/**
 * For each day starting with min(first position timestamp, beginning of time window),
 * get total liquidity supplied by user in USD. Format in array with date timestamps
 * and usd liquidity value.
 */
export function useUserLiquidityChart(account) {
  const history = useUserSnapshots(account)
  // formatetd array to return for chart data
  const [formattedHistory, setFormattedHistory] = useState()

  const [startDateTimestamp, setStartDateTimestamp] = useState()
  const [activeWindow] = useTimeframe()

  // monitor the old date fetched
  useEffect(() => {
    const utcEndTime = dayjs.utc()
    // based on window, get starttime
    let utcStartTime
    switch (activeWindow) {
      case timeframeOptions.WEEK:
        utcStartTime = utcEndTime.subtract(1, 'week').startOf('day')
        break
      case timeframeOptions.ALL_TIME:
        utcStartTime = utcEndTime.subtract(1, 'year')
        break
      default:
        utcStartTime = utcEndTime.subtract(1, 'year').startOf('year')
        break
    }
    let startTime = utcStartTime.unix() - 1
    if ((activeWindow && startTime < startDateTimestamp) || !startDateTimestamp) {
      setStartDateTimestamp(startTime)
    }
  }, [activeWindow, startDateTimestamp])

  useEffect(() => {
    async function fetchData() {
      let dayIndex = parseInt(startDateTimestamp / 86400) // get unique day bucket unix
      const currentDayIndex = parseInt(dayjs.utc().unix() / 86400)
      // sort snapshots in order
      let sortedPositions = history.sort((a, b) => {
        return parseInt(a.timestamp) > parseInt(b.timestamp) ? 1 : -1
      })
      // if UI start time is > first position time - bump start index to this time
      if (parseInt(sortedPositions[0].timestamp) > dayIndex) {
        dayIndex = parseInt(parseInt(sortedPositions[0].timestamp) / 86400)
      }

      const dayTimestamps = []
      // get date timestamps for all days in view
      while (dayIndex < currentDayIndex) {
        dayTimestamps.push(parseInt(dayIndex) * 86400)
        dayIndex = dayIndex + 1
      }

      const pairs = history.reduce((pairList, position) => {
        return [...pairList, position.pair.id]
      }, [])

      // get all day datas where date is in this list, and pair is in pair list
      let {
        data: { pairDayDatas },
      } = await jediSwapClient.query({
        query: PAIR_DAY_DATA_BULK(pairs, startDateTimestamp),
      })

      pairDayDatas = pairDayDatas.map((data) => {
        return {
          ...data,
          date: convertDateToUnixFormat(data.date),
        }
      })

      const formattedHistory = []

      // map of current pair => ownership %
      const ownershipPerPair = {}
      for (const index in dayTimestamps) {
        const dayTimestamp = dayTimestamps[index]
        const timestampCeiling = dayTimestamp + 86400

        // cycle through relevant positions and update ownership for any that we need to
        const relevantPositions = history.filter((snapshot) => {
          return snapshot.timestamp < timestampCeiling && snapshot.timestamp > dayTimestamp
        })
        for (const index in relevantPositions) {
          const position = relevantPositions[index]
          // case where pair not added yet
          if (!ownershipPerPair[position.pair.id]) {
            ownershipPerPair[position.pair.id] = {
              lpTokenBalance: position.liquidityTokenBalance,
              timestamp: position.timestamp,
            }
          }
          // case where more recent timestamp is found for pair
          if (ownershipPerPair[position.pair.id] && ownershipPerPair[position.pair.id].timestamp < position.timestamp) {
            ownershipPerPair[position.pair.id] = {
              lpTokenBalance: position.liquidityTokenBalance,
              timestamp: position.timestamp,
            }
          }
        }

        const relavantDayDatas = Object.keys(ownershipPerPair).map((pairAddress) => {
          // find last day data after timestamp update
          const dayDatasForThisPair = pairDayDatas.filter((dayData) => {
            return dayData.pairId === pairAddress
          })
          // find the most recent reference to pair liquidity data
          let mostRecent = dayDatasForThisPair[0]
          for (const index in dayDatasForThisPair) {
            const dayData = dayDatasForThisPair[index]
            if (dayData.date < dayTimestamp && dayData.date > mostRecent.date) {
              mostRecent = dayData
            }
          }
          return mostRecent
        })

        // now cycle through pair day datas, for each one find usd value = ownership[address] * reserveUSD
        const dailyUSD = relavantDayDatas.reduce((totalUSD, dayData) => {
          if (dayData) {
            return (totalUSD =
              totalUSD +
              (ownershipPerPair[dayData.pairId]
                ? (parseFloat(ownershipPerPair[dayData.pairId].lpTokenBalance) / parseFloat(dayData.totalSupply)) * parseFloat(dayData.reserveUSD)
                : 0))
          } else {
            return totalUSD
          }
        }, 0)

        formattedHistory.push({
          date: dayTimestamp,
          valueUSD: dailyUSD,
        })
      }

      setFormattedHistory(formattedHistory)
    }
    if (history && startDateTimestamp && history.length > 0) {
      fetchData()
    }
  }, [history, startDateTimestamp])

  return formattedHistory
}

export function useLpContestUserLiquidityChart(account) {
  const history = useLpContestUserSnapshots(account)
  let formattedHistory
  if (history) {
    formattedHistory = history
      .map((item) => {
        if (!(item?.timestamp && item?.contestValue)) {
          return false
        }
        return {
          date: convertDateToUnixFormat(item.timestamp),

          value: Number(item.contestValue).toFixed(),
        }
      })
      .filter(Boolean)
  }

  return formattedHistory
}

export function useUserPositions(account) {
  const [state, { updatePositions }] = useUserContext()
  const positions = state?.[account]?.[POSITIONS_KEY]

  const snapshots = useUserSnapshots(account)
  const [ethPrice] = useEthPrice()

  useEffect(() => {
    async function fetchData(account) {
      try {
        let result = await jediSwapClient.query({
          query: USER_POSITIONS,
          variables: {
            user: account,
          },
          fetchPolicy: 'cache-first',
        })
        if (result?.data?.liquidityPositions) {
          let formattedPositions = await Promise.all(
            result?.data?.liquidityPositions.map(async (positionData) => {
              const returnData = await getLPReturnsOnPair(account, positionData.pair, ethPrice, snapshots)
              return {
                ...positionData,
                ...returnData,
              }
            })
          )
          updatePositions(account, formattedPositions)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!positions && account && ethPrice && snapshots) {
      fetchData(account)
    }
  }, [account, positions, updatePositions, ethPrice, snapshots])

  return positions
}
