import yaml from 'js-yaml'
import ALIASES from '../data/aliases.yml'
import BROWSER_CODES from '../data/codes.json'
import MODIFIERS from '../data/modifiers.yml'

_.each(ALIASES, (aliases, key) => {
  aliases.push(key)
  aliases.push(key.replace(' ', ''))
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
      $.getJSON(`/data/physical/${name}.json`, data => {
        normalizeModDefs(data.modifiers)
        resolve(data)
      })
    })
  },
  app: name => {
    return new Promise((resolve, reject) => {
      $.get(`/data/app/${name}.yml`, data => {
        const json = yaml.load(data)
        // Group actions by context and by modifier
        const actionsByContext = groupBy(json, 'context')
        _.each(actionsByContext, (actions, _context) => {
          const actionsByModifier = groupBy(actions, 'modifier')
          _.each(actionsByModifier, (actions, modifier) => {
            actionsByModifier[modifier] = _.keyBy(actions, 'key')
          })
          actionsByContext[_context] = actionsByModifier 
        })

        _.each(actionsByContext, modDefs => normalizeModDefs(modDefs))
        resolve(actionsByContext)
      })
    })
  }
}

export { Layout, ALIASES, BROWSER_CODES, MODIFIERS }

function groupBy (collection, attr) {
  const result = {}
  _.each(collection, item => {
    const keys = _.castArray(item[attr])
    _.each(keys, key => {
      result[key] = result[key] || []
      result[key].push(item)
    })
  })
  return result
}

function normalizeModDefs (modDefs) {
  _.each(modDefs, (keys, modifier) => {
    delete modDefs[modifier]
    modDefs[_.sortBy(modifier.split('+')).join('+')] = keys
  })
}

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
  let keysWithModifier = {}
  context = context || 'undefined'
  let modifier = _.sortBy(modifiers).join('+')
  const keys = getKeysOfModifier(keyboard.modifiers, modifier)

  // Handle case when keyboard keys are defined as Array
  if (_.isArray(keys)) {
    _.each(keyboard.keys, (key, i) => {
      if (keys[i]) keysWithModifier[key] = { key, label: keys[i] }
    })
  } else _.merge(keysWithModifier, keys)

  if (_.isEmpty(modifiers)) modifier = 'undefined'

  // Apply keys for any ("undefined") context
  if (app && app['undefined']) {
    _.merge(keysWithModifier, getKeysOfModifier(app['undefined'], modifier))
  }

  if (app && app[context] && context !== 'undefined') {
    _.merge(keysWithModifier, getKeysOfModifier(app[context], modifier))
  }

  return keysWithModifier
}

// get keys from modifiers definitions by modifier aliases list
function getKeysFromDef(modDef, modPartAliases) {
  return modDef[_.sortBy(modPartAliases).join('+')]
}

function getKeysOfModifier (modDef, modifier) {
  if (!modDef) return
  const modParts = modifier.split('+')
  const modPartsAliases = _.map(modParts, modPart => ALIASES[modPart] || [modPart])
  let keys

  function iterate (rest, acc) {
    const aliases = rest[0]
    _.each(aliases, alias => {
      const newAcc = _.concat(acc, alias)
      if (rest.length > 1) iterate(rest.slice(1), newAcc)
      else {
        keys = keys || getKeysFromDef(modDef, newAcc)
      }
    })
  }

  iterate(modPartsAliases, [])
  return keys
}
