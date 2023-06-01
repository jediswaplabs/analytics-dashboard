import React, { useCallback } from 'react'
import styled from 'styled-components'
import { isObject, isEmpty } from 'lodash'

import Panel from '../Panel'
import { useLpContestNftRanksData } from '../../contexts/LpContestData'

const scoreBannerThemeColors = {
  theme1: '#C23232',
  theme2: '#498028',
  theme3: '#06A1C2',
  theme4: '#CC4475',
  theme5: '#DAA00A',
  theme6: '#0E3D0D',
}

const Wrapper = styled(Panel)`
  display: flex;
  flex-direction: column;
  margin-top: 6px;
  padding: 24px 16px;
  border-radius: 5px;
`

const Title = styled.div`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`

const ScoreBannersGridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 8px;
  row-gap: 8px;
  align-items: start;
  justify-content: space-between;

  @media screen and (max-width: 1370px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 1150px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`

const ScoreBannerWrapper = styled.div`
  display: flex;
  background: linear-gradient(180deg, #59abf7 0%, rgba(70, 32, 171, 0) 100%);
  border-radius: 8px;
  padding: 10px;
  position: relative;
  //width: 200px;
  height: 70px;
  overflow: hidden;
  color: #fff;
  cursor: default;
  user-select: none;

  :after {
    content: '';
    position: absolute;
    top: -1px;
    right: -1px;
    height: 45px;
    width: 65%;
    min-width: 100px;
    clip-path: polygon(45% 0, 100% 0%, 100% 100%, 0% 100%);
    ${(props) =>
      props.themeColor &&
      `
      background: linear-gradient(180deg, ${props.themeColor} 5.47%,rgba(86,30,81,0) 78.84%);
    `}
  }

  .section {
    display: flex;
    flex-direction: column;
    width: 50%;
    position: relative;
    z-index: 1;
  }

  .section:last-child {
    text-align: right;
  }

  .title {
    margin-bottom: 5px;
    font-weight: 700;
    font-size: 10px;
    white-space: nowrap;
  }

  .content {
    font-weight: 700;
    font-size: 16px;
    white-space: nowrap;
  }
`

function LpContestNftCategories() {
  const nftRanksData = useLpContestNftRanksData()

  const getRankForBanner = useCallback(
    (index = 0, top = false) => {
      const startKeyName = `L1P${index}Start`
      const endKeyName = `L1P${index}End`
      if (!isObject(nftRanksData) || isEmpty(nftRanksData)) {
        return '...'
      }
      if (!nftRanksData[startKeyName]) {
        console.error(`Rank ${startKeyName} does not exist`)
        return ''
      }
      if (!nftRanksData[endKeyName]) {
        console.error(`Rank ${endKeyName} does not exist`)
        return ''
      }
      if (top) {
        return `Top ${nftRanksData[startKeyName] - 1}`
      }
      return `${nftRanksData[startKeyName]}-${nftRanksData[endKeyName]}`
    },
    [nftRanksData]
  )

  return (
    <Wrapper>
      <Title>NFT Categories</Title>
      <ScoreBannersGridRow>
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme1}
          leftTitle={'Rank'}
          leftContent={getRankForBanner(1, true)}
          rightTitle={'NFT Unlock'}
          rightContent={'L1PW'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme2}
          leftTitle={'Rank'}
          leftContent={getRankForBanner(1)}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P1'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme3}
          leftTitle={'Rank'}
          leftContent={getRankForBanner(2)}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P2'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme4}
          leftTitle={'Rank'}
          leftContent={getRankForBanner(3)}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P3'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme5}
          leftTitle={'Rank'}
          leftContent={getRankForBanner(4)}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P4'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme6}
          leftTitle={'Rank'}
          leftContent={getRankForBanner(5)}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P5'}
        />
      </ScoreBannersGridRow>
    </Wrapper>
  )
}

function ScoreBanner({ themeColor, leftTitle = '', leftContent = '', rightTitle = '', rightContent = '' }) {
  return (
    <ScoreBannerWrapper themeColor={themeColor}>
      <div className={'section'}>
        <div className={'title'}>{leftTitle}</div>
        <div className={'content'}>{leftContent}</div>
      </div>
      <div className={'section'}>
        <div className={'title'}>{rightTitle}</div>
        <div className={'content'}>{rightContent}</div>
      </div>
    </ScoreBannerWrapper>
  )
}

export default LpContestNftCategories
