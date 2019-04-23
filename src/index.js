import './index.css'
import { PHYSICAL, APPLICATIONS, MODIFIERS,
  findKey,
  findKeys,
  findKeysByCode,
  findKeysOfModifiers,
} from './data'

class App {
  constructor () {
    this.container = $('.container')
    this.state = {
      keyboard: PHYSICAL[0],
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
    this.render()
  }

  render () {
    _.each(this.state.keyboard.keys, (key, i) => {
      const label = this.state.keyboard.labels[key] || key
      const c = this.state.keyboard.coordinates[i]
      const btn = $(`<div
        class="button"
        data-id="${key}"
        style="
          left: ${c[0]}px;
          top: ${c[1]}px;
          width: ${c[2]}px;
          height: ${c[3]}px;
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
