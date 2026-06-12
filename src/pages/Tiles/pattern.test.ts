import { expect, test } from 'vite-plus/test'
import { MAX_BOARD_SIZE, parseCode } from './pattern.ts'

test('parse code', () => {
  expect(parseCode('').size).toEqual({ dy: MAX_BOARD_SIZE, dx: MAX_BOARD_SIZE })
  expect(parseCode('00').size).toEqual({ dy: MAX_BOARD_SIZE, dx: MAX_BOARD_SIZE })
  expect(parseCode('0100').size).toEqual({ dy: 2, dx: 1 })
  expect(parseCode('0111').size).toEqual({ dy: 2, dx: 2 })
})
