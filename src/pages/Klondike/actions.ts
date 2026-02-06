import type { Card } from 'types/cards'
import type { KlondikeModel } from './model'

export const KlondikeActionTypes = {
  RENDER: 100,
  REQUEST_DEAL: 101,
  DEAL: 102,
  REQUEST_DROP_FOUNDATION: 103,
  DROP_FOUNDATION: 104,
  REQUEST_DROP_TABLEAU: 105,
  DROP_TABLEAU: 105,
}

export type KlondikeAction = {
  type: number
  model?: KlondikeModel
  source?: Card[]
  target?: Card[]
  success?: boolean
}

export type KlondikeActionCall = (action: KlondikeAction) => void

const queue: KlondikeAction[] = []

const listener: Record<number, KlondikeActionCall[]> = {}

export const subscribe = (actions: Record<number, KlondikeActionCall>) => {
  Object.entries(actions).forEach(
    ([type, call]: [type: unknown, call: KlondikeActionCall]) =>
      (listener[type as number] ??= []).push(call)
  )
  console.log(listener)
}

export const trigger = (action: KlondikeAction) => (
  queue.push(action),
  (listener[action.type] ?? []).forEach((call) => call(action))
)
