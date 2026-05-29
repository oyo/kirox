import { svgEncode } from '@/util/image'
import hexagon from './hexagon.svg?raw'

export const HexTile = (rot: number) => svgEncode(hexagon.replace('(0)', `(${rot * 60})`))
