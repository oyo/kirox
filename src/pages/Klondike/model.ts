import type { Card } from 'types/cards'
import type { Model, ModelListener } from 'types/events'
import { shuffle } from 'util/basic'
import { deck } from 'util/cards'
import { KlondikeActionTypes, subscribe, trigger, type KlondikeAction } from './actions'

export type Klondike = {
  stock: Card[][]
  tableau: Card[][]
  foundation: Card[][]
}

export class KlondikeModel implements Model {
  listener: ModelListener[] = []
  table: Klondike = {
    stock: [],
    tableau: [],
    foundation: [],
  }

  constructor() {
    subscribe({
      [KlondikeActionTypes.REQUEST_DEAL]: this.tryDeal.bind(this),
    })
  }

  tryDeal(action: KlondikeAction) {
    const s = this.table.stock
    if (s[0].length > 0) s[1].push(s[0].pop()!)
    else s.unshift(s.pop()!.reverse())
    trigger({
      type: KlondikeActionTypes.DEAL,
      model: this,
    })
  }

  reset() {
    const cards = shuffle(deck().flat())
    const tableau = new Array(7).fill(undefined).map((_, i) => cards.splice(-i - 1))
    this.table = {
      stock: [cards, []],
      tableau,
      foundation: new Array(4).fill([]),
    }
    //this.fireModelChanged()
    trigger({
      type: KlondikeActionTypes.RENDER,
      model: this,
    })
    return this
  }

  undo() {}

  redo() {}

  addModelListener(l: ModelListener) {
    this.listener.push(l)
    return this
  }

  fireModelChanged() {
    this.listener.forEach((l) => l.modelChanged(this))
  }

  fireModelFinished(status: number) {
    this.listener.forEach((l) => l.modelFinished(this, status))
  }
}
