import { NONE, type Grid, type GridItem, type NumberGridDefinition } from 'types/grid'

export const copy = (grid: Grid<any>) => grid.map((r) => [...r])

export const border = <T>(grid: Grid<T>, value?: T) => [
  new Array(grid[0].length + 2).fill(value ?? NONE),
  ...grid.map((r) => [value ?? NONE, ...r, value ?? NONE]),
  new Array(grid[0].length + 2).fill(value ?? NONE),
]

export const trim = (grid: Grid<any>) =>
  grid.slice(1, grid.length - 1).map((r) => r.slice(1, r.length - 1))

export const transpose = (grid: Grid<any>) =>
  filterEmpty(grid[0].map((_, c) => grid.map((r) => r[c])))

export const createNumberGrid = (input: string): Grid<number> =>
  input.split('\n').map((l, y) =>
    l.split('').map((n, x) => ({
      id: y * l.length + x,
      coord: { x, y },
      value: parseInt(n),
      state: 0,
    }))
  )

export const createRandomNumberGrid = (definition: NumberGridDefinition): Grid<number> =>
  new Array(definition.size.dy).fill(0).map((_, y) =>
    new Array(definition.size.dx).fill(0).map((_, x) => ({
      id: y * definition.size.dx + x,
      coord: { x, y },
      value: ~~(Math.random() * definition.maxValue),
      state: 0,
    }))
  )

export const getItemAt = (
  grid: Grid<any>,
  y: number,
  x: number,
  border?: boolean
): GridItem<any> =>
  ((g: Grid<any>) =>
    y < 0 || y > g.length - 1 || x < 0 || x > g[y].length - 1 ? NONE : g[y][x])(
    border ? trim(grid) : grid
  )

export const replaceItems = (
  grid: Grid<any>,
  items: GridItem<any>[],
  newItem: GridItem<any>
) => items.map((item) => (grid[item.coord.y][item.coord.x] = newItem))

export const filterEmpty = (grid: Grid<any>) =>
  grid
    .map((r) => r.filter((item) => item.id !== -1))
    .filter((r) => r.length > 0)
    .map((r, y) => r.map((item, x) => ((item.coord.y = y), (item.coord.x = x), item)))

export const debug = (grid: Grid<any>) =>
  grid
    .map((r) => r.map((item) => (item.id === -1 ? ' ' : item.value)).join(' '))
    .join('\n')
