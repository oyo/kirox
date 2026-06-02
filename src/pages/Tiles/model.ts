import { type Coord, type GridDefinition } from '@/types/grid'
import type { Model, ModelListener } from '@/types/events'
import {
  BoardDefinition,
  HexTileDesigns,
  type BoardTile,
  type HexBoardModel,
  type HexBoardModelListener,
} from './types'

export class TilesModel implements HexBoardModel {
  definition: GridDefinition
  grid: BoardTile[][] = []
  listener: HexBoardModelListener[] = []
  colorMix: Set<string> = new Set()

  constructor(definition: GridDefinition) {
    this.definition = definition
  }

  reset() {
    this.grid = Array.from({ length: this.definition.size.dy }, (_, y) =>
      Array.from({ length: this.definition.size.dx }, (_, x) => ({
        id: y * this.definition.size.dx + x,
        design: HexTileDesigns[1 /*Math.floor(Math.random() * HexTileDesigns.length)*/],
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

  paintNeigborPath(item: BoardTile, pi: number) {
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
    const cn = d.paths[pi]
      .map((q, i) => [i, p.y + o[(s.rot + q) % 6][0], p.x + o[(s.rot + q) % 6][1]])
      .filter(
        (c) =>
          c[1] >= 0 &&
          c[1] < BoardDefinition.size.dy &&
          c[2] >= 0 &&
          c[2] < BoardDefinition.size.dx,
      )
      .map((cn) => ({
        o: cn[0],
        t: g[cn[1]][cn[2]],
      }))
      .map((n) => ({
        ...n,
        i: (d.paths[pi][n.o] + s.rot + 9 - n.t.state.rot) % 6,
      }))
    for (let n of cn) {
      const npi = n.t.design.pathIndex[n.i]
      const col = n.t.state.pathColor[npi]
      if (col !== 0) {
        if (col !== c[pi]) this.colorMix.add([col, c[pi]].sort((a, b) => a - b).join('+'))
      } else {
        n.t.state.pathColor[npi] = c[pi]
        this.paintNeigborPath(n.t, npi)
      }
    }
  }

  /*
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
  */

  tap(pos: Coord) {
    const item = this.grid[pos.y][pos.x]
    this.grid.forEach((row) => row.forEach((tile) => (tile.state.pathColor = [0, 0, 0])))
    this.colorMix.clear()
    item.state.pathColor = [1, 2, 3]
    item.state.rot = (item.state.rot + 1) % 6
    this.fireItemChanged(item)
    for (let pi = 0; pi < 3; pi++) this.paintNeigborPath(item, pi)
    if (this.colorMix.size > 1) {
      this.grid.forEach((row) =>
        row.forEach(
          (tile) => (tile.state.pathColor = tile.state.pathColor.map((c) => (c !== 0 ? 1 : 0))),
        ),
      )
    } else if (this.colorMix.size === 1) {
      const cm = [...this.colorMix][0].split('+').map((n) => Number(n))
      this.grid.forEach((row) =>
        row.forEach(
          (tile) =>
            (tile.state.pathColor = tile.state.pathColor.map((c) => (c === cm[1] ? cm[0] : c))),
        ),
      )
    }
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
