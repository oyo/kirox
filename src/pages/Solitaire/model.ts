import type { Model, ModelListener } from 'types/events'

export class SolitaireModel implements Model {
  listener: ModelListener[] = []

  constructor() {}

  start() {
    this.fireModelChanged()
    return this
  }

  reset() {}

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
