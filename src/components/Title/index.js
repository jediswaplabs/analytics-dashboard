import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Flex } from 'rebass'
import Link from '../Link'
import { RowFixed } from '../Row'
import Logo from '../../assets/jediswap-logo.png'
import Wordmark from '../../assets/wordmark.png'

import { BasicLink } from '../Link'
import { useMedia } from 'react-use'

const TitleWrapper = styled.div`
  text-decoration: none;
  z-index: 10;
  width: 100%;
  &:hover {
    cursor: pointer;
  }
`

const UniIcon = styled(Link)`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const Option = styled.div`
  font-weight: 500;
  font-size: 14px;
  opacity: ${({ activeText }) => (activeText ? 1 : 0.6)};
  color: ${({ theme }) => theme.white};
  display: flex;
  margin-left: 12px;
  :hover {
    opacity: 1;
  }
`

const AccentText = styled.span`
  background: linear-gradient(90deg, #4bd4ff 0%, #ef35ff 97.26%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

export default function Title() {
  const history = useHistory()
  const below1080 = useMedia('(max-width: 1080px)')

  return (
    <TitleWrapper>
      <Flex alignItems="center" style={{ justifyContent: 'space-between' }}>
        <RowFixed>
          <UniIcon id="link" onClick={() => history.push('/')}>
            <img width={'24px'} src={Logo} alt="logo" />
          </UniIcon>
          {!below1080 && <img width={'110px'} style={{ marginLeft: '8px', marginTop: '-4px' }} src={Wordmark} alt="logo" />}
        </RowFixed>
        {below1080 && (
          <RowFixed style={{ alignItems: 'flex-end' }}>
            <BasicLink to="/home">
              <Option activeText={history.location.pathname === '/home' ?? undefined}>Overview</Option>
            </BasicLink>
            <BasicLink to="/tokens">
              <Option
                activeText={
                  (history.location.pathname.split('/')[1] === 'tokens' || history.location.pathname.split('/')[1] === 'token') ?? undefined
                }
              >
                Tokens
              </Option>
            </BasicLink>
            <BasicLink to="/pairs">
              <Option
                activeText={(history.location.pathname.split('/')[1] === 'pairs' || history.location.pathname.split('/')[1] === 'pair') ?? undefined}
              >
                Pairs
              </Option>
            </BasicLink>

            <BasicLink to="/accounts">
              <Option
                activeText={
                  (history.location.pathname.split('/')[1] === 'accounts' || history.location.pathname.split('/')[1] === 'account') ?? undefined
                }
              >
                Accounts
              </Option>
            </BasicLink>

            {/*<BasicLink to="/lp-contest">*/}
            {/*  <Option activeText={history.location.pathname.split('/')[1] === 'lp-contest' ?? undefined} style={{ opacity: 1 }}>*/}
            {/*    <AccentText>LP Contest</AccentText>*/}
            {/*  </Option>*/}
            {/*</BasicLink>*/}

            <BasicLink to="/volume-contest">
              <Option activeText={history.location.pathname.split('/')[1] === 'volume-contest' ?? undefined} style={{ opacity: 1 }}>
                <AccentText>Volume Contest</AccentText>
              </Option>
            </BasicLink>
          </RowFixed>
        )}
      </Flex>
    </TitleWrapper>
  )
}
