import {
  NONE,
  type Coord,
  type Grid,
  type GridItem,
  type NumberGridDefinition,
} from 'types/global'
import {
  createNumberGrid,
  createRandomNumberGrid,
  getItemAt,
  replaceItems,
} from 'util/grid'
import type { Model, ModelListener } from 'types/events'

export class SameModel implements Model {
  definition: NumberGridDefinition | string
  grid: Grid<number>
  listener: ModelListener[]

  constructor(definition: NumberGridDefinition | string) {
    this.definition = definition
    this.listener = []
    this.grid = []
  }

  reset() {
    this.grid =
      typeof this.definition === 'string'
        ? createNumberGrid(this.definition as string)
        : createRandomNumberGrid(this.definition as NumberGridDefinition)
    this.fireModelChanged()
    return this.grid
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
    if (same.size > 1) replaceItems(g, [...same], NONE)
    return this.compact()
  }

  compact() {
    this.grid = this.grid
      .map((r) => r.filter((item) => item.id !== -1))
      .filter((r) => r.length > 0)
      .map((r, y) => r.map((item, x) => ((item.coord.y = y), (item.coord.x = x), item)))
    this.fireModelChanged()
  }

  addModelListener(l: ModelListener) {
    this.listener.push(l)
    return this
  }

  fireModelChanged() {
    this.listener.forEach((l) => l.modelChanged(this))
  }
}
