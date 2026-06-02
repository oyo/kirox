import { N, Viewable } from '@/util/ui'
import type { GridItem } from '@/types/grid'
import './style.css'

const E = 50.0 // hexagon edge length
const E2 = 2 * E
const E05 = 0.5 * E
const E075 = 0.75 * E
const E15 = 1.5 * E
const W05 = E * Math.cos(Math.PI / 6) // hexagon half width
const W025 = 0.5 * W05
const W15 = 1.5 * W05
const TRANSLATE = `${E},${E}`
const VIEW_BOX = `0 0 ${E2} ${E2}`
const PATH_HEXAGON = `M ${-W05} ${-E05} l ${W05} ${-E05} l ${W05} ${E05} l 0 ${E} l ${-W05} ${E05} l ${-W05} ${-E05} z`
const PATH_CURVE_T = `M ${-W025} ${-E075} a ${E05} ${E05} 0 0 0 ${W05} 0`
const PATH_CURVE_L = `M ${-W05} 0 a ${E15} ${E15} 0 0 1 ${W15} ${E075}`
const PATH_CURVE_R = `M ${-W025} ${E075} a ${E15} ${E15} 0 0 1 ${W15} ${-E075}`

export class HexTileView extends Viewable {
  shape: SVGGElement
  item: GridItem<number>
  constructor(item: GridItem<number>) {
    super()
    this.item = item
    this.view = N(
      'svg:svg',
      (this.shape = N(
        'svg:g',
        [
          N('svg:path', undefined, {
            class: 'hexagon-shape',
            d: PATH_HEXAGON,
          }),
          N('svg:path', undefined, {
            class: 'path-outer',
            d: PATH_CURVE_T,
          }),
          N('svg:path', undefined, {
            class: 'path-inner',
            d: PATH_CURVE_T,
          }),
          N('svg:path', undefined, {
            class: 'path-outer',
            d: PATH_CURVE_L,
          }),
          N('svg:path', undefined, {
            class: 'path-inner',
            d: PATH_CURVE_L,
          }),
          N('svg:path', undefined, {
            class: 'path-outer',
            d: PATH_CURVE_R,
          }),
          N('svg:path', undefined, {
            class: 'path-inner',
            d: PATH_CURVE_R,
          }),
        ],
        {
          transform: `translate(${TRANSLATE})rotate(${item.value * 60})`,
        },
      ) as SVGGElement),
      {
        class: 'hexagon',
        viewBox: VIEW_BOX,
        id: `i${item.coord.y}_${item.coord.x}`,
      },
    )
  }

  rotate() {
    this.shape.setAttribute('transform', `translate(${TRANSLATE})rotate(${this.item.value * 60})`)
    return this
  }
}
