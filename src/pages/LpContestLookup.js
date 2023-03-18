import React, {useEffect} from 'react'
import 'feather-icons'
import {withRouter} from 'react-router-dom'
import dayjs from 'dayjs'
import Countdown from 'react-countdown';

import {TYPE} from '../Theme'
import {PageWrapper, FullWrapper} from '../components'

import LpContestLeaderboard from '../components/LpContestLeaderboard'
import LpContestNftClaim from '../components/LpContestNftClaim'

import styled from 'styled-components'

import {AutoRow, RowBetween} from '../components/Row'
import {Banner} from "../components/Banner";
import { Flag, Watch, Box, BarChart } from 'react-feather'
import {useLatestBlocks} from "../contexts/Application";
import {useAllLpContestData} from "../contexts/LpContestData";

const BannerGridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 20px;
  align-items: start;
  justify-content: space-between;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
`

const LeaderboardGridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 20px;
  align-items: flex-start;
  justify-content: space-between;

  @media screen and (max-width: 800px) {
  	grid-template-columns: minmax(0,1fr);
    row-gap: 20px;
  }
`

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const LeaderboardNote = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
`

const CAMPAIGN_START_DATE_ISO = '2023-03-17T18:59:00.000Z';
const CAMPAIGN_END_DATE_ISO = '2023-03-30T00:00:00.000Z';

function LpContestLookup() {
	const allPlayersData = useAllLpContestData();

	// scroll to top
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const [latestBlock] = useLatestBlocks();

	return (
		<PageWrapper>
			<FullWrapper>
				<RowBetween>
					<TYPE.largeHeader>LP Campaign Dashboard</TYPE.largeHeader>
				</RowBetween>

				<div
					style={{
						borderRadius: '15px',
						padding: '25px',
						boxShadow: `rgb(255 255 255 / 50%) 0px 30.0211px 43.1072px -27.7118px inset,
					      rgb(255 255 255) 0px 5.38841px 8.46749px -3.07909px inset,
					      rgb(96 68 145 / 30%) 0px -63.1213px 52.3445px -49.2654px inset,
					      rgb(202 172 255 / 30%) 0px 75.4377px 76.9772px -36.9491px inset,
					      rgb(154 146 210 / 30%) 0px 3.07909px 13.8559px inset, rgb(227 222 255 / 20%) 0px 0.769772px 30.7909px inset`,
					}}
				>
					<BannerGridRow>
						<Banner
							title={'Campaign Started'}
							titleIcon={<Flag size={20} />}
							content={dayjs.utc(CAMPAIGN_START_DATE_ISO).format('MMM DD, YYYY')}
							showPollingDot={false}
						/>
						<Banner
							title={'Period left'}
							titleIcon={<Watch size={20} />}
							content={
								<Countdown
									date={CAMPAIGN_END_DATE_ISO}
									renderer={({days, hours, minutes, completed}) => ((completed) ? 'End' : `~ ${days} D : ${hours} H : ${minutes} M`)}
								/>
							}
							showPollingDot={false}
						/>
						<Banner
							title={'Block Updates'}
							titleIcon={<Box size={20} />}
							content={`Block No. ${latestBlock?.number || '...'}`}
							showPollingDot={false}
						/>
					</BannerGridRow>

					<LeaderboardGridRow style={{marginTop: '25px'}}>
						<div>
							<ListOptions gap="10px" style={{marginBottom: '.5rem', width: 'calc(100% + 20px)' }}>
								<RowBetween>
									<TYPE.main fontSize={'1.125rem'} fontWeight={700} style={{ whiteSpace: 'nowrap' }}>
										Contest Leaderboard
									</TYPE.main>
									<LeaderboardNote>
										<BarChart size={16} style={{marginRight: '.25rem'}}/>
										Sorted by Contest points
									</LeaderboardNote>
								</RowBetween>
							</ListOptions>
							<LpContestLeaderboard players={allPlayersData}/>
						</div>
						<div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
							<ListOptions gap="10px" style={{marginBottom: '.5rem', width: 'calc(100% + 20px)' }}>
								<RowBetween>
									<TYPE.main fontSize={'1.125rem'} fontWeight={700} style={{ whiteSpace: 'nowrap' }}>
										Claim NFTs
									</TYPE.main>
								</RowBetween>
							</ListOptions>
							<LpContestNftClaim style={{flexGrow: '1'}}></LpContestNftClaim>
						</div>
					</LeaderboardGridRow>
				</div>
			</FullWrapper>
		</PageWrapper>
	)
}

export default withRouter(LpContestLookup)
