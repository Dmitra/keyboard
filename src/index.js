import './index.css'
import { 
  Layout,
  MODIFIERS,
  findKey,
  findKeys,
  findKeysByCode,
  findKeysOfModifiers,
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

    document.addEventListener('keydown', this._onKeyDown.bind(this))
    document.addEventListener('keyup', this._onKeyUp.bind(this))
    this.container.on('mouseover', '.button', this._onMouseover.bind(this))
    this.container.on('mouseout', '.button', this._onMouseout.bind(this))
    this.container.on('mousedown', '.button', this._onMousedown.bind(this))
    this.container.on('mouseup', '.button', this._onMouseup.bind(this))
    this.initLayout()
  }

  async initLayout () {
    this.layouts.physical = await Layout.getList('physical')
    this.layouts.app = await Layout.getList('app')
    this.state.keyboard = await Layout.get('physical', this.layouts.physical[0])
    this.render()
  }

  render () {
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
    const modifiedKeys = findKeysOfModifiers(this.state.keyboard, this.state.modifiers)
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
}
const app = new App()
