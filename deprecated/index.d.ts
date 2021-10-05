import {
  AnySyncTemplate,
  TemplateStore,
  TemplateValue,
  MapTemplate
} from '../map-template/index.js'
import { MapStore, StoreValue, Store } from '../map/index.js'
import { WritableAtom, ReadableAtom } from '../atom/index.js'

type StoreValues<Stores extends ReadableAtom[]> = {
  [Index in keyof Stores]: StoreValue<Stores[Index]>
}

interface CreateDerived {
  <Value extends any, OriginStore extends ReadableAtom>(
    stores: OriginStore,
    cb: (value: StoreValue<OriginStore>) => Value
  ): ReadableAtom<Value>
  <Value extends any, OriginStores extends ReadableAtom[]>(
    stores: [...OriginStores],
    cb: (...values: StoreValues<OriginStores>) => Value
  ): ReadableAtom<Value>
}

type ReaonlyIfCan<Value> = Value extends (...args: any) => any
  ? Value
  : Readonly<Value>

/**
 * @deprecated
 */
export function createStore<Value, StoreExt = {}>(
  init?: () => void | (() => void)
): WritableAtom<Value> & StoreExt

/**
 * @deprecated
 */
export const createDerived: CreateDerived

/**
 * @deprecated
 */
export function defineMap<
  Value extends object,
  Args extends any[] = [],
  StoreExt = {}
>(
  init?: (
    store: MapStore<Value & { id: string }> & StoreExt,
    id: string,
    ...args: Args
  ) => void | (() => void)
): MapTemplate<Value, Args, StoreExt>

/**
 * @deprecated
 */
export function createMap<Value extends object, StoreExt extends object = {}>(
  init?: () => void | (() => void)
): MapStore<Value> & StoreExt

/**
 * @deprecated
 */
export function getValue<Value extends any>(
  store: ReadableAtom<Value>
): ReaonlyIfCan<Value>

/**
 * @deprecated
 */
export function keepActive(store: Store | MapTemplate | AnySyncTemplate): void

/**
 * @deprecated
 */
export type ReadableStore = ReadableAtom

/**
 * @deprecated
 */
export type MapBuilder = MapTemplate

/**
 * @deprecated
 */
export type BuilderValue = TemplateValue

/**
 * @deprecated
 */
export type BuilderStore = TemplateStore
