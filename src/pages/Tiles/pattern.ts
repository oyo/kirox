import type { GridSize } from '@/types/grid'
import { getHexTile, type BoardState, type BoardTile } from './types'

const DEFAULT_CODE = '00323210' // version latest, size 32x32, tiles CDD, no paint
const MAX_CODE_LENGTH = 99 * 99 + 10
export const MAX_BOARD_SIZE = 32

const parseTileDataV1 = (size: GridSize, type: number, tdata: string) => {
  const data = (
    type > 5
      ? (tdata.match(/(.{1,2})/g) ?? ['00']).map((t) => [parseInt(t[0], 16), parseInt(t[1], 16)])
      : tdata.split('').map((r) => [type, parseInt(r, 16)])
  ).map((t, i) => ({
    id: i,
    design: getHexTile(t[0]),
    state: {
      pos: { y: Math.floor(i / size.dx), x: i % size.dx },
      rot: t[1] === 0 ? Math.floor(6.0 * Math.random()) : (t[1] - 1) % 6,
      pathColor: [0, 0, 0],
    },
  }))
  const grid: BoardTile[][] = []
  for (let i = 0; i < data.length; i += size.dx) grid.push(data.slice(i, i + size.dx))
  return grid
}

const parseTileData = (size: GridSize, type: number, tdata: string) => {
  const data = (
    type === 0
      ? (tdata.match(/(.{1,2})/g) ?? ['00']).map((t) => [parseInt(t[0]), parseInt(t[1])])
      : tdata.split('').map((r) => [type, parseInt(r)])
  ).map((t, i) => ({
    id: i,
    design: getHexTile(t[0]),
    state: {
      pos: { y: Math.floor(i / size.dx), x: i % size.dx },
      rot: t[1] === 0 ? Math.floor(6.0 * Math.random()) : t[1] % 6,
      pathColor: [0, 0, 0],
    },
  }))
  const grid: BoardTile[][] = []
  for (let i = 0; i < data.length; i += size.dx) grid.push(data.slice(i, i + size.dx))
  return grid
}
const parseVersion = [
  // v0
  (code: string) => {
    const dy = parseInt(code.substring(0, 2).padEnd(1, '0'))
    const dx = parseInt(code.substring(2, 4).padEnd(1, '0'))
    const size = {
      dy: dy === 0 || dy > MAX_BOARD_SIZE ? MAX_BOARD_SIZE : dy,
      dx: dx === 0 || dx > MAX_BOARD_SIZE ? MAX_BOARD_SIZE : dx,
    }
    const tileset = parseInt(code[4] ?? 0) // 0 = specify each tile in data, 1-6
    const len = size.dy * size.dx * (tileset === 0 ? 2 : 1)
    const doPaint = parseInt(code[5] ?? 0)
    const offset = doPaint ? 10 : 6
    const tdata = code.substring(offset, len + offset).padEnd(len, '0')
    const grid = parseTileData(size, tileset, tdata)
    let paint
    if (doPaint) {
      const py = parseInt(code.substring(6, 8).padStart(2, '0'))
      const px = parseInt(code.substring(8, 10).padStart(2, '0'))
      paint =
        grid[py === 0 ? Math.floor(size.dy * Math.random()) : py % size.dy][
          px === 0 ? Math.floor(size.dx * Math.random()) : px % size.dx
        ]
    }
    return {
      tileset,
      grid,
      size,
      paint,
    }
  },
  // v1
  (code: string) => {
    const size = {
      dy: (parseInt(code[0] ?? 0, 16) ?? 0) + 1,
      dx: (parseInt(code[1] ?? 0, 16) ?? 0) + 1,
    }
    if (size.dy % 2 === 1) size.dy++
    const tileset = parseInt(code[2] ?? 0, 16) // 0 = random, 1-5 = tile design, 15 = specify each tile in data
    const len = size.dy * size.dx * (tileset < 6 ? 1 : 2)
    const doPaint = parseInt(code[3] ?? 0, 16)
    const offset = doPaint ? 6 : 4
    let tdata = code.substring(offset, len + offset).padEnd(len, '0')
    const grid = parseTileDataV1(size, tileset, tdata)
    const paint = doPaint ? grid[parseInt(code[4], 16)][parseInt(code[5], 16)] : undefined
    return {
      tileset,
      grid,
      size,
      paint,
    }
  },
]

export const parseCode = (rcode: string): BoardState => {
  const pcode = rcode.replace(/[^a-fA-F0-9]/g, '')
  const code =
    pcode.length < DEFAULT_CODE.length
      ? `${pcode}${DEFAULT_CODE.substring(pcode.length)}`
      : pcode.substring(0, MAX_CODE_LENGTH)
  const version = parseInt(code.substring(0, 2))
  const parser = parseVersion[version] ?? parseVersion[0]
  const state = {
    ...parser(code.substring(2)),
    code,
  }
  return state
}

export const headerToString = (state: BoardState) =>
  `02${state.size.dy.toString().padStart(2, '0')}${state.size.dx
    .toString()
    .padStart(2, '0')}${state.tileset.toString()}0`

export const stateToString = (state: BoardState) =>
  `02${state.size.dy.toString().padStart(2, '0')}${state.size.dx
    .toString()
    .padStart(2, '0')}${state.tileset.toString()}${
    state.paint
      ? `1${Math.floor(state.paint.id / state.size.dx)
          .toString()
          .padStart(2, '0')}${(state.paint.id % state.size.dx).toString().padStart(2, '0')}`
      : 0
  }.${state.grid
    .map((y) =>
      y
        .map(
          (tile) =>
            `${state.tileset === 0 ? tile.design.id : ''}${tile.state.rot === 0 ? 6 : tile.state.rot}`,
        )
        .join(''),
    )
    .join('.')}`
