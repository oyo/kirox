import { type Coord, type Grid, type GridDefinition, type GridItem } from 'types/grid'
import {
  countState,
  countValue,
  createEmptyNumberGrid,
  createNumberGrid,
  getItemAt,
  transpose,
} from 'util/grid'
import type { Model, ModelListener } from 'types/events'

export interface MineSweeperDefinition extends GridDefinition {
  mines: number
}

const DefaultDefinition: MineSweeperDefinition = {
  size: { dx: 12, dy: 12 },
  mines: 26,
}

export class MineSweeperModel implements Model {
  definition: MineSweeperDefinition | string
  grid: Grid<number> = []
  listener: ModelListener[] = []

  constructor(definition: MineSweeperDefinition | string = DefaultDefinition) {
    this.definition = definition
  }

  reset() {
    let g
    if (typeof this.definition === 'string') {
      g = this.grid = transpose(createNumberGrid(this.definition as string))
    } else {
      g = this.grid = createEmptyNumberGrid(this.definition.size, 0)
      for (let m = 0; m < this.definition.mines; m++) {
        let x, y, item
        do {
          x = ~~(Math.random() * this.definition.size.dx)
          y = ~~(Math.random() * this.definition.size.dy)
          item = getItemAt(g, x, y)
        } while (item.value === 9)
        item.value = 9
      }
    }
    for (let y = 0; y < g.length; y++) {
      for (let x = 0; x < g[y].length; x++) {
        const item = getItemAt(g, y, x)
        if (item.value !== 9)
          item.value =
            (getItemAt(g, y - 1, x - 1).value === 9 ? 1 : 0) +
            (getItemAt(g, y - 1, x).value === 9 ? 1 : 0) +
            (getItemAt(g, y - 1, x + 1).value === 9 ? 1 : 0) +
            (getItemAt(g, y, x - 1).value === 9 ? 1 : 0) +
            (getItemAt(g, y, x + 1).value === 9 ? 1 : 0) +
            (getItemAt(g, y + 1, x - 1).value === 9 ? 1 : 0) +
            (getItemAt(g, y + 1, x).value === 9 ? 1 : 0) +
            (getItemAt(g, y + 1, x + 1).value === 9 ? 1 : 0)
      }
    }
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
    const open = (item: GridItem<number>): boolean => {
      if (item.state !== 0) return false
      item.state = 1
      if (item.value === 9) {
        this.fireModelFinished(1)
        return true
      }
      if (item.value === 0) {
        open(getItemAt(g, item.coord.y - 1, item.coord.x - 1))
        open(getItemAt(g, item.coord.y - 1, item.coord.x))
        open(getItemAt(g, item.coord.y - 1, item.coord.x + 1))
        open(getItemAt(g, item.coord.y, item.coord.x - 1))
        open(getItemAt(g, item.coord.y, item.coord.x + 1))
        open(getItemAt(g, item.coord.y + 1, item.coord.x - 1))
        open(getItemAt(g, item.coord.y + 1, item.coord.x))
        open(getItemAt(g, item.coord.y + 1, item.coord.x + 1))
      }
      return true
    }
    const change = open(getItemAt(g, coord.y, coord.x))
    if (change) {
      this.fireModelChanged()
      if (countState(g, 0) === countValue(g, 9)) this.fireModelFinished(0)
    }
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
