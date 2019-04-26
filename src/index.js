import mdcAutoInit from '@material/auto-init'
import { MDCSelect } from '@material/select'

import './index.scss'
import { 
  Layout,
  MODIFIERS,
  findKey,
  findKeys,
  findKeysByCode,
  getKeys,
} from './data'

class App {
  constructor () {
    this.container = $('.container')
    this.layouts = {
      physical: [],
      app: [],
    }
    this.state = {
      keyboard: '',
      app: '',
      modifiers: [],
      keys: [],
      sticky: [],
    }

    this.controls = {
      layoutSelector: $('#physical-layout'),
      appSelector: $('#app-layout'),
    }
    this._bindHandlers()
    this.initLayout()
  }

  _bindHandlers () {
    document.addEventListener('keydown', this._onKeyDown.bind(this))
    document.addEventListener('keyup', this._onKeyUp.bind(this))
    this.container.on('mouseover', '.button', this._onMouseover.bind(this))
    this.container.on('mouseout', '.button', this._onMouseout.bind(this))
    this.container.on('mousedown', '.button', this._onMousedown.bind(this))
    this.container.on('mouseup', '.button', this._onMouseup.bind(this))
 
    mdcAutoInit.register('MDCSelect', MDCSelect)
    mdcAutoInit()
    this.controls.layoutSelector[0].MDCSelect.listen('MDCSelect:change', this._onLayoutChange.bind(this))
    this.controls.appSelector[0].MDCSelect.listen('MDCSelect:change', this._onAppChange.bind(this))
  }

  async initLayout () {
    this.layouts.physical = await Layout.getList('physical')
    this.layouts.app = await Layout.getList('app')
    this.render()
    this.controls.layoutSelector[0].MDCSelect.selectedIndex = 1
  }

  render () {
    this._renderControls()
    const totalWidth = _(this.state.keyboard.coordinates).map(c => c[0] + c[2]).max()
    const coordinates = _.map(this.state.keyboard.coordinates, c => {
      return [c[0] / totalWidth * 100, c[1] / totalWidth * 100, c[2] / totalWidth * 100, c[3] / totalWidth * 100]
    })
    _.each(this.state.keyboard.keys, (key, i) => {
      const label = this.state.keyboard.labels[key] || key
      const c = coordinates[i]
      const btn = $(`<div
        class="button"
        data-id="${key}"
        style="
          left: ${c[0]}vw;
          top: ${c[1]}vw;
          width: ${c[2]}vw;
          height: ${c[3]}vw;
        "
      >${label}</div>`)
      this.container.append(btn)
    })
    this.buttons = $('.button')
  }

  toggleHover (key) {
    this.findButton(key).toggleClass('hovered')
  }

  togglePressed (keyS, state) {
    const keys = _.castArray(keyS)
    _.each(keys, key => {
        this.findButton(key).toggleClass('pressed', state)
    })
  }

  findButton (key) {
    const button = _.find(this.buttons, button => {
      return button.dataset.id === key
    })
    if (button) return $(button)
  }

  updateKeys () {
    const { keyboard, modifiers, app, context } = this.state
    const modifiedKeys = getKeys(keyboard, modifiers, app, context)
    _.each(this.state.keyboard.keys, key => {
      const value = modifiedKeys[key] || key
      const label = this.state.keyboard.labels[value] || value
      this.findButton(key).text(label)
    })
  }

  toggleKey (key, state) {
    this.togglePressed(key, state)
    if (MODIFIERS.includes(key)) {
      if (state) this.state.modifiers.push(key)
      else this.state.modifiers = _.without(this.state.modifiers, key)
      this.updateKeys()
    }
  }

  // Private methods

  _renderControls () {
    if (this.controls.layoutSelector.find('option').length <= 1) {
      _.each(this.layouts.physical, layout => {
        this.controls.layoutSelector.find('select').append($("<option>").text(layout))
      })
    }

    if (this.controls.appSelector.find('option').length <= 1) {
      _.each(this.layouts.app, layout => {
        this.controls.appSelector.find('select').append($("<option>").text(layout))
      })
    }
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

  _onMouseover (e) {
    const key = e.target.dataset.id
    this.toggleKey(key, true)
  }

  _onMouseout (e) {
    const key = e.target.dataset.id
    if (!this.state.sticky.includes(key)) this.toggleKey(key, false)
  }

  _onMousedown (e) {
    const key = e.target.dataset.id
    const sticky = this.state.sticky
    if (sticky.includes(key)) this.state.sticky = _.without(sticky, key)
    else sticky.push(key)
    this.toggleKey(key, true)
  }

  _onMouseup (e) {
  }

  async _onLayoutChange (e) {
    const i = e.target.MDCSelect.selectedIndex
    this.state.keyboard = await Layout.get('physical', this.layouts.physical[i-1])
    this.render()
  }

  async _onAppChange (e) {
    const i = e.target.MDCSelect.selectedIndex
    this.state.app = await Layout.get('app', this.layouts.app[i-1])
    this.updateKeys()
  }
}
const app = new App()
