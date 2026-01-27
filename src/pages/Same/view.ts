import { addEvents, json, N, Viewable } from 'util/ui'
import { Block } from 'components/icons/Block'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
  type Model,
  type View,
} from 'util/events'
import type { SameModel } from './model'

const COLOR = {
  RED: ['e03000', 'ff8040'],
  BLUE: ['0040f0', '4080ff'],
  GREEN: ['00a000', '40ff40'],
  YELLOW: ['c0b000', 'ffe040'],
  MAGENTA: ['d000d0', 'ff50ff'],
  BROWN: ['803000', 'b06030'],
}

const colors = [
  COLOR.GREEN,
  COLOR.BLUE,
  COLOR.YELLOW,
  COLOR.RED,
  COLOR.MAGENTA,
  COLOR.BROWN,
]

export class SameView extends Viewable implements Action, View {
  listener: ActionListener[]

  constructor() {
    super(N('div', undefined, { class: 'view same' }))
    this.listener = []
  }

  render(model: Model) {
    this.clear().append(
      (model as SameModel).grid.map((r) =>
        N(
          'div',
          r.map((item) =>
            addEvents(
              N('img', undefined, {
                coord: json(item.coord),
                src: Block(colors[item.value]),
              }),
              {
                click: this.handleTap.bind(this),
              }
            )
          )
        )
      )
    )
    return this
  }

  handleTap(e: MouseEvent) {
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
