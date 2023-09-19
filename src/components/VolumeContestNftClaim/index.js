import React, { useRef } from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import { EffectCoverflow } from 'swiper'
import { Play } from 'react-feather'

import 'swiper/swiper.css'
import 'swiper/modules/navigation/navigation.min.css'
import 'swiper/modules/effect-coverflow/effect-coverflow.min.css'

import T1A1 from './T1A1.png'

import T1A1_x2 from './T1A1@x2.png'

// import L1PW from './L1PW.png'
// import L1P1 from './L1P1.png'
// import L1P2 from './L1P2.png'
// import L1P3 from './L1P3.png'
// import L1P4 from './L1P4.png'
// import L1P5 from './L1P5.png'
//
// import L1PW_x2 from './L1PW@x2.png'
// import L1P1_x2 from './L1P1@x2.png'
// import L1P2_x2 from './L1P2@x2.png'
// import L1P3_x2 from './L1P3@x2.png'
// import L1P4_x2 from './L1P4@x2.png'
// import L1P5_x2 from './L1P5@x2.png'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
      max-width: 100%;
      opacity: 0;
      transition: all 0.2s;
      filter: saturate(0%) opacity(0.3);
    }
  }

  .swiper-slide-active {
    img {
      filter: none;
    }
  }

  .swiper-slide-active,
  .swiper-slide-next,
  .swiper-slide-prev {
    img {
      opacity: 1; /* Show center, left, and right slides */
      pointer-events: all;
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

function VolumeContestNftClaim() {
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)

  return (
    <Wrapper>
      <Slider>
        <Swiper
          modules={[Navigation, EffectCoverflow]}
          spaceBetween={0}
          effect={'coverflow'}
          // speed={0}
          centeredSlides={true}
          slidesPerView={'auto'}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 310,
            depth: 200,
            modifier: 1,
            scale: 0.9,
            slideShadows: false,
          }}
          resistanceRatio={0.5}
          style={{ paddingLeft: '20px', paddingRight: '20px' }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = navigationPrevRef.current
            swiper.params.navigation.nextEl = navigationNextRef.current
          }}
        >
          <SwiperSlide>
            <img src={T1A1} srcSet={T1A1 + ' 1x,' + T1A1_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={T1A1} srcSet={T1A1 + ' 1x,' + T1A1_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={T1A1} srcSet={T1A1 + ' 1x,' + T1A1_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={T1A1} srcSet={T1A1 + ' 1x,' + T1A1_x2 + ' 2x'} alt={''} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={T1A1} srcSet={T1A1 + ' 1x,' + T1A1_x2 + ' 2x'} alt={''} />
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

export default VolumeContestNftClaim
