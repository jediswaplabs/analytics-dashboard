import React from 'react'
import styled, { css } from 'styled-components'
import { Accordion as AccordionWrapper, AccordionItem as Item } from '@szhsin/react-accordion'
import { ChevronDown } from 'react-feather'

import { TYPE } from '../../Theme'
import { AutoRow } from '../Row'

const Wrapper = styled.div``

const ItemWithChevron = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        <span className={'chevron-wrapper'}>
          <ChevronDown />
        </span>
        {header}
      </>
    }
  />
)

const Accordion = styled(AccordionWrapper)`
  flex-grow: 1;
`

const AccordionsLine = styled(AutoRow)`
  ${Accordion} {
    width: calc(100% / ${(props) => props.columnsAmount || 1});
  }
  @media screen and (max-width: ${(props) => (props.columnsAmount === 3 ? '1200px' : props.columnsAmount === 2 ? '960px' : '0px')}) {
    flex-direction: column;

    ${Accordion} {
      width: 100%;
      margin-bottom: 0 !important;
    }

    ${Accordion} + ${Accordion} {
      margin-top: 0 !important;
    }
  }
`

const AccordionItem = styled(ItemWithChevron)`
  --activeBackgroundColor: rgba(255, 255, 255, 0.05);

  & {
    background: transparent;
    border-radius: 8px;
    transition: all 0.25s;
    margin-bottom: 12px;
  }

  &:hover {
    background: var(--activeBackgroundColor);
  }

  .szh-accordion__item-btn {
    display: flex;
    width: 100%;
    padding: 12px;
    background: transparent;
    cursor: pointer;
    border: none;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    align-items: center;
    text-align: left;
  }

  .szh-accordion__item-btn .chevron-wrapper {
    margin-right: 10px;
    display: flex;
  }

  .szh-accordion__item-content {
    transition: height 0.25s cubic-bezier(0, 0, 0, 1);
  }

  .szh-accordion__item-panel {
    padding: 1rem;
  }

  svg {
    margin-left: auto;
    transition: transform 0.25s cubic-bezier(0, 0, 0, 1);
  }

  &.szh-accordion__item--expanded {
    background: var(--activeBackgroundColor);

    svg {
      transform: rotate(180deg);
    }
  }
`

const MAX_COLUMNS = 3
const DEFAULT_ACCORDION_PROPS = {
  transition: true,
  transitionTimeout: 250,
  allowMultiple: true,
}

const FAQ = ({ items = [], columns = 1, accordionProps = {} }) => {
  const columnsAmount = Math.min(Math.abs(columns), MAX_COLUMNS) || 1
  const columnSize = Math.ceil(items.length / columnsAmount)

  const mergedAccordionProps = {
    ...DEFAULT_ACCORDION_PROPS,
    ...accordionProps,
  }

  if (!items?.length) {
    return null
  }
  return (
    <Wrapper>
      <AccordionsLine gap={'12px'} align={'flex-start'} columnsAmount={columnsAmount}>
        {Array.from({ length: columnsAmount }).map((n, i) => {
          return (
            <Accordion {...mergedAccordionProps} key={i}>
              {items.slice(i * columnSize, (i + 1) * columnSize).map(({ header, content }, i) => (
                <AccordionItem header={header} key={i}>
                  <TYPE.body color={'text1'}>{content}</TYPE.body>
                </AccordionItem>
              ))}
            </Accordion>
          )
        })}
      </AccordionsLine>
    </Wrapper>
  )
}

export default FAQ
