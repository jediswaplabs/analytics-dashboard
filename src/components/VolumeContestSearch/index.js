import React, { useState, useEffect, useMemo, useCallback } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import Switch from 'react-switch'
import 'react-tooltip/dist/react-tooltip.css'

import { Tooltip as ReactTooltip } from 'react-tooltip'
import { Search as SearchIcon } from 'react-feather'

import { CustomLink } from '../Link'
import { Divider, EmptyCard } from '..'
import { formattedNum, isStarknetAddress, shortenStraknetAddress, zeroStarknetAddress } from '../../utils'
import { TYPE } from '../../Theme'
import Panel from '../Panel'

import eligibilityBadgeIcon from '../../../src/assets/starBadge.svg'
import { AutoRow } from '../Row'
import { AutoColumn } from '../Column'
import { ButtonDark } from '../ButtonStyled'
import { withRouter } from 'react-router-dom'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;

  :hover {
    cursor: pointer;
  }
`

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  border-radius: 12px;
`

const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  outline: none;
  padding: 12px 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  font-size: 16px;

  border: 1px solid ${({ theme }) => theme.bg3};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const EligibilityBadge = styled.img``

const EligibilityBadgeWrapper = styled.a`
  display: flex;
  cursor: help;
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 0.5fr 1fr 1fr;
  grid-template-areas: 'number name value';
  padding: 0 4px;

  > * {
    justify-content: flex-end;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 0.5fr 1fr 1fr;
    grid-template-areas: 'number name value';
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 0.5fr 1fr 1fr;
    grid-template-areas: 'number name value';
  }
`

const Switcher = styled(Switch)`
  .react-switch-bg {
    opacity: 0.32;
  }
`

const ListWrapper = styled.div``

const LeaderboardNote = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

function VolumeContestSearch({ history, players, maxItems = 10 }) {
  const [isEligibilityFilterChecked, setIsEligibilityFilterChecked] = useState(false)
  const [checkAccountQuery, setCheckAccountQuery] = useState('')
  const [isCheckAccountAddressValid, setIsCheckAccountAddressValid] = useState(false)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems
  const arePlayersAvailable = !!Object.keys(players).length

  const filteredPlayers = useMemo(() => {
    if (!arePlayersAvailable) {
      return
    }
    return Object.keys(players)
      .filter((playerId) => {
        return isEligibilityFilterChecked ? players[playerId]?.isEligible : true
      })
      .map((key) => players[key])
  }, [arePlayersAvailable, players, isEligibilityFilterChecked])

  const handleCheckAccountInputChange = useCallback(
    (e) => {
      const value = e.currentTarget.value
      if (!value) {
        setCheckAccountQuery('')
        setIsCheckAccountAddressValid(false)
        return
      }
      setCheckAccountQuery(value)
      setIsCheckAccountAddressValid(isStarknetAddress(value, true))
    },
    [setCheckAccountQuery]
  )

  const handleAccountSearch = useCallback(
    (e) => {
      if (!(isCheckAccountAddressValid && checkAccountQuery)) {
        return
      }
      history.push('/lp-contest/' + checkAccountQuery)
    },
    [isCheckAccountAddressValid, checkAccountQuery, history]
  )

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [filteredPlayers])

  useEffect(() => {
    if (filteredPlayers?.length) {
      let extraPages = 1
      if (filteredPlayers.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(filteredPlayers.length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, filteredPlayers])

  const ListItem = ({ player, index }) => {
    return (
      <DashGrid style={{ height: '48px' }} focus={true}>
        <DataText area="number" fontWeight="500" justifyContent="center">
          {index}
        </DataText>
        <DataText area="name" fontWeight="500" justifyContent="flex-start">
          <CustomLink style={{ whiteSpace: 'nowrap', marginRight: '15px' }} to={'/lp-contest/' + player.user.id}>
            {player.starknetIdDomain ? player.starknetIdDomain : shortenStraknetAddress(player.user.id, 6)}
          </CustomLink>
          {player?.isEligible && (
            <EligibilityBadgeWrapper className="eligibility-badge" data-tooltip-content="Eligible for NFT" data-tooltip-place="right">
              <EligibilityBadge src={eligibilityBadgeIcon} />
            </EligibilityBadgeWrapper>
          )}
        </DataText>
        <DataText area="value" justifyContent="center">
          {formattedNum(player.contestValue)}
        </DataText>
      </DashGrid>
    )
  }

  return (
    <>
      <AutoColumn gap={'20px'}>
        <AutoRow gap={'10px'} style={{ width: 'calc(100% + 10px)' }}>
          <SearchWrapper>
            <Input
              type="text"
              value={checkAccountQuery}
              onChange={handleCheckAccountInputChange}
              placeholder={'Enter account address'}
              maxLength={zeroStarknetAddress.length}
            />
            {<SearchIcon />}
          </SearchWrapper>
          <div>
            <ButtonDark onClick={handleAccountSearch} disabled={!isCheckAccountAddressValid}>
              View Profile
            </ButtonDark>
          </div>
        </AutoRow>
      </AutoColumn>
      <ReactTooltip anchorSelect=".eligibility-badge" style={{ backgroundColor: 'rgb(0, 0, 0)', color: '#fff' }} />
    </>
  )
}

export default withRouter(VolumeContestSearch)
