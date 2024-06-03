import React, { useState, useMemo, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useUserTransactions, useUserPositions } from '../contexts/User'
import TxnList from '../components/TxnList'
import Panel from '../components/Panel'
import { formattedNum, shortenStraknetAddress, urls } from '../utils'
import { AutoRow, RowFixed, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import PositionList from '../components/PositionList'
import { TYPE } from '../Theme'
import { PageWrapper, ContentWrapper, StyledIcon } from '../components'
import { Bookmark } from 'react-feather'
import Link from '../components/Link'
import { FEE_WARNING_TOKENS } from '../constants'
import { BasicLink } from '../components/Link'
import { useMedia } from 'react-use'
import Search from '../components/Search'
import { useSavedAccounts } from '../contexts/LocalStorage'
import UserChart from '../components/UserChart'

const AccountWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Header = styled.div``

const DashboardWrapper = styled.div`
  width: 100%;
`

const PanelWrapper = styled.div`
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`

const Warning = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  padding: 1rem;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: calc(100% - 2rem);
`

function AccountPage({ account }) {
  // get data for this account
  const transactions = useUserTransactions(account)
  const positions = useUserPositions(account)

  // get data for user stats
  const transactionCount = transactions?.swaps?.length + transactions?.burns?.length + transactions?.mints?.length

  // get derived totals
  let totalSwappedUSD = useMemo(() => {
    return transactions?.swaps
      ? transactions?.swaps.reduce((total, swap) => {
          return total + parseFloat(swap.amountUSD)
        }, 0)
      : 0
  }, [transactions])

  // if any position has token from fee warning list, show warning
  const [showWarning, setShowWarning] = useState(false)
  useEffect(() => {
    if (positions) {
      for (let i = 0; i < positions.length; i++) {
        if (FEE_WARNING_TOKENS.includes(positions[i].pair.token0.id) || FEE_WARNING_TOKENS.includes(positions[i].pair.token1.id)) {
          setShowWarning(true)
        }
      }
    }
  }, [positions])

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0
  const [activePosition] = useState()

  const dynamicPositions = activePosition ? [activePosition] : positions

  const positionValue = useMemo(() => {
    return dynamicPositions
      ? dynamicPositions.reduce((total, position) => {
          return total + (parseFloat(position?.liquidityTokenBalance) / parseFloat(position?.pair?.totalSupply)) * position?.pair?.reserveUSD
        }, 0)
      : null
  }, [dynamicPositions])

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const below600 = useMedia('(max-width: 600px)')

  // adding/removing account from saved accounts
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()
  const isBookmarked = savedAccounts.includes(account)
  const handleBookmarkClick = useCallback(() => {
    ;(isBookmarked ? removeAccount : addAccount)(account)
  }, [account, isBookmarked, addAccount, removeAccount])

  return (
    <PageWrapper>
      <ContentWrapper>
        <RowBetween>
          <TYPE.body>
            <BasicLink to="/accounts">{'Accounts '}</BasicLink>→{' '}
            <Link lineHeight={'145.23%'} href={urls.showAddress(account)} target="_blank">
              {' '}
              {account?.slice(0, 42)}{' '}
            </Link>
          </TYPE.body>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <Header>
          <RowBetween>
            <span>
              <TYPE.header fontSize={24}>{shortenStraknetAddress(account)}</TYPE.header>
              <Link lineHeight={'145.23%'} href={urls.showAddress(account)} target="_blank">
                <TYPE.main fontSize={14}>View on Starkscan</TYPE.main>
              </Link>
            </span>
            <AccountWrapper>
              <StyledIcon>
                <Bookmark onClick={handleBookmarkClick} style={{ opacity: isBookmarked ? 0.8 : 0.4, cursor: 'pointer' }} />
              </StyledIcon>
            </AccountWrapper>
          </RowBetween>
        </Header>
        <DashboardWrapper>
          {showWarning && <Warning>Fees cannot currently be calculated for pairs that include AMPL.</Warning>}
          {!hideLPContent && (
            <Panel style={{ height: '100%', marginBottom: '1rem' }}>
              <AutoRow gap="20px">
                <AutoColumn gap="10px">
                  <RowBetween>
                    <TYPE.body>Liquidity (Including Fees)</TYPE.body>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <TYPE.header fontSize={'24px'} lineHeight={1}>
                      {positionValue ? formattedNum(positionValue, true) : positionValue === 0 ? formattedNum(0, true) : '-'}
                    </TYPE.header>
                  </RowFixed>
                </AutoColumn>
                {/*  <AutoColumn gap="10px">
                  <RowBetween>
                    <TYPE.body>Fees Earned (Cumulative)</TYPE.body>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <TYPE.header fontSize={'24px'} lineHeight={1} color={aggregateFees && 'green'}>
                      {aggregateFees ? formattedNum(aggregateFees, true, true) : '-'}
                    </TYPE.header>
                  </RowFixed>
                </AutoColumn> */}
              </AutoRow>
            </Panel>
          )}
          {!hideLPContent && (
            <PanelWrapper>
              <Panel style={{ gridColumn: '1' }}>
                <UserChart account={account} position={activePosition} />
              </Panel>
            </PanelWrapper>
          )}
          <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
            Positions
          </TYPE.main>{' '}
          <Panel
            style={{
              marginTop: '1.5rem',
            }}
          >
            <PositionList positions={positions} />
          </Panel>
          {/*<TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>*/}
          {/*  Liquidity Mining Pools*/}
          {/*</TYPE.main>*/}
          {/*<Panel*/}
          {/*  style={{*/}
          {/*    marginTop: '1.5rem',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {miningPositions && <MiningPositionList miningPositions={miningPositions} />}*/}
          {/*  {!miningPositions && (*/}
          {/*    <AutoColumn gap="8px" justify="flex-start">*/}
          {/*      <TYPE.main>No Staked Liquidity.</TYPE.main>*/}
          {/*      <AutoRow gap="8px" justify="flex-start">*/}
          {/*        <ButtonLight style={{ padding: '4px 6px', borderRadius: '4px' }}>Learn More</ButtonLight>{' '}*/}
          {/*      </AutoRow>{' '}*/}
          {/*    </AutoColumn>*/}
          {/*  )}*/}
          {/*</Panel>*/}
          <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
            Transactions
          </TYPE.main>{' '}
          <Panel
            style={{
              marginTop: '1.5rem',
            }}
          >
            <TxnList transactions={transactions} account={account} />
          </Panel>
          <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
            Wallet Stats
          </TYPE.main>{' '}
          <Panel
            style={{
              marginTop: '1.5rem',
            }}
          >
            <AutoRow gap="20px">
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>{totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : '-'}</TYPE.header>
                <TYPE.main>Total Value Swapped</TYPE.main>
              </AutoColumn>
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>{totalSwappedUSD ? formattedNum(totalSwappedUSD * 0.003, true) : '-'}</TYPE.header>
                <TYPE.main>Total Fees Paid</TYPE.main>
              </AutoColumn>
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>{transactionCount ? transactionCount : '-'}</TYPE.header>
                <TYPE.main>Total Transactions</TYPE.main>
              </AutoColumn>
            </AutoRow>
          </Panel>
        </DashboardWrapper>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default AccountPage
