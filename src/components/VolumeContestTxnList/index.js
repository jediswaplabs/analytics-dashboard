import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useMedia } from 'react-use'

import { ChevronLeft } from 'react-feather'
// import { ChevronRight } from 'react-feather'

import { formatTime, formattedNum, urls, convertDateToUnixFormat } from '../../utils'

import LocalLoader from '../LocalLoader'
import { Box, Flex, Text } from 'rebass'
import Link from '../Link'
import { EmptyCard } from '..'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'
import { updateNameData } from '../../utils/data'
import { VolumeContestPanel } from '../Panel'
import { AutoColumn } from '../Column'

dayjs.extend(utc)

const TableWrapper = styled(VolumeContestPanel)`
  padding: 24px 16px;
`

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Arrow = styled(ChevronLeft)`
  color: #50d5ff;
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const ArrowLeft = styled(Arrow)``
const ArrowRight = styled(Arrow)`
  transform: rotate(180deg);
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: #fff;

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 0.8fr 0.8fr 0.8fr 0.7fr;
  grid-template-areas: 'tnx totalValue totalAmount1 totalAmount2 time';

  > * {
    justify-content: flex-end;
  }

  ${DataText} {
    padding-left: 5px;
    padding-right: 5px;
  }

  ${DataText}:first-child {
    padding-left: 20px;
    padding-right: 20px;
    text-align: left;
  }

  @media screen and (max-width: 780px) {
    grid-template-columns: 1.8fr 1fr 1fr;
    grid-template-areas: 'tnx totalValue time';
  }
`

const DashGridItemRow = styled(DashGrid)`
  border-radius: 8px;

  ${DataText} {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
  }
`

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.jediGray};
  user-select: none;
  text-align: end;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.text1};
  }

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`

const SORT_FIELD = {
  VALUE: 'amountUSD',
  AMOUNT0: 'token0Amount',
  AMOUNT1: 'token1Amount',
  TIMESTAMP: 'timestamp',
}

const TXN_TYPE = {
  SWAP: 'Swaps',
}

const ITEMS_PER_PAGE = 10

function getTransactionType(event, symbol0, symbol1) {
  const formattedS0 = symbol0?.length > 8 ? symbol0.slice(0, 7) + '...' : symbol0
  const formattedS1 = symbol1?.length > 8 ? symbol1.slice(0, 7) + '...' : symbol1
  switch (event) {
    case TXN_TYPE.ADD:
      return 'Add ' + formattedS0 + ' and ' + formattedS1
    case TXN_TYPE.REMOVE:
      return 'Remove ' + formattedS0 + ' and ' + formattedS1
    case TXN_TYPE.SWAP:
      return 'Swap ' + formattedS0 + ' for ' + formattedS1
    default:
      return ''
  }
}

