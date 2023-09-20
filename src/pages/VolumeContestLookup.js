import React from 'react'
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import utc from 'dayjs/plugin/utc'
import styled from 'styled-components'
import 'feather-icons'

import { PageWrapper, FullWrapper } from '../components'
import { VolumeContestPanel } from '../components/Panel'
import { Banner, Title as BannerTitle } from '../components/Banner'
import { AutoColumn } from '../components/Column'
import VolumeContestNftCategories from '../components/VolumeContestNftCategories'
import VolumeContestSearchWalletPanel from '../components/VolumeContestSearchWallet'
import FAQ from '../components/FAQ'
import { AutoRow } from '../components/Row'
import VolumeContestNftClaim from '../components/VolumeContestNftClaim'

import { TYPE } from '../Theme'

import contestFlagIcon from '../../src/assets/flag.svg'

dayjs.extend(weekday)
dayjs.extend(utc)

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 14px;
`

const TitleIconWrapper = styled.div`
  display: flex;
  margin-right: 0.75rem;
  font-size: 30px;

  img {
    width: 1em;
  }
`

const DashboardWrapper = styled(VolumeContestPanel)`
  padding: 30px 40px;
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

const InformationGridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 3fr;
  column-gap: 32px;
  align-items: start;
  justify-content: space-between;

  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
    row-gap: 32px;
  }
`

const SectionWrapper = styled(VolumeContestPanel)``

const SectionTitle = styled.div`
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`
const SectionDescription = styled.div`
  font-size: 16px;
  color: #fff;
  margin-bottom: 50px;
`
const RewardsGridRow = styled(AutoRow)`
  @media screen and (max-width: 880px) {
    flex-direction: column;

    .nft-slider-title {
      display: none;
    }
  }
`
const RewardsGridRowSection = styled.div`
  width: 50%;

  @media screen and (max-width: 880px) {
    width: 100%;
  }
`
const NftSliderWrapper = styled.div`
  max-width: 470px;
  margin: 0 auto;
`

const START_DATE = dayjs('2023-09-12T00:00:00.000Z')
const END_DATE = START_DATE.add(8, 'weeks')
const START_DATE_DAY_OF_THE_WEEK = START_DATE.weekday()
const CURRENT_WEEK_START_DATE = dayjs().weekday(START_DATE_DAY_OF_THE_WEEK)
const CURRENT_WEEK_END_DATE = CURRENT_WEEK_START_DATE.add(6, 'days')
const HAS_CAMPAIGN_STARTED = dayjs().isAfter(dayjs.utc(START_DATE))
const HAS_CAMPAIGN_ENDED = CURRENT_WEEK_END_DATE.isAfter(dayjs.utc(END_DATE))

export const START_DATE_UTC = String(START_DATE)
export const END_DATE_UTC = String(END_DATE)

const faqItems = [
  {
    header: 'How long will the contest last?',
    content: (
      <>
        The contest lasts for 8 weeks, starting from <strong>{START_DATE.utc().format('MMM DD YYYY')}</strong> and ending on{' '}
        <strong>{END_DATE.utc().format('MMM DD YYYY')}</strong>
      </>
    ),
  },
  {
    header: 'Can I still take part in the contest if I missed the first week?',
    content: <>Yes! It’s possible to get rewarded with an NFT even by participating only for one week and gathering at least 500 contest points.</>,
  },
  {
    header: 'How are the contest points calculated?',
    content: (
      <>
        Each $ in user volume is given 1 contest point. It is possible to earn a maximum of 1000 points every week for 8 weeks.{' '}
        <i>
          Trading liked assets (like stablecoins with stablecoins or ETH with stETH) against each other has a multiplier of 0.5, so in order to get
          the max points for a week, users would have to trade at least $2000 in stablecoins.
        </i>
      </>
    ),
  },
  {
    header: 'Are all tokens part of the contest?',
    content: <>Points can be earned only for trading between any of these tokens: USDC, USDT, DAI, ETH, WBTC, LORD and wstETH.</>,
  },
  {
    header: 'What are the rewards?',
    content: (
      <>
        Users are rewarded with NFTs based on how many points they gather by the end of the contest.
        <i>Minimum amount of points needed to be eligible for an NFT is 500.</i>
      </>
    ),
  },
  {
    header: 'Will the NFT be tradable?',
    content: <>Yes!</>,
  },
]

function VolumeContestLookup() {
  const getCampaignStatus = () => {
    switch (true) {
      case HAS_CAMPAIGN_ENDED:
        return 'Campaign Ended'
      case !HAS_CAMPAIGN_STARTED:
        return 'Campaign Has Not Started'
      default:
        return `${dayjs.utc(CURRENT_WEEK_START_DATE).format('MMM DD')} - ${dayjs.utc(CURRENT_WEEK_END_DATE).format('MMM DD')}`
    }
  }
  return (
    <PageWrapper>
      <FullWrapper>
        <Title>
          <TitleIconWrapper>
            <img src={contestFlagIcon} alt={''} />
          </TitleIconWrapper>
          <TYPE.largeHeader style={{ fontWeight: 700 }}>The Trade Federation Awakens</TYPE.largeHeader>
        </Title>

        <DashboardWrapper>
          <AutoColumn gap={'32px'}>
            <InformationGridRow>
              <VolumeContestBanner title={'Ongoing week'} content={getCampaignStatus()} showPollingDot={false} />
              <VolumeContestSearchWalletPanel />
            </InformationGridRow>

            <SectionWrapper>
              <RewardsGridRow gap={'12px'} align={'flex-start'}>
                <RewardsGridRowSection>
                  <SectionTitle>NFT Categories</SectionTitle>
                  <SectionDescription>To see which NFT you are eligible for, check the score requirements.</SectionDescription>
                  <VolumeContestNftCategories />
                </RewardsGridRowSection>
                <RewardsGridRowSection>
                  <SectionTitle className={'nft-slider-title'}>&nbsp;</SectionTitle>
                  <NftSliderWrapper>
                    <VolumeContestNftClaim style={{ flexGrow: '1' }}></VolumeContestNftClaim>
                  </NftSliderWrapper>
                </RewardsGridRowSection>
              </RewardsGridRow>
            </SectionWrapper>
            <SectionWrapper>
              <SectionTitle>FAQs</SectionTitle>
              <FAQ items={faqItems} columns={2} />
            </SectionWrapper>
          </AutoColumn>
        </DashboardWrapper>
      </FullWrapper>
    </PageWrapper>
  )
}

export default withRouter(VolumeContestLookup)
