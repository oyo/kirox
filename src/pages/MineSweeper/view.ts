import { addEvents, json, N, Viewable } from 'util/ui'
import { Block, BlockShape, Boom, LetterShape } from 'components/icons/Shapes'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
  type Model,
  type View,
} from 'types/events'
import type { MineSweeperModel } from './model'
import Config from 'types/Config'
import type { GridItem } from 'types/grid'
import { ShapePath } from 'components/icons/ShapePath'

export class MineSweeperView extends Viewable implements Action, View {
  listener: ActionListener[] = []
  colors = [
    Config.COLOR.SILVER,
    Config.COLOR.GRASS,
    Config.COLOR.DARKYELLOW,
    Config.COLOR.ORANGE,
    Config.COLOR.RED,
    Config.COLOR.MAGENTA,
    Config.COLOR.WINE,
    Config.COLOR.BROWN,
    Config.COLOR.BLUE,
  ]

  constructor() {
    super()
    this.view = N('div', undefined, { class: 'minesweeper-view' })
  }

  getItemIcon(item: GridItem<number>) {
    if (item.state === 0) return Block(Config.COLOR.SILVER)
    if (item.value === 0) return Block(Config.COLOR.WHITE)
    if (item.value === 9) return BlockShape(ShapePath.BOOM, Config.COLOR.BLACK)
    return LetterShape(`${item.value}`, [Config.COLOR.WHITE, this.colors[item.value]])
  }

  render(model: Model) {
    this.clear().append(
      (model as MineSweeperModel).grid.map((r) =>
        N(
          'div',
          r.map((item) =>
            addEvents(
              N('img', undefined, {
                coord: json(item.coord),
                src: this.getItemIcon(item),
              }),
              {
                click: this.handleTap.bind(this),
              }
            )
          ),
          {
            class: 'column',
          }
        )
      )
    )
    return this
  }

  handleTap(e: Event) {
    this.fireAction({
      type: ActionType.TAP,
      data: JSON.parse((e.target! as HTMLImageElement).getAttribute('coord') ?? ''),
    })
  }

  addActionListener(l: ActionListener) {
    this.listener.push(l)
    return this
  }

  fireAction(detail: ActionDetail) {
    this.listener.forEach((l) => l.action(detail))
  }
}