function VolumeContestTxnList({ transactions, account }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.TIMESTAMP)
  const [filteredItems, setFilteredItems] = useState()
  const [txFilter, setTxFilter] = useState(TXN_TYPE.ALL)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [transactions])

  // parse the txns and format for UI
  useEffect(() => {
    if (transactions?.swaps) {
      let newTxns = []
      if (transactions.swaps.length > 0) {
        transactions.swaps.map((swap) => {
          const netToken0 = swap.amount0In - swap.amount0Out
          const netToken1 = swap.amount1In - swap.amount1Out

          let newTxn = {}

          if (netToken0 < 0) {
            newTxn.token0Symbol = updateNameData(swap.pair).token0.symbol
            newTxn.token1Symbol = updateNameData(swap.pair).token1.symbol
            newTxn.token0Amount = Math.abs(netToken0)
            newTxn.token1Amount = Math.abs(netToken1)
          } else if (netToken1 < 0) {
            newTxn.token0Symbol = updateNameData(swap.pair).token1.symbol
            newTxn.token1Symbol = updateNameData(swap.pair).token0.symbol
            newTxn.token0Amount = Math.abs(netToken1)
            newTxn.token1Amount = Math.abs(netToken0)
          }

          newTxn.hash = swap.transactionHash
          newTxn.timestamp = dayjs.utc(swap.timestamp).local().format()
          newTxn.type = TXN_TYPE.SWAP

          newTxn.amountUSD = swap.amountUSD
          newTxn.account = swap.to
          return newTxns.push(newTxn)
        })
      }

      setFilteredItems(newTxns)
      let extraPages = 1
      if (newTxns.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      if (newTxns.length === 0) {
        setMaxPage(1)
      } else {
        setMaxPage(Math.floor(newTxns.length / ITEMS_PER_PAGE) + extraPages)
      }
    }
  }, [transactions, txFilter])

  useEffect(() => {
    setPage(1)
  }, [txFilter])

  const filteredList =
    filteredItems &&
    filteredItems
      .sort((a, b) => {
        let valueA = a[sortedColumn]
        let valueB = b[sortedColumn]

        if (sortedColumn === SORT_FIELD.TIMESTAMP) {
          valueA = convertDateToUnixFormat(a[sortedColumn])
          valueB = convertDateToUnixFormat(b[sortedColumn])
        }

        return parseFloat(valueA) > parseFloat(valueB) ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)

  const below780 = useMedia('(max-width: 780px)')

  const ListItem = ({ item }) => {
    return (
      <DashGridItemRow focus={true}>
        <DataText area="txn" fontWeight="500" justifyContent="flex-start">
          <Link external href={urls.showTransaction(item.hash)}>
            {getTransactionType(item.type, item.token1Symbol, item.token0Symbol)}
          </Link>
        </DataText>
        <DataText area="totalValue" justifyContent="center">
          {formattedNum(item.amountUSD, true)}
        </DataText>

        {!below780 && (
          <>
            <DataText area="totalAmount1" justifyContent="center">
              {formattedNum(item.token1Amount) + ' '} <FormattedName text={item.token1Symbol} maxCharacters={5} margin={true} />
            </DataText>
            <DataText area="totalAmount2" justifyContent="center">
              {formattedNum(item.token0Amount) + ' '} <FormattedName text={item.token0Symbol} maxCharacters={5} margin={true} />
            </DataText>
          </>
        )}

        <DataText area="time" justifyContent="center">
          {formatTime(convertDateToUnixFormat(item.timestamp))}
        </DataText>
      </DashGridItemRow>
    )
  }

  if (!filteredList) {
    return (
      <TableWrapper>
        <LocalLoader />
      </TableWrapper>
    )
  }

  if (!filteredList?.length && account) {
    return (
      <TableWrapper>
        <TYPE.main style={{ textAlign: 'center' }}>No available data for {account}</TYPE.main>
      </TableWrapper>
    )
  }

  const transactionsList =
    filteredList?.length &&
    filteredList.map((item, index) => {
      return <ListItem key={index} index={index + 1} item={item} />
    })

  return (
    <>
      <TableWrapper>
        <AutoColumn gap={'20px'}>
          <DashGrid center>
            <DataText alignItems="center" justifyContent="flex-start">
              <TYPE.main area="tnx" color={'jediGray'}></TYPE.main>
            </DataText>
            <DataText alignItems="center" justifyContent="center">
              <ClickableText
                color="text1"
                area="value"
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.VALUE)
                  setSortDirection(sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection)
                }}
              >
                Total Value {sortedColumn === SORT_FIELD.VALUE ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </DataText>

            {!below780 && (
              <>
                <DataText alignItems="center" justifyContent="center">
                  <ClickableText
                    area="totalAmount1"
                    color="jediGray"
                    onClick={() => {
                      setSortedColumn(SORT_FIELD.AMOUNT1)
                      setSortDirection(sortedColumn !== SORT_FIELD.AMOUNT1 ? true : !sortDirection)
                    }}
                  >
                    Total Amount {sortedColumn === SORT_FIELD.AMOUNT1 ? (sortDirection ? '↑' : '↓') : ''}
                  </ClickableText>
                </DataText>
                <DataText alignItems="center" justifyContent="center">
                  <ClickableText
                    area="totalAmount2"
                    color="jediGray"
                    onClick={() => {
                      setSortedColumn(SORT_FIELD.AMOUNT0)
                      setSortDirection(sortedColumn !== SORT_FIELD.AMOUNT0 ? true : !sortDirection)
                    }}
                  >
                    Total Amount {sortedColumn === SORT_FIELD.AMOUNT0 ? (sortDirection ? '↑' : '↓') : ''}
                  </ClickableText>
                </DataText>
              </>
            )}
            <DataText alignItems="center" justifyContent="center">
              <ClickableText
                area="time"
                color="jediGray"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.TIMESTAMP)
                  setSortDirection(sortedColumn !== SORT_FIELD.TIMESTAMP ? true : !sortDirection)
                }}
              >
                Time {sortedColumn === SORT_FIELD.TIMESTAMP ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </DataText>
          </DashGrid>

          {!filteredList?.length ? <EmptyCard height="auto">No recent transactions found.</EmptyCard> : <List p={0}>{transactionsList}</List>}

          <PageButtons>
            <ArrowLeft
              faded={page === 1}
              onClick={(e) => {
                setPage(page === 1 ? page : page - 1)
              }}
            ></ArrowLeft>

            <TYPE.body style={{ padding: '0 20px' }}>{page + ' of ' + maxPage}</TYPE.body>

            <ArrowRight
              faded={page === maxPage}
              onClick={(e) => {
                setPage(page === maxPage ? page : page + 1)
              }}
            ></ArrowRight>
          </PageButtons>
        </AutoColumn>
      </TableWrapper>
    </>
  )
}

export default VolumeContestTxnList
