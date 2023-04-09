import React, {useState, useEffect, useMemo, useCallback} from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {Box, Flex} from 'rebass'
import styled from 'styled-components'

import {BarChart} from 'react-feather'
import Switch from "react-switch";

import {CustomLink} from '../Link'
import LocalLoader from '../LocalLoader'
import {Divider, EmptyCard} from '..'
import {formattedNum, shortenStraknetAddress} from '../../utils'
import {TYPE} from '../../Theme'
import Panel from "../Panel";

import eligibilityBadgeIcon from '../../../src/assets/starBadge.svg';
import {AutoRow, RowBetween} from "../Row";

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({theme}) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;

  :hover {
    cursor: pointer;
  }
`

const EligibilityBadge = styled.img`

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


const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({theme}) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

function LpContestLeaderboard({players, maxItems = 10}) {
	const [isEligibilityFilterChecked, setIsEligibilityFilterChecked] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [page, setPage] = useState(1)
	const [maxPage, setMaxPage] = useState(1)
	const ITEMS_PER_PAGE = maxItems
	const arePlayersAvailable = !!(Object.keys(players).length);

	const filteredPlayers = useMemo(() => {
		if (!arePlayersAvailable) { return }
		return (
			Object.keys(players)
				.filter((playerId) => {
					return (isEligibilityFilterChecked) ? players[playerId]?.isEligible : true
				})
				.filter((playerId) => {
					if (!searchQuery) { return true }
					return playerId.toLowerCase().includes(searchQuery.toLowerCase());
				})
				.map((key) => players[key])
		)
	}, [arePlayersAvailable, players, isEligibilityFilterChecked, searchQuery])

	const handleEligibilitySwitcherChange = useCallback(() => {
		setIsEligibilityFilterChecked((v) => !v);
	}, []);

	const handleSearchInputChange = useCallback((e) => {
		const value = e.currentTarget.value;
		if (!value) {
			setSearchQuery('');
		}
		setSearchQuery(value);
	}, [setSearchQuery]);

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

	const ListItem = ({player, index}) => {
		return (
			<DashGrid style={{height: '48px'}} focus={true}>
				<DataText area="number" fontWeight="500" justifyContent="center">
					{index}
				</DataText>
				<DataText area="name" fontWeight="500" justifyContent="flex-start">
					<CustomLink style={{whiteSpace: 'nowrap'}} to={'/lp-contest/' + player.user.id}>
						{shortenStraknetAddress(player.user.id, 6)}
					</CustomLink>
					{player?.isEligible && (
						<EligibilityBadge src={eligibilityBadgeIcon} style={{marginLeft: '15px'}}/>
					)}
				</DataText>
				<DataText area="value" justifyContent="center">{formattedNum(player.contestValue)}</DataText>
			</DashGrid>
		)
	}

	const playersList =
		filteredPlayers?.length &&
		filteredPlayers.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((player, index) => {
			return (
				<div key={index}>
					<ListItem key={index} index={(page - 1) * 10 + index + 1} player={player}/>
					<Divider/>
				</div>
			)
		})

	if (!arePlayersAvailable) {
		return <LocalLoader/>
	}


	return (
		<>
			<ListOptions gap="10px" style={{marginBottom: '.5rem', width: 'calc(100% + 20px)'}}>
				<RowBetween>
					<LeaderboardNote>
						<span style={{marginRight: '1rem'}}>Filter by Eligible LP</span>
						<Switcher
							onColor={'#fff'}
							offColor={'#959595'}
							onHandleColor={'#FF00E9'}
							offHandleColor={'#959595'}
							uncheckedIcon={false}
							checkedIcon={false}
							handleDiameter={16}
							height={12}
							width={32}
							onChange={handleEligibilitySwitcherChange}
							checked={isEligibilityFilterChecked}
						/>
					</LeaderboardNote>
					<LeaderboardNote>
						<BarChart size={16} style={{marginRight: '1rem', transform: 'scaleX(-1)'}}/>
						Sorted by Contest points
					</LeaderboardNote>
				</RowBetween>
			</ListOptions>

			<ListOptions gap="10px" style={{marginBottom: '.5rem', width: 'calc(100% + 20px)'}}>
				<input type='text' value={searchQuery} onChange={handleSearchInputChange}/>
			</ListOptions>


			<Panel style={{marginTop: '6px', padding: '0rem 0', borderRadius: '5px'}}>
				<ListWrapper>
					<DashGrid
						center={true}
						style={{
							height: 'fit-content',
							padding: '1rem 0 1rem 0',
							backgroundColor: '#ffffff33',
							borderRadius: '5px',
						}}
					>
						<Flex alignItems="center" justifyContent="center">
							<TYPE.main area="number">Rank</TYPE.main>
						</Flex>
						<Flex alignItems="center" justifyContent="flex-start">
							<TYPE.main area="name">Address</TYPE.main>
						</Flex>

						<Flex alignItems="center" justifyContent="center">
							<TYPE.main area="value">Contest Points</TYPE.main>
						</Flex>
					</DashGrid>
					<Divider/>
					{!playersList.length ? (
						<EmptyCard style={{margin: '15px 0', height: 'auto'}}>No data found.</EmptyCard>
					) : (
						<List p={0}>{playersList}</List>
					)}
					<PageButtons>
						<div onClick={() => setPage(page === 1 ? page : page - 1)}>
							<Arrow faded={page === 1 ? true : false}>←</Arrow>
						</div>
						<TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
						<div onClick={() => setPage(page === maxPage ? page : page + 1)}>
							<Arrow faded={page === maxPage ? true : false}>→</Arrow>
						</div>
					</PageButtons>
				</ListWrapper>
			</Panel>

		</>
	)
}

export default LpContestLeaderboard
