import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { jediSwapClient } from '../apollo/client'
import { USER_VOLUME_CONTEST_DATA } from '../apollo/queries'
import { isEmpty } from 'lodash'

const UPDATE_PLAYER_DATA = 'UPDATE_PLAYER_DATA'

dayjs.extend(utc)

const VolumeContestDataContext = createContext()

function useVolumeContestDataContext() {
  return useContext(VolumeContestDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_PLAYER_DATA: {
      const { playerAddress, data } = payload
      return {
        ...state,
        players: {
          ...(state?.players ?? {}),
          [playerAddress]: {
            ...state?.players?.[playerAddress],
            ...data,
          },
        },
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})

  const updatePlayerData = useCallback((playerAddress, data) => {
    dispatch({
      type: UPDATE_PLAYER_DATA,
      payload: {
        playerAddress,
        data,
      },
    })
  }, [])

  return (
    <VolumeContestDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updatePlayerData,
          },
        ],
        [state, updatePlayerData]
      )}
    >
      {children}
    </VolumeContestDataContext.Provider>
  )
}

export function useVolumeContestUserData(account) {
  const [state, { updatePlayerData }] = useVolumeContestDataContext()
  const userData = state?.players?.[account]

  useEffect(() => {
    async function fetchData(account) {
      try {
        let result = await jediSwapClient.query({
          query: USER_VOLUME_CONTEST_DATA(account),
          fetchPolicy: 'no-cache',
        })
        if (!isEmpty(result?.data?.volumeContest)) {
          updatePlayerData(account, result.data.volumeContest)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (isEmpty(userData) && account) {
      fetchData(account)
    }
  }, [account, userData, updatePlayerData])

  return userData
}

export function useAllVolumeContestData() {
  const [state] = useVolumeContestDataContext()
  return state || {}
}
