import { createComputed } from '../create-computed/index.js'
import { createAtom } from '../create-atom/index.js'

function warning(text) {
  if (typeof console !== 'undefined' && console.warn) {
    console.groupCollapsed('Nano Stores: ' + text)
    console.trace('Source of deprecated call')
    console.groupEnd()
  }
}

export function createStore(...args) {
  warning('Replace createStore() to createAtom()')
  return createAtom(...args)
}

export function createDerived(...args) {
  warning('Replace createDerived() to createComputed()')
  return createComputed(...args)
}
