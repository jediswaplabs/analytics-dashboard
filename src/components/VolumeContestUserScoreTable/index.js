import React from 'react'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import 'react-tooltip/dist/react-tooltip.css'

import { EmptyCard } from '..'
import { formattedNum } from '../../utils'
import { TYPE } from '../../Theme'
import { VolumeContestPanel } from '../Panel'

import { withRouter } from 'react-router-dom'
import { AutoColumn } from '../Column'
import LocalLoader from '../LocalLoader'

dayjs.extend(weekday)

const TableWrapper = styled(VolumeContestPanel)`
  padding: 24px 16px;
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: #fff;

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1.8fr 1fr 1fr;
  grid-template-areas: 'week volume score';

  > * {
    justify-content: flex-end;
  }

  ${DataText} {
    padding-left: 5px;
    padding-right: 5px;
  }

  ${DataText}:first-child {
    padding-left: 20px;
    padding-right: 20px;
    text-align: left;
  }
`

const DashGridItemRow = styled(DashGrid)`
  border-radius: 8px;

  ${DataText} {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
  }
`

function VolumeContestUserScoreTable({ weeks }) {
  const sortWeeksInDescendingOrder = (a, b) => b?.id - a?.id
  const areWeeksAvailable = !!weeks?.length

  const ListItem = ({ week }) => {
    const hasTheDatePassed = (date) => dayjs().isAfter(dayjs(date))
    return (
      <DashGridItemRow focus={true}>
        <DataText area="week" fontWeight="500" justifyContent="flex-start">
          {`${dayjs(week?.startDt).format('MMM DD')} - ${dayjs(week?.endDt).subtract(1, 'day').format('MMM DD')}`}
        </DataText>
        <DataText area="volume" fontWeight="500" justifyContent="center">
          {hasTheDatePassed(week?.startDt) ? formattedNum(week.volume, true) : '-'}
        </DataText>
        <DataText area="score" fontWeight="500" justifyContent="center">
          {hasTheDatePassed(week?.startDt) ? formattedNum(Math.floor(week.score)) : '-'}
        </DataText>
      </DashGridItemRow>
    )
  }

  if (!weeks) {
    return (
      <TableWrapper>
        <LocalLoader />
      </TableWrapper>
    )
  }

  if (!weeks?.length) {
    return (
      <TableWrapper>
        <TYPE.main style={{ textAlign: 'center' }}>No available data </TYPE.main>
      </TableWrapper>
    )
  }

  const weeksList =
    weeks?.length &&
    weeks.sort(sortWeeksInDescendingOrder).map((week, index) => {
      return <ListItem key={index} index={week.startDt} week={week} />
    })

  return (
    <>
      <TableWrapper>
        <AutoColumn gap={'20px'}>
          <DashGrid center>
            <DataText alignItems="center" justifyContent="flex-start">
              <TYPE.main area="week" color={'jediGray'}>
                Week
              </TYPE.main>
            </DataText>
            <DataText alignItems="center" justifyContent="center">
              <TYPE.main area="volume" color={'jediGray'}>
                Volume added
              </TYPE.main>
            </DataText>
            <DataText alignItems="center" justifyContent="center">
              <TYPE.main area="score" color={'jediGray'}>
                Score
              </TYPE.main>
            </DataText>
          </DashGrid>
          {!areWeeksAvailable ? <EmptyCard height="auto">No data found.</EmptyCard> : <List p={0}>{weeksList}</List>}
        </AutoColumn>
      </TableWrapper>
    </>
  )
}

export default withRouter(VolumeContestUserScoreTable)
