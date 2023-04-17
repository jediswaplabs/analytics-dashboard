import React from 'react'
import styled from 'styled-components'

import Panel from '../Panel'

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

  @media screen and (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`

// const ScoreBannerWrapper = styled(Panel)`
//   display: flex;
//   flex-direction: column;
//   border-radius: 8px;
//   padding: 0;
//   overflow: hidden;
//
//   .title-row {
//     background: rgba(1, 77, 168, 1);
//     display: grid;
//     width: 100%;
//     grid-template-columns: 1fr 1fr 1fr;
//     column-gap: 10px;
//     align-items: start;
//     justify-content: space-between;
//     overflow: hidden;
//   }
//
//   .title-row-item {
//     font-size: 10px;
//     font-weight: 700;
//     line-height: 20px;
//     text-align: center;
//     position: relative;
//     white-space: nowrap;
//
//     &.accent {
//       span {
//         position: relative;
//         z-index: 2;
//       }
//     }
//
//     &.accent:after {
//       content: '';
//       position: absolute;
//       top: -1px;
//       right: -1px;
//       height: 38px;
//       width: 140%;
//       z-index: 1;
//       clip-path: polygon(30% 0, 100% 0%, 100% 100%, 0% 100%);
//       ${(props) => props.themeColor && `
//         background: linear-gradient(180deg, ${props.themeColor} 5.47%,rgba(86,30,81,0) 78.84%);
//     `}
//     }
//   }
//
//   .content {
//     display: grid;
//     grid-row-gap: 10px;
//     padding: 10px 0;
//   }
//
//   .score-row {
//     display: grid;
//     width: 100%;
//     grid-template-columns: 1fr 1fr 1fr;
//     column-gap: 10px;
//     align-items: start;
//     justify-content: space-between;
//   }
//
//   .score-row-item {
//     padding: 0 10px;
//     text-align: center;
//     font-weight: 700;
//   }
// `

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
    font-size: 18px;
    white-space: nowrap;
  }
`

function LpContestNftCategories() {
  return (
    <Wrapper>
      <Title>NFT Categories</Title>
      <ScoreBannersGridRow>
        {/*<ScoreBannerWrapper themeColor={scoreBannerThemeColors.theme1}>*/}
        {/*	<div className={'title-row'}>*/}
        {/*		<TYPE.small className={'title-row-item'}>*/}
        {/*			<span>Min. Rank</span>*/}
        {/*		</TYPE.small>*/}
        {/*		<TYPE.small className={'title-row-item'}>*/}
        {/*			<span>Score</span>*/}
        {/*		</TYPE.small>*/}
        {/*		<TYPE.small className={'title-row-item accent'}>*/}
        {/*			<span>NFT Reward</span>*/}
        {/*		</TYPE.small>*/}
        {/*	</div>*/}
        {/*	<div className={'content'}>*/}
        {/*		{data.slice(0, 3).map((props) => {*/}
        {/*			return (*/}
        {/*				<div className={'score-row'} key={props.rank}>*/}
        {/*					{Object.values(props).map((prop) => {*/}
        {/*						return (*/}
        {/*							<TYPE.main className={'score-row-item'}>*/}
        {/*								<span>{prop}</span>*/}
        {/*							</TYPE.main>*/}
        {/*						)*/}
        {/*					})}*/}
        {/*				</div>*/}
        {/*			)*/}
        {/*		})}*/}
        {/*	</div>*/}
        {/*</ScoreBannerWrapper>*/}

        {/*<ScoreBannerWrapper themeColor={scoreBannerThemeColors.theme1}>*/}
        {/*	<div className={'title-row'}>*/}
        {/*		<TYPE.small className={'title-row-item'}>*/}
        {/*			<span>Min. Rank</span>*/}
        {/*		</TYPE.small>*/}
        {/*		<TYPE.small className={'title-row-item'}>*/}
        {/*			<span>Score</span>*/}
        {/*		</TYPE.small>*/}
        {/*		<TYPE.small className={'title-row-item accent'}>*/}
        {/*			<span>NFT Reward</span>*/}
        {/*		</TYPE.small>*/}
        {/*	</div>*/}
        {/*	<div className={'content'}>*/}
        {/*		{data.slice(3, 6).map((props) => {*/}
        {/*			return (*/}
        {/*				<div className={'score-row'} key={props.rank}>*/}
        {/*					{Object.values(props).map((prop) => {*/}
        {/*					return (*/}
        {/*						<TYPE.main className={'score-row-item'}>*/}
        {/*							<span>{prop}</span>*/}
        {/*						</TYPE.main>*/}
        {/*					)*/}
        {/*				})}*/}
        {/*				</div>*/}
        {/*			)*/}
        {/*		})}*/}
        {/*	</div>*/}
        {/*</ScoreBannerWrapper>*/}

        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme1}
          leftTitle={'Rank'}
          leftContent={'Top 10'}
          rightTitle={'NFT Unlock'}
          rightContent={'L1PW'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme2}
          leftTitle={'Percentile'}
          leftContent={'0-2%'}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P1'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme3}
          leftTitle={'Percentile'}
          leftContent={'3-10%'}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P2'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme4}
          leftTitle={'Percentile'}
          leftContent={'11-25%'}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P3'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme5}
          leftTitle={'Percentile'}
          leftContent={'26-55%'}
          rightTitle={'NFT Unlock'}
          rightContent={'L1P4'}
        />
        <ScoreBanner
          themeColor={scoreBannerThemeColors.theme6}
          leftTitle={'Percentile'}
          leftContent={'56-100%'}
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
