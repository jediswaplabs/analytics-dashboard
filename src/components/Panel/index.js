import { Box as RebassBox } from 'rebass'
import styled, { css } from 'styled-components'

const panelPseudo = css`
  :after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
  }

  @media only screen and (min-width: 40em) {
    :after {
      content: unset;
    }
  }
`

const Panel = styled(RebassBox)`
  position: relative;
  background-color: ${({ theme }) => theme.advancedBG};
  padding: 1.25rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 8px;
  box-shadow: rgb(255 255 255 / 50%) 0px 30.0211px 43.1072px -27.7118px inset,
    rgb(255 255 255) 0px 5.38841px 8.46749px -3.07909px inset,
    rgb(96 68 145 / 30%) 0px -63.1213px 52.3445px -49.2654px inset,
    rgb(202 172 255 / 30%) 0px 75.4377px 76.9772px -36.9491px inset,
    rgb(154 146 210 / 30%) 0px 3.07909px 13.8559px inset, rgb(227 222 255 / 20%) 0px 0.769772px 30.7909px inset;
  border: 1px solid ${({ theme }) => theme.bg3};

  :hover {
    cursor: ${({ hover }) => hover && 'pointer'};
    border: ${({ hover, theme }) => hover && '1px solid' + theme.bg5};
  }

  ${(props) => props.background && `background-color: ${props.theme.advancedBG};`}

  ${(props) => (props.area ? `grid-area: ${props.area};` : null)}

  ${(props) =>
    props.grouped &&
    css`
      @media only screen and (min-width: 40em) {
        &:first-of-type {
          border-radius: 20px 20px 0 0;
        }
        &:last-of-type {
          border-radius: 0 0 20px 20px;
        }
      }
    `}

  ${(props) =>
    props.rounded &&
    css`
      border-radius: 8px;
      @media only screen and (min-width: 40em) {
        border-radius: 10px;
      }
    `};

  ${(props) => !props.last && panelPseudo}
`

export default Panel

// const Panel = styled.div`
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   border-radius: 12px;
//   background-color: ${({ theme }) => theme.advancedBG};
//   padding: 1.25rem;
//   box-sizing: border-box;
//   box-shadow: 0 1.1px 2.8px -9px rgba(0, 0, 0, 0.008), 0 2.7px 6.7px -9px rgba(0, 0, 0, 0.012),
//     0 5px 12.6px -9px rgba(0, 0, 0, 0.015), 0 8.9px 22.6px -9px rgba(0, 0, 0, 0.018),
//     0 16.7px 42.2px -9px rgba(0, 0, 0, 0.022), 0 40px 101px -9px rgba(0, 0, 0, 0.03);
// `
