import {
  NONE,
  type Coord,
  type Grid,
  type GridItem,
  type NumberGridDefinition,
} from 'types/grid'
import {
  copy,
  createNumberGrid,
  createRandomNumberGrid,
  filterEmpty,
  getItemAt,
  replaceItems,
  transpose,
} from 'util/grid'
import type { Model, ModelListener } from 'types/events'

export class SameModel implements Model {
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
    this.grid = this.history
      .pop()!
      .map((r, y) => r.map((item, x) => ((item.coord.y = y), (item.coord.x = x), item)))
    this.fireModelChanged()
  }

  redo() {
    // not implemented
  }

  tap(coord: Coord) {
    const g = this.grid
    const same = new Set<GridItem<number>>()
    const check = (item: GridItem<number>, value: number): boolean =>
      item.value === value &&
      !same.has(item) &&
      (same.add(item),
      check(getItemAt(g, item.coord.y - 1, item.coord.x), value),
      check(getItemAt(g, item.coord.y + 1, item.coord.x), value),
      check(getItemAt(g, item.coord.y, item.coord.x - 1), value),
      check(getItemAt(g, item.coord.y, item.coord.x + 1), value))
    const item = getItemAt(g, coord.y, coord.x)
    check(item, item.value)
    if (same.size > 1) {
      this.store()
      replaceItems(this.grid, [...same], NONE)
      this.grid = filterEmpty(this.grid)
      this.fireModelChanged()
      this.checkMoves()
    }
  }

  checkMoves() {
    const g = this.grid
    if (g.length === 0) {
      this.fireModelFinished(0)
      return this
    }
    let noNeighbor = true
    for (let y = 0; y < g.length && noNeighbor; y++) {
      for (let x = 0; x < g[y].length && noNeighbor; x++) {
        const v = getItemAt(g, y, x).value
        if (v === getItemAt(g, y, x + 1).value || v === getItemAt(g, y + 1, x).value) {
          noNeighbor = false
        }
      }
    }
    if (noNeighbor) this.fireModelFinished(1)
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
