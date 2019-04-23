import PHYSICAL from '../data/physical.json'
import APPLICATIONS from '../data/applications.json'
import ALIASES from '../data/aliases.json'
import BROWSER_CODES from '../data/codes.json'
import MODIFIERS from '../data/modifiers.json'

_.each(ALIASES, (aliases, key) => {
  aliases.push(key.replace(' ', ''))
  return aliases
})

export { PHYSICAL, APPLICATIONS, ALIASES, BROWSER_CODES, MODIFIERS }

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
