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
import {formattedNum, isStarknetAddress, shortenStraknetAddress, zeroStarknetAddress} from '../../utils'
import {TYPE} from '../../Theme'
import Panel from "../Panel";

import eligibilityBadgeIcon from '../../../src/assets/starBadge.svg';
import {AutoRow, RowBetween} from "../Row";
import {AutoColumn} from "../Column";
import {ButtonDark} from "../ButtonStyled";
import {withRouter} from "react-router-dom";

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
  background: none;
  border: none;
  outline: none;
  padding: 12px 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  font-size: 16px;
  //margin-right: 1rem;

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

function LpContestLeaderboard({history, players, maxItems = 10}) {
	const [isEligibilityFilterChecked, setIsEligibilityFilterChecked] = useState(false);
	const [checkAccountQuery, setCheckAccountQuery] = useState('');
	const [isCheckAccountAddressValid, setIsCheckAccountAddressValid] = useState(false);
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
				.map((key) => players[key])
		)
	}, [arePlayersAvailable, players, isEligibilityFilterChecked])

	const handleEligibilitySwitcherChange = useCallback(() => {
		setIsEligibilityFilterChecked((v) => !v);
	}, []);

	const handleCheckAccountInputChange = useCallback((e) => {
		const value = e.currentTarget.value;
		if (!value) {
			setCheckAccountQuery('');
			setIsCheckAccountAddressValid(false);
			return;
		}
		setCheckAccountQuery(value);
		setIsCheckAccountAddressValid(isStarknetAddress(value, true));
	}, [setCheckAccountQuery]);

	const handleAccountSearch = useCallback((e) => {
		if (!(isCheckAccountAddressValid && checkAccountQuery)) { return }
		history.push('/lp-contest/' + checkAccountQuery)
	}, [isCheckAccountAddressValid, checkAccountQuery]);

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

	// if (!arePlayersAvailable) {
	// 	return <LocalLoader/>
	// }


	return (
		<>
			<AutoColumn gap={"20px"}>
				<AutoRow gap={"10px"} style={{width: 'calc(100% + 10px)'}}>
					<SearchWrapper>
						<Input
							type='text'
							value={checkAccountQuery}
							onChange={handleCheckAccountInputChange}
							placeholder={'0x...'}
							maxLength={zeroStarknetAddress.length}
						/>
					</SearchWrapper>
					<div>
						<ButtonDark onClick={handleAccountSearch} disabled={!isCheckAccountAddressValid}>Check Account</ButtonDark>
					</div>
				</AutoRow>

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
						{!playersList?.length ? (
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
			</AutoColumn>
		</>
	)
}

export default withRouter(LpContestLeaderboard)
