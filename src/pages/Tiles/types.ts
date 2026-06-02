import type { Model, ModelListener } from '@/types/events'
import type { Coord, GridDefinition } from '@/types/grid'

export type HexTileDesign = {
  connect: number[]
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
  connect: paths.reduce((a, c) => {
    a[c[0]] = c[1]
    a[c[1]] = c[0]
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

export const HexTileDesigns = [HexTileCDD]

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

export interface HexBoardModel extends Model {
  fireItemChanged: (item: BoardTile) => void
}

export interface HexBoardModelListener extends ModelListener {
  itemChanged: (model: HexBoardModel, item: BoardTile) => void
}

export const BoardDefinition: GridDefinition = {
  size: { dx: 10, dy: 10 },
}
