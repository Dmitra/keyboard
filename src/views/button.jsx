import React from 'react'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import Direction from './direction.jsx'

export default function Button (p) {
  const c = p.coordinates
  return (
    <StyledButton
      c={ c }
      elevation={ p.pressed ? 1 : 4 }
      onMouseOver={ p.onMouseOver }
      onMouseOut={ p.onMouseOut }
      onMouseUp={ p.onMouseUp }
      onMouseDown={ p.onMouseDown }
      data-id={ p.id }
      title={ p.value.description }
    >
      <ButtonHeader>
        <Key>{ p.value.label || p.value.key }</Key>
        <Icon/>
        <Direction value={ p.value.direction } amount={ p.value.amount }/>
      </ButtonHeader>
      <Action>{ p.value.action }</Action>
      <Element>{ (p.value.scope && p.value.scope + ' > ' + p.value.element) || p.value.element}</Element>
    </StyledButton>
  )
}

const StyledButton = styled(Paper)`
  position: absolute;
  left: ${p => p.c[0]}vw;
  top: ${p => p.c[1]}vw;
  width: ${p => p.c[2]}vw;
  height: ${p => p.c[3]}vw;
  transform: rotate(${p => p.c[4]}deg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: stretch;
  text-align: center;
  justify-content: flex-end;
  font-size: ${p => 0.5 + 960/window.innerWidth + 'vw'};
  font-weight: ${p => p.elevation === 1 ? 'bold' : 'normal'};
  color: grey;
  transform-origin: ${p => p.c[4] > 0 ? 'left' : 'right'} top;
`
const ButtonHeader = styled.div`
  flex: 0 0 1.8vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Key = function (p) {
  return <StyledKey>
    <div style={{padding: 0.4+'vw'}}>{ p.children }</div>
  </StyledKey>
}
const StyledKey = styled.div`
  flex: 0 0 33%;
  display: flex
`
const Icon = styled.div`
  flex: 0 0 33%;
`
const Action = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${p => 0.3 + 960/window.innerWidth + 'vw'};
  background: ${ p => p.children ? 'palevioletred' : 'none' };
  color: black;
`
const Element = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${p => 0.3 + 960/window.innerWidth + 'vw'};
  background: ${ p => p.children ? 'aliceblue' : 'none' };
`
