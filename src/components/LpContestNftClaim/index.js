import React, {useRef} from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { Play } from 'react-feather'

import 'swiper/swiper.css';
import 'swiper/modules/navigation/navigation.min.css';

import ShrimpNFT from './shrimp.svg';
import OctopusNFT from './octopus.svg';

import Panel from "../Panel";
import {TYPE} from "../../Theme";

const Wrapper = styled(Panel)`
  display: flex;
  flex-direction: column;
  margin-top: 6px; 
  padding: 20px 24px; 
  border-radius: 5px;
`

const Title = styled.div``;

const Slider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  
  .swiper {
    width: 100%;
  }
  
  .swiper-slide {
    text-align: center;
    user-select: none;
  }
`;

const NavigationArrow = styled.div`
  color: #50D5FF;
  display: inline-flex;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  cursor: pointer;
  z-index: 1;

  svg {
    fill: #50D5FF;
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

function LpContestNftClaim() {
	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);

	return (
		<Wrapper>
			<Title>
				<TYPE.main lineHeight={'1.5rem'}>
					Liquidity providers need the Minimum required contest points for an NFT to get it unlocked for claim
				</TYPE.main>
			</Title>
			<Slider>
				<Swiper
					modules={[Navigation]}
					spaceBetween={0}
					slidesPerView={1}
					navigation={{
						prevEl: navigationPrevRef.current,
						nextEl: navigationNextRef.current,
					}}
					resistanceRatio={0.5}
					style={{ paddingLeft: '20px', paddingRight: '20px' }}
				>
					<SwiperSlide>
						<img src={ShrimpNFT} />
					</SwiperSlide>
					<SwiperSlide>
						<img src={OctopusNFT} />
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

export default LpContestNftClaim
