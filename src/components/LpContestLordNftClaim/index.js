import React, { useRef } from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import { EffectFade } from 'swiper'
import { Play } from 'react-feather'

import 'swiper/swiper.css'
import 'swiper/modules/navigation/navigation.min.css'
import 'swiper/modules/effect-fade/effect-fade.min.css'

import L1PW from './L1PW.png'
import L1P1 from './L1P1.png'
import L1P2 from './L1P2.png'
import L1P3 from './L1P3.png'
import L1P4 from './L1P4.png'
import L1P5 from './L1P5.png'

import L1PW_x2 from './L1PW@x2.png'
import L1P1_x2 from './L1P1@x2.png'
import L1P2_x2 from './L1P2@x2.png'
import L1P3_x2 from './L1P3@x2.png'
import L1P4_x2 from './L1P4@x2.png'
import L1P5_x2 from './L1P5@x2.png'

import Panel from '../Panel'

const Wrapper = styled(Panel)`
  display: flex;
  flex-direction: column;
  margin-top: 6px;
  padding: 32px 24px;
  border-radius: 5px;
`

const Title = styled.div`
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  user-select: none;
`

const Slider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;

  .swiper {
    width: 100%;
  }

  .swiper-wrapper {
    align-items: center;
  }

  .swiper-slide {
    text-align: center;
    user-select: none;

    img {
      max-width: 270px;
      width: 100%;
    }
  }
`

const NavigationArrow = styled.div`
  color: #50d5ff;
  display: inline-flex;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  cursor: pointer;
  z-index: 1;
  user-select: none;

  svg {
    fill: #50d5ff;
  }

  &.swiper-button-disabled {
    opacity: 0.5;
  }
`
const NavigationArrowPrev = styled(NavigationArrow)`
  left: 0;

  svg {
    transform: rotate(180deg);
  }
`
const NavigationArrowNext = styled(NavigationArrow)`
  right: 0;
`

function LpContestLordNftClaim() {
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)

  return (
    <Wrapper>
      <Title>NFTs Showcase</Title>
      <Slider>
        <Swiper
          modules={[Navigation, EffectFade]}
          spaceBetween={0}
          effect={'fade'}
          speed={0}
          slidesPerView={1}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          resistanceRatio={0.5}
          style={{ paddingLeft: '20px', paddingRight: '20px' }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = navigationPrevRef.current
            swiper.params.navigation.nextEl = navigationNextRef.current
          }}
        >
          <SwiperSlide>
            <img src={L1PW} srcSet={L1PW + ' 1x,' + L1PW_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={L1P2} srcSet={L1P1 + ' 1x,' + L1P1_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={L1P2} srcSet={L1P2 + ' 1x,' + L1P2_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={L1P3} srcSet={L1P3 + ' 1x,' + L1P3_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={L1P4} srcSet={L1P4 + ' 1x,' + L1P4_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={L1P5} srcSet={L1P5 + ' 1x,' + L1P5_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <NavigationArrowPrev ref={navigationPrevRef}>
            <Play size={30} />
          </NavigationArrowPrev>
          <NavigationArrowNext ref={navigationNextRef}>
            <Play size={30} />
          </NavigationArrowNext>
        </Swiper>
      </Slider>
    </Wrapper>
  )
}

export default LpContestLordNftClaim
