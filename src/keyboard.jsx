import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Button from './button.jsx'

import { 
  MODIFIERS,
  findKey,
  findKeys,
  findKeysByCode,
  getKeys,
} from './data'

const StyledKeyboard = styled.div`
  position: relative;
`

export default class Keyboard extends Component {
  constructor (p) {
    super(p)

    this.state = {
      modifiers: [],
      pressed: [],
      sticky: [],
    }
    this._onKeyDown = this._onKeyDown.bind(this)
    this._onKeyUp = this._onKeyUp.bind(this)
    this._onMouseOver = this._onMouseOver.bind(this)
    this._onMouseOut = this._onMouseOut.bind(this)
    this._onMouseDown = this._onMouseDown.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this._onKeyDown)
    document.addEventListener('keyup', this._onKeyUp)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this._onKeyDown)
    document.removeEventListener('keyup', this._onKeyUp)
  }

  render (p) {
    const { modifiers } = this.state
    const { keyboard, app, context } = this.props
    const totalWidth = _(keyboard.coordinates).map(c => c[0] + c[2]).max()
    const coordinates = _.map(keyboard.coordinates, c => {
      return [c[0] / totalWidth * 100, c[1] / totalWidth * 100, c[2] / totalWidth * 100, c[3] / totalWidth * 100]
    })
    const modifiedKeys = getKeys(keyboard, modifiers, app, context)

    const buttons = _.map(keyboard.keys, (key, i) => {
      const modifiedKey = modifiedKeys[key] || key
      const label = keyboard.labels[key]
      let value = { key, label, action: modifiedKey === key ? undefined : modifiedKey }
      if (_.isPlainObject(modifiedKey)) _.merge(value, modifiedKey)
      const c = coordinates[i]
      return (
        <Button id={key}
          key={ key }
          value={ value }
          pressed={ this.state.pressed.includes(key) }
          coordinates={ c }
          onMouseOver={ this._onMouseOver }
          onMouseOut={ this._onMouseOut }
          onMouseDown={ this._onMouseDown }
          onMouseUp={ this._onMouseUp }
        />
      )
    })
    return (
      <StyledKeyboard>
        {buttons}
      </StyledKeyboard>
    )
  }

  toggleKey (key, state) {
    let { modifiers, pressed } = this.state
    if (MODIFIERS.includes(key)) {
      if (!modifiers.includes(key)) modifiers.push(key)
      else modifiers = _.without(modifiers, key)
      this.setState({ modifiers })
    }
    if (!pressed.includes(key)) pressed.push(key)
    else pressed = _.without(pressed, key)
    this.setState({ pressed })
  }

  // Event Handlers

  _onKeyDown (e) {
    e.preventDefault()
    e.stopPropagation()
    const key = findKeysByCode(e.code)[0]
    this.toggleKey(key, true)
  }

  _onKeyUp (e) {
    e.preventDefault()
    e.stopPropagation()
    const key = findKeysByCode(e.code)[0]
    this.toggleKey(key, false)
  }

  _onMouseOver (e) {
    const key = e.currentTarget.dataset.id
    if (!this.state.sticky.includes(key)) this.toggleKey(key, true)
  }

  _onMouseOut (e) {
    const key = e.currentTarget.dataset.id
    if (!this.state.sticky.includes(key)) this.toggleKey(key, false)
  }

  _onMouseDown (e) {
    const key = e.currentTarget.dataset.id
    let sticky = this.state.sticky
    if (sticky.includes(key)) sticky = _.without(sticky, key)
    else sticky.push(key)
    this.setState({ sticky })
  }

  _onMouseUp (e) {
  }
}
