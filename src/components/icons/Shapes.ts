import ball from './svg/ball.svg'
import block from './svg/block.svg'
import shapeblock from './svg/shapeblock.svg'
import shapeletter from './svg/shapeletter.svg'
import shapeplain from './svg/shapeplain.svg'
import Config from 'types/Config'
import { addEvents, N } from 'util/ui'
import { ShapePath } from './ShapePath'

const svgDU = 'data:image/svg+xml;'
const svgDUB = `${svgDU}base64,`
const BASE_COLOR = '808080'
const BASE_PATH = 'M25,5l20,40l-40,0z'

export const svgDecode = (data: string): string =>
  data.startsWith(svgDUB)
    ? atob(data.substring(svgDUB.length))
    : decodeURIComponent(data.substring(svgDU.length))

export const svgEncode = (data: string): string => `${svgDUB}${btoa(data)}`

export const Ball = (col?: Array<string>) =>
  col ? ball.replace(/404040/g, col[0]).replace(/808080/g, col[1]) : ball

export const Block = (col?: Array<string>) =>
  col ? block.replace(/404040/g, col[0]).replace(/808080/g, col[1]) : block

export const Combine = (icon1: string, icon2: string) =>
  svgEncode(
    svgDecode(icon1).replace(
      /<\/svg>/,
      svgDecode(icon2)
        .replace('\n', ' ')
        .replace(/^.*<defs/, '<defs')
    )
  )

export const Shape = (path: string, col?: string) =>
  shapeplain.replace(BASE_PATH, path).replace(BASE_COLOR, col ?? '808080')

export const BlockShape = (path: string, col?: Array<string>) =>
  Combine(Block(col ?? Config.COLOR.ORANGE), shapeblock.replace(BASE_PATH, path))

export const LetterShape = (letter: string, col?: Array<string>) =>
  Combine(
    Block(col ?? Config.COLOR.SKY),
    svgEncode(
      svgDecode(shapeletter).replace('>A<', `>&#x${letter.charCodeAt(0).toString(16)};<`)
    )
  )

export const Image = (shape: string): HTMLImageElement =>
  N('img', undefined, { src: shape }) as HTMLImageElement

export const Button = (image: HTMLImageElement | SVGElement, click: () => void) =>
  addEvents(image, { click })

export const Home = (click: () => void) =>
  Button(Image(BlockShape(ShapePath.HOME)), click)
export const Reset = (click: () => void) =>
  Button(Image(BlockShape(ShapePath.RESET)), click)
export const Undo = (click: () => void) =>
  Button(Image(BlockShape(ShapePath.UNDO)), click)
export const Redo = (click: () => void) =>
  Button(Image(BlockShape(ShapePath.REDO)), click)
export const Hint = (click: () => void) =>
  Button(Image(BlockShape(ShapePath.HINT)), click)

export const Success = () => Image(Shape(ShapePath.OK, Config.COLOR.GREEN[1]))
export const Fail = () => Image(Shape(ShapePath.NOK, Config.COLOR.RED[1]))
