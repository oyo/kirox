import { type Coord, type Grid, type GridItem, type NumberGridDefinition } from '@/types/grid'
import { createNumberGrid, createRandomNumberGrid, getItemAt, transpose } from '@/util/grid'
import type { GridModel, GridModelListener, Model, ModelListener } from '@/types/events'

export class TilesModel implements GridModel<number> {
  definition: NumberGridDefinition | string
  grid: Grid<number> = []
  listener: GridModelListener<number>[] = []

  constructor(definition: NumberGridDefinition | string) {
    this.definition = definition
  }

  reset() {
    this.grid =
      typeof this.definition === 'string'
        ? transpose(createNumberGrid(this.definition as string))
        : createRandomNumberGrid(this.definition as NumberGridDefinition)
    this.fireModelChanged()
    return this.grid
  }

  undo() {
    // not implemented
  }

  redo() {
    // not implemented
  }

  tap(coord: Coord) {
    const g = this.grid
    const item = getItemAt(g, coord.y, coord.x)
    item.value = (item.value + 1) % 6
    this.fireItemChanged(item)
  }

  addModelListener(_l: ModelListener) {
    // not implemented
    return this as unknown as Model
  }

  addGridModelListener(l: GridModelListener<number>) {
    this.listener.push(l)
    return this as unknown as GridModel<number>
  }

  fireModelChanged() {
    this.listener.forEach((l) => l.modelChanged(this as unknown as Model))
  }

  fireItemChanged(item: GridItem<number>) {
    this.listener.forEach((l) => l.itemChanged(this as unknown as GridModel<number>, item))
  }

  fireModelFinished(_status: number) {
    // not implemented
  }
}
