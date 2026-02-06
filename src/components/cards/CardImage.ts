import { type Card, CardValueName } from 'types/cards'
import { N } from 'util/ui'
import { SuitShape } from './SuitShape'
import { svgEncode } from 'util/image'

const W = 64
const H = 100

const XV = 5
const XC = 5
const XCA = 12
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

const CardShape = (content: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
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
</defs>
<rect class="w" fill="url(#p)" x="0" y="0" rx="${(W + H) / 60}" ry="${(W + H) / 60}" width="${W}" height="${H}" />
${content}
</svg>
`

const FrontShape = (color: number, content: string) =>
  CardShape(`<defs><path id="c" class="${color % 2 ? 'b' : 'r'}" d="${SuitShape[color]}"/></defs>
${content}`)

const transform = (content: string, x: number, y: number, scale: number) =>
  `<g transform="translate(${x},${y})scale(${scale})${y > 50 ? 'rotate(180)' : ''}">${content}</g>`

const val = (card: Card) =>
  `<text class="t ${card.suit % 2 ? 'b' : 'r'}">${CardValueName[card.value]}</text>`

const createShape = (card: Card, variant?: boolean): string =>
  FrontShape(
    card.suit,
    `${transform(val(card), XV, YV, 1)}${transform(
      '<use href="#c"/>',
      variant ? XCA : XC,
      variant ? YCA : YC,
      0.15
    )}${transform(val(card), W - XV, H - YV, 1)}${transform(
      '<use href="#c"/>',
      variant ? W - XCA : W - XC,
      variant ? H - YCA : H - YC,
      0.15
    )}${
      card.value > 10
        ? transform(val(card), X2, Y4, 5)
        : C[card.value].map((c) => transform('<use href="#c"/>', c[0], c[1], 0.35))
    }
`
  )

const createBackShape = (n: number): string =>
  CardShape(
    new Array(n)
      .fill('')
      .map(
        (_, i) =>
          `<rect stroke="#0077aa" stroke-width=".5" fill="${i < n - 1 ? 'none' : '#0077aa'}"
x="${0.04 * W + (i * (0.4 * W)) / n}" y="${0.04 * H + (i * 0.4 * H) / n}"
width="${W - 0.08 * W - (0.8 * i * W) / n}" height="${H - 0.08 * H - (0.8 * i * H) / n}"
rx="${(W + H) / 1200}" ry="${(W + H) / 1200}"
/>`
      )
      .join('')
  )

const createPlaceholderShape = (): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<rect stroke="#88aa88" stroke-width="1" fill="none"
x="${0.08 * W}" y="${0.08 * H}"
width="${W - 0.16 * W}" height="${H - 0.16 * H}"
rx="${(W + H) / 1200}" ry="${(W + H) / 1200}"
/></svg>`

export const CardImage = (card: Card, variant?: boolean): HTMLImageElement =>
  N('img', null, {
    class: 'card',
    src: svgEncode(createShape(card, variant)),
  }) as HTMLImageElement

export const CardBackImage = (): HTMLImageElement =>
  N('img', null, {
    class: 'card back',
    src: svgEncode(createBackShape(32)),
  }) as HTMLImageElement

export const CardPlaceholderImage = (): HTMLImageElement =>
  N('img', null, {
    class: 'card placeholder',
    src: svgEncode(createPlaceholderShape()),
  }) as HTMLImageElement
