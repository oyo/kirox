import { N, Viewable } from '@/util/ui'
import './style.css'
import type { BoardTile } from '@/pages/Tiles/types'

const E = 50.0 // hexagon edge length
const E2 = 2 * E
const E05 = 0.5 * E
const E075 = 0.75 * E
const E15 = 1.5 * E
const W05 = E * Math.cos(Math.PI / 6) // hexagon half width
const W = 2 * W05
const W025 = 0.5 * W05
const W15 = 1.5 * W05
const TRANSLATE = `${E},${E}`
const VIEW_BOX = `0 0 ${E2} ${E2}`
const PATH_HEXAGON = `M ${-W05} ${-E05} l ${W05} ${-E05} l ${W05} ${E05} l 0 ${E} l ${-W05} ${E05} l ${-W05} ${-E05} z`
// small curves
const PATH_C_05 = `M ${-W025} ${-E075} a ${E05} ${E05} 0 0 0 ${W05} 0`
const PATH_C_01 = `M ${W025} ${-E075} a ${E05} ${E05} 0 0 0 ${W025} ${E075}`
const PATH_C_23 = `M ${-W025} ${E075} a ${E05} ${E05} 0 0 1 ${W05} 0`
const PATH_C_45 = `M ${-W05} 0 a ${E05} ${E05} 0 0 0 ${W025} ${-E075}`
// large curves
const PATH_D_24 = `M ${-W05} 0 a ${E15} ${E15} 0 0 1 ${W15} ${E075}`
const PATH_D_13 = `M ${-W025} ${E075} a ${E15} ${E15} 0 0 1 ${W15} ${-E075}`
const PATH_D_02 = `M ${W025} ${-E075} a ${E15} ${E15} 0 0 0 0 ${E15}`
const PATH_D_35 = `M ${-W025} ${-E075} a ${E15} ${E15} 0 0 1 0 ${E15}`
// lines
const PATH_L_03 = `M ${W025} ${-E075} l ${-W05} ${E15}`
const PATH_L_14 = `M ${-W05} 0 l ${W} 0`
const PATH_L_25 = `M ${-W025} ${-E075} l ${W05} ${E15}`

const Paths: Record<string, string> = {
  '01': PATH_C_01,
  '02': PATH_D_02,
  '03': PATH_L_03,
  '05': PATH_C_05,
  '13': PATH_D_13,
  '14': PATH_L_14,
  '23': PATH_C_23,
  '24': PATH_D_24,
  '25': PATH_L_25,
  '35': PATH_D_35,
  '45': PATH_C_45,
}

const getPathShape = (pathDef: string) => [
  N('svg:path', undefined, {
    class: 'path-outer',
    d: pathDef,
  }) as SVGPathElement,
  N('svg:path', undefined, {
    class: 'path-inner',
    d: pathDef,
  }) as SVGPathElement,
]

export class HexTileView extends Viewable {
  shape: SVGGElement
  item: BoardTile
  paths: SVGPathElement[]
  constructor(item: BoardTile) {
    super()
    this.item = item
    const paths = item.design.paths.map((p) => getPathShape(Paths[p.join('')]))
    this.view = N(
      'svg:svg',
      (this.shape = N(
        'svg:g',
        [
          N('svg:path', undefined, {
            class: 'hexagon-shape',
            d: PATH_HEXAGON,
          }),
          ...paths,
        ].flat(),
        {
          transform: `translate(${TRANSLATE})rotate(${item.state.rot * 60})`,
        },
      ) as SVGGElement),
      {
        class: 'hexagon',
        viewBox: VIEW_BOX,
        id: `i${item.state.pos.y}_${item.state.pos.x}`,
      },
    )
    this.paths = paths.map((p) => p[1])
    this.paths.forEach((p, i) => p.classList.add(`c${item.state.pathColor![i]}`))
  }

  update() {
    this.paths.forEach((p, i) => p.classList.add(`c${this.item.state.pathColor![i]}`))
    this.view.classList.add('rot')
    setTimeout(() => {
      this.view.classList.remove('rot')
      this.shape.setAttribute(
        'transform',
        `translate(${TRANSLATE})rotate(${this.item.state.rot * 60})`,
      )
    }, 100)
    return this
  }
}
