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
      $.get(`/data/app/${name}.yml`, data => {
        resolve(yaml.load(data))
      })
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
/**
 * @param keyboard layout
 * @param Array of modifier keys
 * @param Object app keyboard layout
 * @param String app context
 * @return Object of key values by physical key
 *   modifiers = ['Shift'}
 *   return {
 *     "a": "A"
 *   }
 */
export function getKeys (keyboard, modifiers, app, context) {
  if (_.isEmpty(modifiers)) return []
  // TODO combine modifiers
  const modifier = modifiers[0]
  const modifierAliases = ALIASES[modifier]
  modifierAliases.unshift(modifier)

  return _.reduce(modifierAliases, (result, alias, k) => {
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
