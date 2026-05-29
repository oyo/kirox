import { type Coord, type Grid, type NumberGridDefinition } from '@/types/grid'
import { copy, createNumberGrid, createRandomNumberGrid, getItemAt, transpose } from '@/util/grid'
import type { Model, ModelListener } from '@/types/events'

export class TilesModel implements Model {
  definition: NumberGridDefinition | string
  grid: Grid<number> = []
  history: Grid<number>[] = []
  listener: ModelListener[] = []

  constructor(definition: NumberGridDefinition | string) {
    this.definition = definition
  }

  store() {
    if (this.grid.length > 0) this.history.push(copy(this.grid))
    this.history = this.history.slice(-1000)
  }

  reset() {
    this.store()
    this.grid =
      typeof this.definition === 'string'
        ? transpose(createNumberGrid(this.definition as string))
        : createRandomNumberGrid(this.definition as NumberGridDefinition)
    this.fireModelChanged()
    return this.grid
  }

  undo() {
    if (this.history.length === 0) return
    this.grid = this.history.pop()!
    this.fireModelChanged()
  }

  redo() {
    // not implemented
  }

  tap(coord: Coord) {
    const g = this.grid
    const item = getItemAt(g, coord.y, coord.x)
    item.value = (item.value + 1) % 6
    this.store()
    this.fireModelChanged()
  }

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
