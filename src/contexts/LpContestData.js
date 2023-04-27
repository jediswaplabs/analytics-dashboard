import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import { jediSwapClient } from '../apollo/client'
import { LP_CONTEST_DATA } from '../apollo/queries'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { convertHexToDecimal } from '../utils'

const UPDATE = 'UPDATE'
const UPDATE_PLAYERS_DATA = 'UPDATE_PLAYERS_DATA'

dayjs.extend(utc)

const LpContestDataContext = createContext()

function useLpContestDataContext() {
  return useContext(LpContestDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { playerAddress, data } = payload
      return {
        ...state,
        [playerAddress]: {
          ...state?.[playerAddress],
          ...data,
        },
      }
    }

    case UPDATE_PLAYERS_DATA: {
      const { players } = payload
      let added = {}
      players.map((data) => {
        return (added[data?.user?.id] = data)
      })
      return {
        ...state,
        ...added,
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})

  // update pair specific data
  const update = useCallback((playerAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        playerAddress,
        data,
      },
    })
  }, [])

  const updatePlayersData = useCallback((players) => {
    dispatch({
      type: UPDATE_PLAYERS_DATA,
      payload: {
        players,
      },
    })
  }, [])

  return (
    <LpContestDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updatePlayersData,
          },
        ],
        [state, update, updatePlayersData]
      )}
    >
      {children}
    </LpContestDataContext.Provider>
  )
}

export function Updater() {
  const [, { updatePlayersData }] = useLpContestDataContext()
  useEffect(() => {
    const collectUserIds = (data = []) => data.map((item) => item?.user?.id).filter(Boolean)
    const convertIdsToDecimal = (data) =>
      data.reduce((acc, addr) => {
        const convertedAddress = convertHexToDecimal(addr)
        if (convertedAddress) {
          acc[addr] = convertedAddress
        }
        return acc
      }, {})

    async function getData() {
      let {
        data: { lpContests },
      } = await jediSwapClient.query({
        query: LP_CONTEST_DATA,
        fetchPolicy: 'cache-first',
      })
      let payloadData = lpContests
      const userIds = collectUserIds(lpContests)
      if (!userIds?.length) {
        updatePlayersData(payloadData)
        return
      }
      const convertedAddressed = convertIdsToDecimal(userIds)
      try {
        const response = await fetch('https://app.starknet.id/api/indexer/addrs_to_domains', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addresses: Object.values(convertedAddressed).filter(Boolean),
          }),
        })
        const processedResponse = await response.json()
        const domains = processedResponse.reduce((acc, userData) => {
          if (userData.domain && userData.address) {
            acc[userData.address] = userData.domain
          }
          return acc
        }, {})

        payloadData.forEach((data) => {
          data.starknetIdDomain = domains?.[convertedAddressed?.[data?.user?.id]] || '' // Здесь добавляется новое поле
        })
      } catch (e) {
      } finally {
        updatePlayersData(payloadData)
      }
    }
    getData()
  }, [updatePlayersData])
  return null
}

export function useAllLpContestData() {
  const [state] = useLpContestDataContext()
  return state || {}
}
