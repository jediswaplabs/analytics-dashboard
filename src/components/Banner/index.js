import React from 'react'
import styled from 'styled-components'
import Panel from '../Panel'

const PollingDot = styled.div`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green2};
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 14px;
`

const TitleIconWrapper = styled.div`
  display: flex;
  margin-right: 0.75rem;
`

const Wrapper = styled(Panel)`
  padding: 24px;
  position: relative;
  color: #fff;
  overflow: hidden;

  ${PollingDot} {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  @media screen and (max-width: 800px) {
    padding: 14px;
  }
`
const Content = styled.div`
  font-weight: 700;
  font-size: 26px;
`

const MainContent = styled.div`
  position: relative;
  z-index: 2;
`

export const DecorationWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  & > * {
    position: absolute;
    bottom: 0;
    right: 0;
  }
`

export function Banner({ className, title, titleIcon = null, decoration = null, content, showPollingDot = false, style = {} }) {
  return (
    <Wrapper className={className} style={style}>
      <MainContent>
        <Title>
          {titleIcon && <TitleIconWrapper>{titleIcon}</TitleIconWrapper>}
          {title}
        </Title>
        <Content>{content}</Content>

        {showPollingDot && <PollingDot />}
      </MainContent>
      {decoration && <DecorationWrapper>{decoration}</DecorationWrapper>}
    </Wrapper>
  )
}
