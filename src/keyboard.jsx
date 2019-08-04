import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Button from './views/button.jsx'

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
      pressed: p.pressed || [],
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
    const pressed = _(this.state.pressed).concat(this.props.fixed || []).uniq().value()
    const { physical, visual, functional, context } = this.props.layout
    const totalWidth = _(physical.layout).map(c => c[0] + c[2]).max()
    const coordinates = _.map(physical.layout, c => {
      return [c[0] / totalWidth * 100, c[1] / totalWidth * 100, c[2] / totalWidth * 100, c[3] / totalWidth * 100, c[4]]
    })
    const modifiers = _.filter(pressed, key => MODIFIERS.includes(key))
    const modifiedKeys = getKeys(visual, modifiers, functional.layout, context)

    const buttons = _.map(coordinates, (c, i) => {
      const key = visual.keys[i]
      let modifiedKey = modifiedKeys[key] ? modifiedKeys[key].key || modifiedKeys[key] : key
      const label = visual.labels[key]
      let value = { key, label }
      if (_.isPlainObject(modifiedKeys[key])) _.merge(value, modifiedKeys[key])
      return (
        <Button id={ key }
          key={ _.toString(key) + i }
          value={ value }
          pressed={ pressed.includes(key) }
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
    let { pressed } = this.state
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
    this.toggleKey(key, true)
  }

  _onMouseOut (e) {
    const key = e.currentTarget.dataset.id
    this.toggleKey(key, false)
  }

  _onMouseDown (e) {
    const key = e.currentTarget.dataset.id
    let fixed = this.props.fixed
    if (fixed.includes(key)) fixed = _.without(fixed, key)
    else fixed.push(key)
    this.props.onChange(fixed)
  }

  _onMouseUp (e) {
  }
}
