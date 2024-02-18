import React from 'react'
import styled from 'styled-components'

import nftDecorationImage from './nft_decoration.png'
import nftDecorationImage_x2 from './nft_decoration@x2.png'

const scoreBannerThemeColors = {
  theme1: '#B77C2E',
  theme2: '#1B1B1B',
}

const Wrapper = styled.div``

const ScoreBannerDecoration = styled.div`
  position: relative;
  height: 100%;
  img {
    position: absolute;
    right: 0;
    bottom: 0;
    max-width: 100%;
  }
`

const ScoreBannersGridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 16px;
  align-items: start;
  justify-content: space-between;

  @media screen and (max-width: 880px) {
    grid-template-columns: 1fr;

    ${ScoreBannerDecoration} {
      display: none;
    }
  }
`

const ScoreBannerWrapper = styled.div`
  display: flex;
  border-radius: 8px;
  padding: 10px;
  position: relative;
  //width: 200px;
  height: 70px;
  overflow: hidden;
  color: #fff;
  cursor: default;
  user-select: none;

    ${(props) =>
      props.themeColor &&
      `
      background: linear-gradient(97deg, ${props.themeColor} 17.34%, rgba(183, 124, 46, 0.06) 98.33%);
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

function VolumeContestNftCategories() {
  return (
    <Wrapper>
      <ScoreBannersGridRow>
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme1}
          leftTitle={'Score'}
          leftContent={'8000'}
          rightTitle={'NFT Unlock'}
          rightContent={'T1A1'}
        />
        <ScoreBannerDecoration>
          <img src={nftDecorationImage} srcSet={nftDecorationImage + ' 1x,' + nftDecorationImage_x2 + ' 2x'} alt={''} />
        </ScoreBannerDecoration>
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme2}
          leftTitle={'Score'}
          leftContent={'6000-7999'}
          rightTitle={'NFT Unlock'}
          rightContent={'T1A2'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme2}
          leftTitle={'Score'}
          leftContent={'4000-5999'}
          rightTitle={'NFT Unlock'}
          rightContent={'T1A3'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme2}
          leftTitle={'Score'}
          leftContent={'2000-3999'}
          rightTitle={'NFT Unlock'}
          rightContent={'T1A4'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme2}
          leftTitle={'Score'}
          leftContent={'500-1999'}
          rightTitle={'NFT Unlock'}
          rightContent={'T1A5'}
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

export default VolumeContestNftCategories
