import React from 'react'
import styled from 'styled-components'
import Panel from "../Panel";

const PollingDot = styled.div`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green2};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 14px;
`;

const TitleIconWrapper = styled.div`
  display: flex;
  margin-right: .75rem;
`;

const Wrapper = styled(Panel)`
  padding: 24px;
  position: relative;
  color: #fff;

  ${PollingDot} {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  @media screen and (max-width: 800px) {
    padding: 14px;
  }
`;
const Content = styled.div`
  font-weight: 700;
  font-size: 26px;
`;



export function Banner({title, titleIcon = null, content, showPollingDot}) {
	return (
		<Wrapper>
			<Title>
				{titleIcon && (<TitleIconWrapper>{titleIcon}</TitleIconWrapper>)}
				{title}
			</Title>
			<Content>
				{content}
			</Content>

			{showPollingDot && (<PollingDot />)}
		</Wrapper>
	)
}

