import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Button from './button.jsx'

import { 
  Layout,
  MODIFIERS,
  findKey,
  findKeys,
  findKeysByCode,
  getKeys,
} from './data'

class App extends Component {
  constructor() {
    super()
    this.state = {
      layouts: {},
      keyboard: {},
      app: '',
      modifiers: [],
      pressed: [],
      sticky: [],
    }

    // document.addEventListener('keydown', this._onKeyDown.bind(this))
    // document.addEventListener('keyup', this._onKeyUp.bind(this))
    this._onMouseOver = this._onMouseOver.bind(this)
    this._onMouseOut = this._onMouseOut.bind(this)
    this._onMouseDown = this._onMouseDown.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)
  }

  componentDidMount () {
    console.log(this._isMounted)
    this._initLayout()
  }

  componentWillUnmount () {
    console.log('UNMOUNT')
  }

  async _initLayout () {
    const physical = await Layout.getList('physical')
    const app = await Layout.getList('app')
    const keyboard = await Layout.get('physical', physical[0])
    this.setState({ layouts: { physical, app } })
    this.setState({ keyboard })
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

  render () {
    const totalWidth = _(this.state.keyboard.coordinates).map(c => c[0] + c[2]).max()
    const coordinates = _.map(this.state.keyboard.coordinates, c => {
      return [c[0] / totalWidth * 100, c[1] / totalWidth * 100, c[2] / totalWidth * 100, c[3] / totalWidth * 100]
    })
    const { keyboard, modifiers, app, context } = this.state
    const modifiedKeys = getKeys(keyboard, modifiers, app, context)

    return _.map(this.state.keyboard.keys, (key, i) => {
      const value = modifiedKeys[key] || key
      const label = this.state.keyboard.labels[value] || value
      const c = coordinates[i]
      return (
        <Button id={key}
          key={key}
          label={label}
          pressed={this.state.pressed.includes(key)}
          coordinates={c}
          onMouseOver={this._onMouseOver}
          onMouseOut={this._onMouseOut}
          onMouseDown={this._onMouseDown}
          onMouseUp={this._onMouseUp}
        />
      )
    })
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
    const key = e.target.dataset.id
    if (!this.state.sticky.includes(key)) this.toggleKey(key, true)
  }

  _onMouseOut (e) {
    const key = e.target.dataset.id
    if (!this.state.sticky.includes(key)) this.toggleKey(key, false)
  }

  _onMouseDown (e) {
    const key = e.target.dataset.id
    let sticky = this.state.sticky
    if (sticky.includes(key)) sticky = _.without(sticky, key)
    else sticky.push(key)
    this.setState({ sticky })
  }

  _onMouseUp (e) {
  }

  async _onLayoutChange (e) {
    const i = e.target.MDCList.selectedIndex
    this.state.keyboard = await Layout.get('physical', this.layouts.physical[i-1])
    this.render()
  }

  async _onAppChange (e) {
    const i = e.target.MDCList.selectedIndex
    this.state.app = await Layout.get('app', this.layouts.app[i-1])
    this.updateKeys()
  }

  _onContextChange () {
    console.log('context')
  }
}
export default hot(App)
