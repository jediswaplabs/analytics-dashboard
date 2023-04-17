import React, { useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { useUserLpCampaignTransactions, useLpContestUserSnapshots, useLpContestPercentile } from '../contexts/User'
import TxnList from '../components/TxnList'
import Panel from '../components/Panel'
import { formattedNum, shortenStraknetAddress, urls } from '../utils'
import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import { TYPE } from '../Theme'
import { PageWrapper, ContentWrapper } from '../components'
import Link from '../components/Link'
import { BasicLink } from '../components/Link'

import eligibilityBadgeIcon from '../../src/assets/starBadge.svg'

import LpContestUserChart from '../components/LpContestUserChart'

const EligibilityBadge = styled.img``

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
  const userData = useLpContestUserSnapshots(account)
  const userPercentile = useLpContestPercentile(account)
  const transactions = useUserLpCampaignTransactions(account)

  let userPoints = useMemo(() => {
    return userData?.length ? userData[0].contestValue : 0
  }, [userData])

  let isUserEligible = useMemo(() => {
    return userData?.length ? userData[0].isEligible : false
  }, [userData])

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

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
                <TYPE.header fontSize={24}>{shortenStraknetAddress(account)}</TYPE.header>
                {isUserEligible && <EligibilityBadge src={eligibilityBadgeIcon} style={{ marginLeft: '12px' }} />}
              </div>
              <Link lineHeight={'145.23%'} href={urls.showAddress(account)} target="_blank">
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
                <TYPE.main>Percentile Score</TYPE.main>
                <TYPE.header fontSize={24}>
                  {!userPercentile?.percentileRank ? '...' : userPercentile?.percentileRank + '%'}
                </TYPE.header>
              </AutoColumn>
            </AutoRow>
          </Panel>

          <TYPE.main fontSize={'1'} style={{ marginTop: '3rem' }}>
            Contest points chart
          </TYPE.main>
          <PanelWrapper style={{ marginTop: '1.5rem' }}>
            <Panel style={{ gridColumn: '1' }}>
              <LpContestUserChart account={account} />
            </Panel>
          </PanelWrapper>

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
    </PageWrapper>
  )
}

export default LpContestAccountPage
