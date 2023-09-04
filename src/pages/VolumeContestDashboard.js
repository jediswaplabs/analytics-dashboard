import React, { useMemo } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'

import { TYPE } from '../Theme'
import { PageWrapper, FullWrapper } from '../components'

import styled from 'styled-components'

import { AutoRow, RowBetween } from '../components/Row'
import { Banner } from '../components/Banner'
import { Flag, Watch, Box } from 'react-feather'
//import { useVolumeContestPlayersData } from '../contexts/LpContestData'

import contestFlagIcon from '../../src/assets/flag.svg'
import { AutoColumn } from '../components/Column'
//import VolumeContestNftCategories from '../components/LpContestNftCategories'

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

  @media screen and (max-width: 1180px) {
    grid-template-columns: minmax(0, 1fr);
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

function VolumeContestDashboard() {
  return (
    <PageWrapper>
      <FullWrapper>
        <Title>
          <TitleIconWrapper>
            <img src={contestFlagIcon} alt={''} />
          </TitleIconWrapper>
          <TYPE.largeHeader style={{ fontWeight: 700 }}>The Trade Federation Awakens</TYPE.largeHeader>
        </Title>
      </FullWrapper>
    </PageWrapper>
  )
}

export default withRouter(VolumeContestDashboard)
