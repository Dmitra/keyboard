import React from 'react'
import styled from 'styled-components'

const aliases = {
  left: ['previous', 'backward', 'backwards'], 
  right: ['next', 'forward', 'forwards'],
  up: ['above'],
  down: ['below'],
}
const invertedIndex = {}
_.each(aliases, (aliases, name) => _.each(aliases, alias => invertedIndex[alias] = name))

export default function Direction (p) {
  const value = aliases[p.value] ? p.value : invertedIndex[p.value]
  return <StyledDirection>
    <span className={'mdi mdi-chevron-' + value }></span>
  </StyledDirection>

}
const StyledDirection = styled.div`
  flex: 0 0 33%;
  position: relative;
  width: 100%;
  height: 100%;

  .mdi {
    margin: auto;
  }
`
