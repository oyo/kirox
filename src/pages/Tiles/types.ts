import type { Model, ModelListener } from '@/types/events'
import type { Coord, GridDefinition } from '@/types/grid'

export const BoardDefinition: GridDefinition = {
  size: { dx: 40, dy: 40 },
}

export const PreviewDefinition: GridDefinition = {
  size: { dx: 10, dy: 9 },
}

export type HexTileDesign = {
  id: number
  paths: number[][]
  pathIndex: number[]
}

const createHexTile = (id: number, paths: number[][]): HexTileDesign => ({
  id,
  paths,
  pathIndex: paths.reduce((a, c, i) => {
    a[c[0]] = i
    a[c[1]] = i
    return a
  }, []),
})

export const HexTileCDD = createHexTile(1, [
  [0, 5],
  [1, 3],
  [2, 4],
])

export const HexTileCCC = createHexTile(2, [
  [0, 1],
  [2, 3],
  [4, 5],
])

export const HexTileCLC = createHexTile(3, [
  [0, 5],
  [1, 4],
  [2, 3],
])

export const HexTileDLD = createHexTile(4, [
  [0, 2],
  [1, 4],
  [3, 5],
])

export const HexTileLLL = createHexTile(5, [
  [0, 3],
  [1, 4],
  [2, 5],
])

export const HexTileDesigns = [HexTileCDD, HexTileCCC, HexTileCLC, HexTileDLD, HexTileLLL]

export const TileSets = [
  [HexTileCDD],
  [HexTileCCC],
  [HexTileCLC],
  [HexTileDLD],
  [HexTileLLL],
  HexTileDesigns,
]

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
  code: string
  tileset: number
  grid: BoardTile[][]
  paint?: BoardTile
}

export interface HexBoardModel extends Model {
  fireItemChanged: (item: BoardTile) => void
}

export interface HexBoardModelListener extends ModelListener {
  itemChanged: (model: HexBoardModel, item: BoardTile) => void
}
