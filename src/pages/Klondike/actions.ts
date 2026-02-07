import type { Card } from 'types/cards'
import type { KlondikeModel } from './model'
import type { Coord } from 'types/grid'

export const KlondikeActionTypes = {
  RENDER: 100,
  REQUEST_DEAL: 101,
  DEAL: 102,
  REQUEST_DRAW: 103,
  DRAW: 104,
  CAN_DROP: 105,
  REQUEST_DROP_FOUNDATION: 106,
  DROP_FOUNDATION: 107,
  REQUEST_DROP_TABLEAU: 108,
  DROP_TABLEAU: 109,
}

export type KlondikeAction = {
  type: number
  model?: KlondikeModel
  origin?: Card[]
  originPos?: Coord
}

export type KlondikeActionCall = (action: KlondikeAction) => void

const queue: KlondikeAction[] = []

const listener: Record<number, KlondikeActionCall[]> = {}

export const subscribe = (actions: Record<number, KlondikeActionCall>) => {
  Object.entries(actions).forEach(
    ([type, call]: [type: unknown, call: KlondikeActionCall]) =>
      (listener[type as number] ??= []).push(call)
  )
}

export const trigger = (action: KlondikeAction) => (
  queue.push(action),
  (listener[action.type] ?? []).forEach((call) => call(action))
)
