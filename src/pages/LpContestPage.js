import React, { useMemo, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useUserLpCampaignTransactions, useLpContestUserSnapshots, useLpContestPercentile } from '../contexts/User'
import TxnList from '../components/TxnList'
import Panel from '../components/Panel'
import { convertHexToDecimal, formattedNum, shortenStraknetAddress, urls } from '../utils'
import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import { TYPE } from '../Theme'
import { PageWrapper, ContentWrapper } from '../components'
import Link from '../components/Link'
import { BasicLink } from '../components/Link'

import eligibilityBadgeIcon from '../../src/assets/starBadge.svg'

import LpContestUserChart from '../components/LpContestUserChart'
import { useLpContestNftRanksData } from '../contexts/LpContestData'
import { isEmpty, isObject } from 'lodash'

const EligibilityBadge = styled.img``

const EligibilityBadgeWrapper = styled.a`
  display: flex;
  margin-left: 12px;
  cursor: help;
`

const PanelWrapper = styled.div`
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`

const Header = styled.div``

const DashboardWrapper = styled.div`
  width: 100%;
`

function LpContestAccountPage({ account }) {
  const [starknetIdDomain, setStarknetIdDomain] = useState('')
  const userData = useLpContestUserSnapshots(account)
  const userPercentile = useLpContestPercentile(account)
  const transactions = useUserLpCampaignTransactions(account)
  const nftRanksData = useLpContestNftRanksData()

  let userPoints = useMemo(() => {
    return userPercentile?.contestValue ? userPercentile.contestValue : 0
  }, [userPercentile])

  let isUserEligible = useMemo(() => {
    return userData?.length ? userData[0].isEligible : false
  }, [userData])

  const getEligibleNftForUserRank = useCallback(() => {
    const loadingResultStub = '...'
    const notEligibleResult = 'Not eligible for NFT'
    const isAllDataAvailable = isObject(nftRanksData) && !isEmpty(nftRanksData) && isObject(userPercentile) && !isEmpty(userPercentile)
    const isUserRankAvailable = typeof userPercentile?.rank == 'number' && userPercentile?.rank >= 0
    if (!isAllDataAvailable) {
      return loadingResultStub
    }
    if (!isUserRankAvailable) {
      return notEligibleResult
    }
    const userRank = Number(userPercentile?.rank) + 1
    const rangesAmount = Math.round((Object.keys(nftRanksData).length - 1) / 2)

    let result = notEligibleResult
    for (let i = 1; i <= rangesAmount; i++) {
      if (i === 1 && userRank < nftRanksData[`L1P${i}Start`]) {
        result = `L1PW`
        break
      }
      if (userRank <= nftRanksData[`L1P${i}End`]) {
        result = `L1P${i}`
        break
      }
    }
    return result
  }, [nftRanksData, userPercentile])

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      const convertedAddress = convertHexToDecimal(account)
      const response = await fetch(`https://app.starknet.id/api/indexer/addr_to_domain?addr=${convertedAddress}`)
      const processedResponse = await response.json()
      if (processedResponse.domain) {
        setStarknetIdDomain(processedResponse.domain)
      }
    }
    if (account) {
      try {
        fetchData()
      } catch (e) {}
    }
  }, [account])

  return (
    <PageWrapper>
      <ContentWrapper>
        <RowBetween>
          <TYPE.body>
            <BasicLink to="/lp-contest">{'Rise of the first LPs'}</BasicLink>→{' '}
            <Link lineHeight={'145.23%'} href={urls.showAddress(account)} target="_blank">
              {' '}
              {shortenStraknetAddress(account)}{' '}
            </Link>
          </TYPE.body>
        </RowBetween>
        <Header>
          <RowBetween>
            <span>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <TYPE.header fontSize={24}>{starknetIdDomain ? starknetIdDomain : shortenStraknetAddress(account)}</TYPE.header>
                {isUserEligible && (
                  <EligibilityBadgeWrapper className="eligibility-badge" data-tooltip-content="Eligible for NFT" data-tooltip-place="right">
                    <EligibilityBadge src={eligibilityBadgeIcon} />
                  </EligibilityBadgeWrapper>
                )}
              </div>
              <Link lineHeight={'145.23%'} href={urls.showAddress(account)} target="_blank" style={{ display: 'inline-block' }}>
                <TYPE.main fontSize={14}>View on Starkscan</TYPE.main>
              </Link>
            </span>
          </RowBetween>
        </Header>
        <DashboardWrapper>
          <TYPE.main fontSize={'1.125rem'}>Campaign Performance</TYPE.main>

          <Panel style={{ marginTop: '1.5rem' }}>
            <AutoRow gap={'25px'}>
              <AutoColumn gap="5px">
                <TYPE.main>Contest points</TYPE.main>
                <TYPE.header fontSize={24}>{!userData ? '...' : formattedNum(userPoints)}</TYPE.header>
              </AutoColumn>
              <AutoColumn gap="5px">
                <TYPE.main>Rank</TYPE.main>
                <TYPE.header fontSize={24}>
                  {typeof userPercentile?.rank == 'number' && userPercentile?.rank >= 0 ? userPercentile.rank + 1 : '...'}
                </TYPE.header>
              </AutoColumn>
              <AutoColumn gap="5px">
                <TYPE.main>Eligible for NFT</TYPE.main>
                <TYPE.header fontSize={24}>{getEligibleNftForUserRank()}</TYPE.header>
              </AutoColumn>
            </AutoRow>
          </Panel>

          {/* <TYPE.main fontSize={'1'} style={{ marginTop: '3rem' }}>
            Contest points chart
          </TYPE.main>
          <PanelWrapper style={{ marginTop: '1.5rem' }}>
            <Panel style={{ gridColumn: '1' }}>
              <LpContestUserChart account={account} />
            </Panel>
          </PanelWrapper> */}

          <TYPE.main fontSize={'1'} style={{ marginTop: '3rem' }}>
            Transactions
          </TYPE.main>
          <Panel
            style={{
              marginTop: '1.5rem',
            }}
          >
            <TxnList transactions={transactions} account={account} />
          </Panel>
        </DashboardWrapper>
      </ContentWrapper>
      <ReactTooltip anchorSelect=".eligibility-badge" style={{ backgroundColor: 'rgb(0, 0, 0)', color: '#fff' }} />
    </PageWrapper>
  )
}

export default LpContestAccountPage
