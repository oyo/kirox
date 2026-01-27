export const Direction = {
  UP: 1,
  RIGHT: 2,
  DOWN: 4,
  LEFT: 8,
}

export type GridSize = {
  dx: number
  dy: number
}

export type Coord = {
  x: number
  y: number
}

export interface GridItem<T> {
  id: number
  coord: Coord
  value: T
  state: number
}

export const NONE: GridItem<number> = {
  id: -1,
  coord: { x: -1, y: -1 },
  value: -1,
  state: -1,
}

export interface GridDefinition {
  size: GridSize
}

export interface NumberGridDefinition extends GridDefinition {
  maxValue: number
}

export type Grid<T> = GridItem<T>[][]
