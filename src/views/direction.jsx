import React from 'react'
import styled from 'styled-components'

const directionAliases = {
  left: ['previous', 'backward', 'backwards'], 
  right: ['next', 'forward', 'forwards'],
  up: ['above'],
  down: ['below'],
}
const amountAliases = {
  '|': ['all', 'end', 'start', 'max', 'maximum', 'last', 'first'],
  '½': ['half'],
  '¼': ['quater'],
}

const invertedIndexD = {}
_.each(directionAliases, (aliases, name) => _.each(aliases, alias => invertedIndexD[alias] = name))
const invertedIndexA = {}
_.each(amountAliases, (aliases, name) => _.each(aliases, alias => invertedIndexA[alias] = name))

export default function Direction (p) {
  const value = directionAliases[p.value] ? p.value : invertedIndexD[p.value]
  const fitValue = !value || _.isNumber(p.amount) || (p.amount && (p.amount.length < 5) && p.amount !== 'all')
  const amount = amountAliases[p.amount] || fitValue ? p.amount : invertedIndexA[p.amount]
  if (p.amount) console.log(p.amount.length)
  return <StyledDirection>
    { fitValue && <AmountNumber>{ amount }</AmountNumber>}
    { value === 'left' && <Amount>{ amount }</Amount>}
    <span className={'mdi mdi-chevron-' + value }></span>
    { value === 'right' && <Amount>{ amount }</Amount>}
  </StyledDirection>

}
const StyledDirection = styled.div`
  flex: 0 0 33%;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`
const Amount = styled.span``
const AmountNumber = styled.span`
  font-size: 10px;
`
