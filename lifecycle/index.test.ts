import { atom } from '../atom/index.js'
import { onChange, onCreate, onStop, onSet, container } from './index.js'

const run_all = (fns: any[]): any => fns.map(cb => cb())

describe('store lifecycle', () => {
  it('onCreate (from listen)', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onCreate(store, () => events.push('ok'))
    let unsubAtom = store.listen(() => {})
    expect(events).toEqual(['ok'])
    run_all([unsubHook, unsubAtom])
    expect(container.has(store)).toBe(false)
  })

  it('onCreate (from subscribe)', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onCreate(store, () => events.push('ok'))
    let unsubAtom = store.subscribe(() => {})
    expect(events).toEqual(['ok'])
    run_all([unsubHook, unsubAtom])
    expect(container.has(store)).toBe(false)
  })

  it('onCreate (from store.get)', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onCreate(store, () => events.push('ok'))
    store.get()
    expect(events).toEqual(['ok'])
    run_all([unsubHook])
    expect(container.has(store)).toBe(false)
  })

  it('onCreate (not called)', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubAtom = store.subscribe(() => {})
    let unsubHook = onCreate(store, () => events.push('ok'))
    store.subscribe(() => {})
    expect(events).toEqual([])
    run_all([unsubHook, unsubAtom])
    expect(container.has(store)).toBe(false)
  })

  it('onCreate shared data', () => {
    let store = atom(1)
    let events: unknown[] = []

    let unsub = onSet(store, api => {
      events.push(api.shared)
    })

    let unsub2 = onSet<number, { test: number }>(store, api => {
      api.shared.test = 1
    })

    store.set(2)

    run_all([unsub, unsub2])
    expect(events).toEqual([{ test: 1 }])
    expect(container.has(store)).toBe(false)
  })

  it('onOff (from listen)', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onStop(store, () => events.push('ok'))
    let unsubAtom = store.listen(() => {})
    unsubAtom()
    expect(events).toEqual(['ok'])
    unsubHook()
    expect(container.has(store)).toBe(false)
  })

  it('onOff (from subscribe)', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onStop(store, () => events.push('ok'))
    let unsubAtom = store.subscribe(() => {})
    unsubAtom()
    expect(events).toEqual(['ok'])
    unsubHook()
    expect(container.has(store)).toBe(false)
  })

  it('onSet', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onSet(store, () => events.push('ok'))
    store.set(3)
    expect(events).toEqual(['ok'])
    unsubHook()
    expect(container.has(store)).toBe(false)
  })

  it('onSet (abort)', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onSet(store, ({ abort }) => {
      abort()
    })
    store.listen(() => {
      events.push('It would never be called')
    })
    store.set(3)
    expect(events).toEqual([])
    unsubHook()
    expect(container.has(store)).toBe(false)
  })

  it('onChange', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onChange(store, () => events.push('ok'))
    store.set(3)
    expect(events).toEqual(['ok'])
    unsubHook()
    expect(container.has(store)).toBe(false)
  })

  it('onChange (abort)', () => {
    let events: string[] = []
    let store = atom(2)
    let unsubHook = onChange(store, ({ abort }) => {
      abort()
    })
    store.listen(() => {
      events.push('It would never be called')
    })
    store.set(3)
    expect(events).toEqual([])
    unsubHook()
    expect(container.has(store)).toBe(false)
  })
})
