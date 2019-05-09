import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.div`
  position: absolute;
  left: ${p => p.c[0] + 'vw'};
  top: ${p => p.c[1] + 'vw'};
  width: ${p => p.c[2] + 'vw'};
  height: ${p => p.c[3] + 'vw'};
  font-size: 1.8vw;
  border: 0.2vw grey solid;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.pressed ? 'grey' : 'white'};
`
const Button = (p) => {
  const c = p.coordinates
  return (
    <StyledButton
      c={ c }
      pressed={p.pressed}
      onMouseOver={ p.onMouseOver }
      onMouseOut={ p.onMouseOut }
      onMouseUp={ p.onMouseUp }
      onMouseDown={ p.onMouseDown }
      data-id={p.id}
    >{p.label}</StyledButton>
  )
}

export default Button
