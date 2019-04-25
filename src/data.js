import yaml from 'js-yaml'
import ALIASES from '../data/aliases.yml'
import BROWSER_CODES from '../data/codes.json'
import MODIFIERS from '../data/modifiers.yml'

_.each(ALIASES, (aliases, key) => {
  aliases.push(key.replace(' ', ''))
  return aliases
})

const Layout = {
  getList: type => {
    return new Promise((resolve, reject) => {
      $.get(`/data/${type}/index.yml`, data => {
        resolve(yaml.load(data))
      })
    })
  },
  get: (type, name) => {
    return Layout[type](name)
  },
  physical: name => {
    return new Promise((resolve, reject) => {
      $.getJSON(`/data/physical/${name}.json`, data => resolve(data))
    })
  },
  app: name => {
    return new Promise((resolve, reject) => {
      $.getJSON(`/data/app/${name}.yaml`, data => resolve(data))
    })
  }
}

export { Layout, ALIASES, BROWSER_CODES, MODIFIERS }

export function findKeys (keyboard, text) {
  const keys = []
  _.each(ALIASES, (alias, key) => {
    if (alias.includes(text)) keys.push(key)
  })
  if (_.isEmpty(keys) && keyboard.keys.includes(text)) return [text]
  return keys
}

export function findKey (keyboard, text) {
  return findKeys(keyboard, text)[0]
}

export function findKeysByCode (text) {
  const keys = []
  _.each(BROWSER_CODES, (code, key) => {
    if (code.includes(text)) keys.push(key)
  })
  return keys
}

export function findKeysOfModifiers (keyboard, keys) {
  if (_.isEmpty(keys)) return []
  // TODO combine modifiers
  const key = keys[0]
  const aliases = ALIASES[key]
  aliases.unshift(key)
  return _.reduce(aliases, (result, alias, k) => {
    let keysWithModifier = {}
    const keys = keyboard[alias]
    if (_.isArray(keys)) {
      _.each(keyboard.keys, (key, i) => {
        if (keys[i]) keysWithModifier[key] = keys[i]
      })
    } else if (keys) keysWithModifier = keys
    return _.isEmpty(keysWithModifier) ? result : _.merge(result, keysWithModifier)
  }, {})
}
