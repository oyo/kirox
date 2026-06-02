import { type Coord, type GridDefinition } from '@/types/grid'
import type { Model, ModelListener } from '@/types/events'
import { HexTileCDD, type BoardTile, type HexBoardModel, type HexBoardModelListener } from './types'

export class TilesModel implements HexBoardModel {
  definition: GridDefinition
  grid: BoardTile[][] = []
  listener: HexBoardModelListener[] = []

  constructor(definition: GridDefinition) {
    this.definition = definition
  }

  reset() {
    this.grid = Array.from({ length: this.definition.size.dy }, (_, y) =>
      Array.from({ length: this.definition.size.dx }, (_, x) => ({
        id: y * this.definition.size.dx + x,
        design: HexTileCDD, // HexTileDesigns[Math.floor(Math.random() * HexTileDesigns.length)],
        state: {
          pos: { y, x },
          rot: Math.floor(Math.random() * 6),
          pathColor: [0, 0, 0],
        },
      })),
    )
    this.fireModelChanged()
    return this.grid
  }

  undo() {
    // not implemented
  }

  redo() {
    // not implemented
  }

  paintPath(item: BoardTile) {
    const g = this.grid
    const d = item.design
    const s = item.state
    const c = s.pathColor!
    const p = s.pos
    const odd = p.y % 2
    const o = [
      [-1, odd],
      [0, 1],
      [1, odd],
      [1, odd - 1],
      [0, -1],
      [-1, odd - 1],
    ]
    const neighbors = o.map((_, i) => g[p.y + o[(s.rot + i) % 6][0]][p.x + o[(s.rot + i) % 6][1]])
    for (let pi = 0; pi < d.paths.length; pi++) {
      d.paths[pi]
        .map((p) => neighbors[p])
        .map(
          (n, i) =>
            (n.state.pathColor[n.design.pathIndex[(d.paths[pi][i] + s.rot + 9 - n.state.rot) % 6]] =
              c[pi]),
        )
    }
  }

  tap(pos: Coord) {
    const item = this.grid[pos.y][pos.x]
    this.grid.forEach((row) => row.forEach((tile) => (tile.state.pathColor = [0, 0, 0])))
    item.state.pathColor = [1, 2, 3]
    item.state.rot = (item.state.rot + 1) % 6
    this.fireItemChanged(item)
    this.paintPath(item)
    setTimeout(this.fireModelChanged.bind(this), 150)
  }

  addModelListener(l: ModelListener) {
    this.listener.push(l as unknown as HexBoardModelListener)
    return this as unknown as Model
  }

  fireModelChanged() {
    this.listener.forEach((l) => l.modelChanged(this as Model))
  }

  fireItemChanged(item: BoardTile) {
    this.listener.forEach((l) => l.itemChanged(this as HexBoardModel, item))
  }

  fireModelFinished(_status: number) {
    // not implemented
  }
}
