import physical from '../data/physical.json'
import applications from '../data/applications.json'
import aliases from '../data/aliases.json'
import codes from '../data/codes.json'
import './index.css'

class App {
  constructor () {
    this.container = $('.container')
    this.keyboard = physical['Lenovo Y70-70 Touch']

    document.addEventListener('keydown', this._onKeyDown.bind(this))
    document.addEventListener('keyup', this._onKeyUp.bind(this))
    this.container.on('mouseover', '.button', this._onMouseover.bind(this))
    this.container.on('mouseout', '.button', this._onMouseout.bind(this))
    this.container.on('mousedown', '.button', this._onMousedown.bind(this))
    this.container.on('mouseup', '.button', this._onMouseup.bind(this))
    this.render()
  }

  render () {
    _.each(this.keyboard.keys, (key, i) => {
      const label = this.keyboard.labels[key] || key
      const c = this.keyboard.coordinates[i]
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
    const button = _.find($('.button'), button => {
      return button.dataset.id === key
    })
    if (button) return $(button)
  }

  findKeys (text) {
    const keys = []
    _.each(aliases, (alias, key) => {
      if (alias.includes(text)) keys.push(key)
    })
    if (_.isEmpty(keys) && this.keyboard.keys.includes(text)) return text
    return keys
  }

  findKeysByCode (text) {
    const keys = []
    _.each(codes, (code, key) => {
      if (code.includes(text)) keys.push(key)
    })
    return keys
  }

  _onKeyDown (e) {
    // temporary enable F12
    if (e.code !== 'F12') {
      e.preventDefault()
    }
    e.stopPropagation()
    const keys = this.findKeysByCode(e.code)
    this.togglePressed(keys)
    console.log(e.code)
  }

  _onKeyUp (e) {
    e.preventDefault()
    e.stopPropagation()
    const keys = this.findKeysByCode(e.code)
    this.togglePressed(keys)
  }

  _onMouseover (e) {
    const key = e.target.dataset.id
    this.toggleHover(this.findKeys(key))
  }

  _onMouseout (e) {
    const key = e.target.dataset.id
    this.toggleHover(this.findKeys(key))
  }

  _onMousedown (e) {
    const key = e.target.dataset.id
    this.togglePressed(this.findKeys(key))
  }

  _onMouseup (e) {
    const key = e.target.dataset.id
    this.togglePressed(this.findKeys(key))
  }
}
const app = new App()
