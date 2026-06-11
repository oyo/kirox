import type { Model, ModelListener } from '@/types/events'
import type { Coord, GridDefinition } from '@/types/grid'

export const BoardDefinition: GridDefinition = {
  size: { dx: 40, dy: 40 },
}

export const PreviewDefinition: GridDefinition = {
  size: { dx: 10, dy: 9 },
}

export type HexTileDesign = {
  paths: number[][]
  pathIndex: number[]
}

const createHexTile = (paths: number[][]): HexTileDesign => ({
  paths,
  pathIndex: paths.reduce((a, c, i) => {
    a[c[0]] = i
    a[c[1]] = i
    return a
  }, []),
})

export const HexTileCDD = createHexTile([
  [0, 5],
  [1, 3],
  [2, 4],
])

export const HexTileCCC = createHexTile([
  [0, 1],
  [2, 3],
  [4, 5],
])

export const HexTileCLC = createHexTile([
  [0, 5],
  [1, 4],
  [2, 3],
])

export const HexTileDLD = createHexTile([
  [0, 2],
  [1, 4],
  [3, 5],
])

export const HexTileLLL = createHexTile([
  [0, 3],
  [1, 4],
  [2, 5],
])

export const HexTileDesigns = [HexTileCDD, HexTileCCC, HexTileCLC, HexTileDLD, HexTileLLL]

export const getHexTile = (type: number) =>
  HexTileDesigns[type && type < 6 ? type - 1 : Math.floor(Math.random() * HexTileDesigns.length)]

export const NeighborOffsets = [0, 1].map((odd) => [
  [-1, odd],
  [0, 1],
  [1, odd],
  [1, odd - 1],
  [0, -1],
  [-1, odd - 1],
])

export type TileState = {
  pos: Coord
  rot: number
  color?: number
  pathColor: number[]
}

export type BoardTile = {
  id: number
  design: HexTileDesign
  state: TileState
}

export interface BoardState extends GridDefinition {
  grid: BoardTile[][]
}

export const codeToBoard = (code: string) => {
  code = code.replace(/\s+/g, '')
  //const version = parseInt(code[0], 16)
  const dy = (parseInt(code[2], 16) ?? 0) + 1
  const dx = (parseInt(code[3], 16) ?? 0) + 1
  const type = parseInt(code[4] ?? 0, 16) // 0 = random, 1-5 = tile design, 15 = specify each tile in data
  const len = dy * dx * (type < 6 ? 1 : 2)
  const paint = parseInt(code[5] ?? 0, 16)
  const offset = paint ? 8 : 6
  const dstr = code.substring(offset, len + offset).padEnd(len, '0')
  const data: BoardTile[] = (
    type > 5
      ? (dstr.match(/(.{1,2})/g) ?? ['00']).map((t) => [parseInt(t[0], 16), parseInt(t[1], 16)])
      : dstr.split('').map((r) => [type, parseInt(r, 16)])
  ).map((t, i) => ({
    id: i,
    design: getHexTile(t[0]),
    state: {
      pos: { y: Math.floor(i / dx), x: i % dx },
      rot: t[1] === 0 ? Math.floor(6.0 * Math.random()) : (t[1] - 1) % 6,
      pathColor: [0, 0, 0],
    },
  }))
  const grid: BoardTile[][] = []
  for (let i = 0; i < data.length; i += dx) grid.push(data.slice(i, i + dx))
  const board: BoardState = {
    size: {
      dx,
      dy,
    },
    grid,
  }
  return board
}

export interface HexBoardModel extends Model {
  setPattern: (code: string) => HexBoardModel
  fireItemChanged: (item: BoardTile) => void
}

export interface HexBoardModelListener extends ModelListener {
  itemChanged: (model: HexBoardModel, item: BoardTile) => void
}
