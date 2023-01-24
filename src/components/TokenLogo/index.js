import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {isStarknetAddress} from '../../utils'

const BAD_IMAGES = {}

export const STARKNET_LOGO_ADDRESSES = {
    '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3': {
        symbol: 'DAI',
        logoUrl: require('../../assets/tokens/0x6B175474E89094C44Da98b954EedeAC495271d0F.png'),
    },
    '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8': {
        symbol: "USDC",
        logoUrl: require('../../assets/tokens/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.png'),
    },
    '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8': {
        symbol: "USDT",
        logoUrl: require('../../assets/tokens/0xdAC17F958D2ee523a2206206994597C13D831ec7.png'),
    },
    '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac': {
        symbol: "WBTC",
        logoUrl: require('../../assets/tokens/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.png'),
    },
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': {
        symbol: "ETH",
        logoUrl: require('../../assets/tokens/0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7.png'),
    }
}

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

const StyledEthereumLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
  }
`

export default function TokenLogo({ address, symbol, header = false, size = '24px', ...rest }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [address])

  if (error || BAD_IMAGES[address] || !isStarknetAddress(address)) {
    return (
      <Inline>
        <span {...rest} alt={''} style={{ fontSize: size }} role="img" aria-label="face">
          🤔
        </span>
      </Inline>
    )
  }

  if (STARKNET_LOGO_ADDRESSES[address]?.symbol === 'ETH') {
    return (
      <StyledEthereumLogo size={size} {...rest}>
        <img
            loading={'lazy'}
          src={STARKNET_LOGO_ADDRESSES[address].logoUrl}
          style={{
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
            borderRadius: '24px',
          }}
          alt=""
        />
      </StyledEthereumLogo>
    )
  }

  const path = STARKNET_LOGO_ADDRESSES[address]
      ? STARKNET_LOGO_ADDRESSES[address].logoUrl
      : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

  return (
    <Inline>
      <Image
        {...rest}
        alt={''}
        src={path}
        size={size}
        onError={(event) => {
          BAD_IMAGES[address] = true
          setError(true)
          event.preventDefault()
        }}
      />
    </Inline>
  )
}
