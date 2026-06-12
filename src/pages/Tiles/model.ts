import { type Coord } from '@/types/grid'
import type { Model, ModelListener } from '@/types/events'
import {
  NeighborOffsets,
  TileSets,
  type BoardState,
  type BoardTile,
  type HexBoardModel,
  type HexBoardModelListener,
} from './types'
import { headerToString, parseCode } from './pattern'

export class TilesModel implements HexBoardModel {
  state: BoardState
  listener: HexBoardModelListener[] = []
  colorMix: Set<string> = new Set()

  constructor(code?: string | null) {
    this.state = parseCode(code ?? '00')
  }

  reset() {
    this.state = parseCode(this.state.code)
    const paint = this.state.paint
    if (paint) {
      paint.state.color = 9
      paint.state.pathColor = [1, 2, 3]
      this.paintPaths(paint)
    } else this.fireModelChanged()
  }

  undo() {
    // not implemented
  }

  redo() {
    this.state.tileset = (this.state.tileset + 1) % (TileSets.length + 1)
    this.state.code = headerToString(this.state)
    return this.reset()
  }

  resetColors() {
    this.colorMix.clear()
    this.state.grid.forEach((row) =>
      row.forEach((tile) => {
        tile.state.color = 0
        tile.state.pathColor = [0, 0, 0]
      }),
    )
  }

  paintNeigborPath(item: BoardTile, pi: number) {
    const s = item.state
    const c = s.pathColor!
    const p = s.pos
    const o = NeighborOffsets[p.y % 2]
    item.design.paths[pi]
      .map((q, i) => [i, p.y + o[(s.rot + q) % 6][0], p.x + o[(s.rot + q) % 6][1]])
      .filter(
        (c) => c[1] >= 0 && c[1] < this.state.size.dy && c[2] >= 0 && c[2] < this.state.size.dx,
      )
      .map((cn) => ({
        o: cn[0],
        t: this.state.grid[cn[1]][cn[2]],
      }))
      .map((n) => ({
        ...n,
        i: (item.design.paths[pi][n.o] + s.rot + 9 - n.t.state.rot) % 6,
      }))
      .forEach((n) => {
        const npi = n.t.design.pathIndex[n.i]
        const col = n.t.state.pathColor[npi]
        if (col !== 0) {
          if (col !== c[pi]) this.colorMix.add([col, c[pi]].sort((a, b) => a - b).join('+'))
        } else {
          n.t.state.pathColor[npi] = c[pi]
          this.paintNeigborPath(n.t, npi)
        }
      })
  }

  paintPaths(item: BoardTile) {
    item.state.pathColor.forEach((_, pi) => this.paintNeigborPath(item, pi))
    let repaint: undefined | ((c: number) => number)
    if (this.colorMix.size > 1) {
      repaint = (c) => (c !== 0 ? 1 : 0)
    } else if (this.colorMix.size === 1) {
      const cm = [...this.colorMix][0].split('+').map((n) => Number(n))
      repaint = (c: number) => (c === cm[1] ? cm[0] : c)
    }
    if (repaint)
      this.state.grid.forEach((row) =>
        row.forEach((tile) => (tile.state.pathColor = tile.state.pathColor.map(repaint))),
      )
    setTimeout(this.fireModelChanged.bind(this), 120)
  }

  tap(pos: Coord) {
    const item = this.state.grid[pos.y][pos.x]
    this.resetColors()
    item.state.color = 9
    item.state.pathColor = [1, 2, 3]
    item.state.rot = (item.state.rot + 1) % 6
    this.state.paint = item
    console.log(item)
    this.fireItemChanged(item)
    this.paintPaths(item)
  }

  addModelListener(l: ModelListener) {
    this.listener.push(l as HexBoardModelListener)
    return this as Model
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
