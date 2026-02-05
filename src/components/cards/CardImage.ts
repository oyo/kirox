import { type Card, CardValueName } from 'types/cards'
import { N } from 'util/ui'
import { ColorShape } from './ColorShape'
import { svgEncode } from 'util/image'

const W = 64
const H = 100

const XV = 4
const XC = 4
const XCA = 11
const YV = 6
const YC = 14
const YCA = 6

const X1 = W / 4
const X2 = W / 2
const X3 = W - X1

const Y1 = 0.2 * H
const Y2 = 0.3 * H
const Y35 = 0.35 * H
const Y3 = 0.4 * H
const Y4 = H / 2
const Y5 = H - Y3
const Y65 = H - Y35
const Y6 = H - Y2
const Y7 = H - Y1

const C1 = [[X2, Y4]]
const C2 = [
  [X2, Y1],
  [X2, Y7],
]
const C3 = [...C1, ...C2]
const C4 = [
  [X1, Y1],
  [X3, Y1],
  [X1, Y7],
  [X3, Y7],
]
const C5 = [...C1, ...C4]
const C6 = [
  [X1, Y1],
  [X1, Y4],
  [X1, Y7],
  [X3, Y1],
  [X3, Y4],
  [X3, Y7],
]
const C7 = [...C6, [X2, Y35]]
const C8 = [...C7, [X2, Y65]]
const C9 = [...C5, [X1, Y3], [X1, Y5], [X3, Y3], [X3, Y5]]
const C10 = [...C4, [X1, Y3], [X1, Y5], [X3, Y3], [X3, Y5], [X2, Y2], [X2, Y6]]

const C = [[], C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]

const name = ['', 'club', 'heart', 'spade', 'diamond']

const CardShape = (
  color: number,
  content: string
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<defs>
<style>
.b{fill:black;}
.r{fill:red;}
.w{stroke:#404040;stroke-width:0.3;}
.t{font-family:Georgia,serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}
</style>
<linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#f5ede2"></stop>
<stop offset="100%" stop-color="#ebe1d0"></stop>
</linearGradient>
<path id="c" class="${color % 2 ? 'b' : 'r'}" d="${ColorShape[color]}"/>
</defs>
<rect class="w" fill="url(#p)" x="0" y="0" rx="${(W + H) / 60}" ry="${(W + H) / 60}" width="${W}" height="${H}" />
${content}
</svg>`

const transform = (content: string, x: number, y: number, scale: number) =>
  `<g transform="translate(${x},${y})scale(${scale})${y > 50 ? 'rotate(180)' : ''}">${content}</g>`

const val = (card: Card) =>
  `<text class="t ${card.color % 2 ? 'b' : 'r'}">${CardValueName[card.value]}</text>`

const createShape = (card: Card): string =>
  CardShape(
    card.color,
    `${transform(val(card), XV, YV, 1)}${transform(
      '<use href="#c"/>',
      card.variant ? XCA : XC,
      card.variant ? YCA : YC,
      0.15
    )}${transform(val(card), W - XV, H - YV, 1)}${transform(
      '<use href="#c"/>',
      card.variant ? W - XCA : W - XC,
      card.variant ? H - YCA : H - YC,
      0.15
    )}${
      card.value > 10
        ? transform(val(card), X2, Y4, 5)
        : C[card.value].map((c) => transform('<use href="#c"/>', c[0], c[1], 0.35))
    }
`
  )

export const CardImage = (card: Card): HTMLImageElement =>
  N('img', null, { class: 'card', src: svgEncode(createShape(card)) }) as HTMLImageElement
