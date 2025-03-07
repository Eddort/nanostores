import { lastAction } from '../action/index.js'

type ReadonlyIfObject<Value> = Value extends undefined
  ? Value
  : Value extends (...args: any) => any
  ? Value
  : Value extends object
  ? Readonly<Value>
  : Value

/**
 * Store object.
 */
export interface ReadableAtom<Value = any> {
  readonly [lastAction]: string | undefined

  /**
   * Listeners count.
   */
  lc: number

  /**
   * Subscribe to store changes and call listener immediately.
   *
   * ```
   * import { router } from '../store'
   *
   * router.subscribe(page => {
   *   console.log(page)
   * })
   * ```
   *
   * @param listener Callback with store value.
   * @returns Function to remove listener.
   */
  subscribe(listener: (value: ReadonlyIfObject<Value>) => void): () => void

  /**
   * Subscribe to store changes.
   *
   * In contrast with {@link Store#subscribe} it do not call listener
   * immediately.
   *
   * @param listener Callback with store value.
   * @returns Function to remove listener.
   */
  listen(listener: (value: ReadonlyIfObject<Value>) => void): () => void

  /**
   * Get store value.
   *
   * In contrast with {@link ReadableAtom#value} this value will be always
   * initialized even if store had no listeners.
   *
   * ```js
   * store.get()
   * ```
   *
   * @returns Store value.
   */
  get(): Value

  /**
   * Unbind all listeners.
   */
  off(): void
}

/**
 * Store with a way to manually change the value.
 */
export interface WritableAtom<Value = any> extends ReadableAtom<Value> {
  /**
   * Change store value.
   *
   * ```js
   * router.set({ path: location.pathname, page: parse(location.pathname) })
   * ```
   *
   * @param newValue New store value.
   */
  set(newValue: Value): void
}

export type Atom<Value = any> = ReadableAtom<Value> | WritableAtom<Value>

/**
 * Create store with atomic value. It could be a string or an object, which you
 * will replace completly.
 *
 * If you want to change keys in the object inside store, use {@link map}.
 *
 * ```js
 * import { atom, onMount } from 'nanostores'
 *
 * // Initial value
 * export const router = atom({ path: '', page: 'home' })
 *
 * function parse () {
 *   router.set({ path: location.pathname, page: parse(location.pathname) })
 * }
 *
 * // Listen for URL changes on first store’s listener.
 * onMount(router, {
 *   parse()
 *   window.addEventListener('popstate', parse)
 *   return () => {
 *     window.removeEventListener('popstate', parse)
 *   }
 * })
 * ```
 *
 * @param initialValue Initial value of the store.
 * @returns The store object with methods to subscribe.
 */
export function atom<Value, StoreExt = {}>(
  initialValue?: Value
): WritableAtom<Value> & StoreExt
