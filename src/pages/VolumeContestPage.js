import React, { useMemo, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

import { PageWrapper, ContentWrapper } from '../components'
import { VolumeContestPanel } from '../components/Panel'
import { BasicLink } from '../components/Link'
import { RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import VolumeContestUserScoreTable from '../components/VolumeContestUserScoreTable'
import { Banner, Title as BannerTitle } from '../components/Banner'
import VolumeContestTxnList from '../components/VolumeContestTxnList'
import Link from '../components/Link'

import { TYPE } from '../Theme'

import { shortenStraknetAddress, urls } from '../utils'

import eligibilityBadgeIcon from '../../src/assets/starBadge.svg'

import nftBannerDecoration from '../../src/assets/banners/nft.png'
import nftBannerDecoration_x2 from '../../src/assets/banners/nft@x2.png'

import cupBannerDecoration from '../../src/assets/banners/cup.png'
import cupBannerDecoration_x2 from '../../src/assets/banners/cup@x2.png'

import { useVolumeContestUserData } from '../contexts/VolumeContestData'
import { useUserVolumeCampaignTransactions } from '../contexts/User'

import { useUserStraknetIdDomain } from '../hooks'

dayjs.extend(isBetween)

const EligibilityBadge = styled.img``

const EligibilityBadgeWrapper = styled.a`
  display: flex;
  margin-left: 12px;
  cursor: help;
`

const Header = styled.div``

const DashboardWrapper = styled(VolumeContestPanel)`
  width: 100%;
`

const InformationGridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1.1fr 0.9fr;
  column-gap: 32px;
  align-items: start;
  justify-content: space-between;

  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
    row-gap: 32px;
  }
`

const GeneralInfoRow = styled.div`
  display: grid;
  column-gap: 24px;
  grid-template-columns: 1.3fr 2fr;
  align-items: flex-start;
  width: 100%;

  @media screen and (max-width: 1280px) {
    grid-template-columns: 1fr;
    row-gap: 32px;
  }
`

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`

const VolumeContestBanner = styled(Banner)`
  box-shadow: none;
  border-radius: 8px;
  border: 1px solid rgba(160, 160, 160, 0.4);
  background: rgba(255, 255, 255, 0.05);

  ${BannerTitle} {
    font-size: 20px;
  }
`

const PositionBannersGroup = styled.div`
  display: flex;

  ${VolumeContestBanner}:first-child {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 40px;
  }

  ${VolumeContestBanner}:not(:first-child) {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding-left: 40px;
  }

  ${VolumeContestBanner}:not(:last-child) {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  ${VolumeContestBanner} + ${VolumeContestBanner} {
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 1px;
      height: 50px;
      background: #fff;
    }
  }
`

const nftUserScoreLookup = {
  0: 'Not Eligible',
  1: 'T1A1',
  2: 'T1A2',
  3: 'T1A3',
  4: 'T1A4',
  5: 'T1A5',
}

function VolumeContestAccountPage({ account }) {
  const [, starknetIdDomain] = useUserStraknetIdDomain(account)
  const userData = useVolumeContestUserData(account)
  const transactions = useUserVolumeCampaignTransactions(account)

  const userNftLevel = userData?.nftLevel
  const totalContestScore = userData?.totalContestScore

  let isUserEligible = useMemo(() => {
    return (typeof userNftLevel == 'number' && userNftLevel) > 0 || false
  }, [userData])

  const getEligibleNftForUserScore = useCallback(() => {
    const loadingResultStub = '...'
    const isUserRankAvailable = typeof userNftLevel == 'number' && userNftLevel >= 0
    if (!isUserRankAvailable) {
      return loadingResultStub
    }
    if (!nftUserScoreLookup[userNftLevel]) {
      return nftUserScoreLookup[0]
    }
    return nftUserScoreLookup[userNftLevel]
  }, [userNftLevel])

  const getThisWeekUserScore = useCallback(() => {
    const findCurrentWeek = (week) => dayjs().isBetween(dayjs(week.startDt), dayjs(week.endDt), 'day', '[]')
    const loadingResultStub = '...'
    const isAllDataAvailable = Boolean(userData?.weeks?.length)
    if (!isAllDataAvailable) {
      return loadingResultStub
    }
    const currentWeek = userData.weeks.filter(findCurrentWeek).unshift()
    return currentWeek?.score ?? 0
  }, [userData])

  const getTotalUserScore = useCallback(() => {
    const loadingResultStub = '...'
    const normalizedData = Number(totalContestScore)
    const isUserDataAvailable = !Number.isNaN(normalizedData) && typeof normalizedData == 'number' && normalizedData >= 0
    if (!isUserDataAvailable) {
      return loadingResultStub
    }
    return Math.round(normalizedData)
  }, [totalContestScore])

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
            <BasicLink to="/volume-contest">{'The Trade Federation Awakens'}</BasicLink>→{' '}
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
          <AutoColumn gap={'32px'}>
            <InformationGridRow>
              <PositionBannersGroup>
                <VolumeContestBanner
                  title={'This week score'}
                  content={getThisWeekUserScore()}
                  showPollingDot={false}
                  style={{ flexShrink: 0, width: 'auto' }}
                />
                <VolumeContestBanner
                  title={'Total score'}
                  content={getTotalUserScore()}
                  decoration={
                    <>
                      <img src={cupBannerDecoration} srcSet={cupBannerDecoration + ' 1x,' + cupBannerDecoration_x2 + ' 2x'} alt={''} />
                    </>
                  }
                  style={{ height: 'auto' }}
                />
              </PositionBannersGroup>

              <VolumeContestBanner
                title={'NFT Unlocked'}
                content={getEligibleNftForUserScore()}
                showPollingDot={false}
                decoration={
                  <>
                    <img src={nftBannerDecoration} srcSet={nftBannerDecoration + ' 1x,' + nftBannerDecoration_x2 + ' 2x'} alt={''} />
                  </>
                }
              />
            </InformationGridRow>

            <GeneralInfoRow>
              <AutoColumn gap="20px">
                <SectionTitle>Week wise score</SectionTitle>
                <div style={{ width: '100%' }}>
                  <VolumeContestUserScoreTable weeks={userData?.weeks} />
                </div>
              </AutoColumn>
              <AutoColumn gap="20px" justify={'flex-start'}>
                <SectionTitle>Transactions</SectionTitle>

                <div style={{ width: '100%' }}>
                  <VolumeContestTxnList transactions={transactions} account={account} />
                </div>
              </AutoColumn>
            </GeneralInfoRow>
          </AutoColumn>
        </DashboardWrapper>
      </ContentWrapper>
      <ReactTooltip anchorSelect=".eligibility-badge" style={{ backgroundColor: 'rgb(0, 0, 0)', color: '#fff' }} />
    </PageWrapper>
  )
}

export default VolumeContestAccountPage
