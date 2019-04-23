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

  togglePressed (keyS) {
    const keys = _.castArray(keyS)
    _.each(keys, key => {
        this.findButton(key).toggleClass('pressed')
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

  _onKeyDown (e) {
    e.preventDefault()
    e.stopPropagation()
    const key = findKeysByCode(e.code)[0]
    this.togglePressed(key)
    if (MODIFIERS.includes(key)) {
      this.state.modifiers.push(key)
      this.updateKeys()
    }
  }

  _onKeyUp (e) {
    e.preventDefault()
    e.stopPropagation()
    const key = findKeysByCode(e.code)[0]
    this.togglePressed(key)
    if (MODIFIERS.includes(key)) {
      this.state.modifiers = _.without(this.state.modifiers, key)
      this.updateKeys()
    }
  }

  _onMouseover (e) {
    const key = e.target.dataset.id
    this.toggleHover(findKey(this.state.keyboard, key))
  }

  _onMouseout (e) {
    const key = e.target.dataset.id
    this.toggleHover(findKey(this.state.keyboard, key))
  }

  _onMousedown (e) {
    const key = e.target.dataset.id
    this.togglePressed(findKey(this.state.keyboard, key))
  }

  _onMouseup (e) {
    const key = e.target.dataset.id
    this.togglePressed(findKey(this.state.keyboard, key))
  }
}
const app = new App()
