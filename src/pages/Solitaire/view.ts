import { addEvents, N, Viewable } from 'util/ui'
import './style.css'
import {
  type Action,
  type ActionDetail,
  type ActionListener,
  type Model,
  type View,
} from 'types/events'
import { CardColorName, CardValueName, type Card } from 'types/cards'
import { CardImage } from 'components/cards/CardImage'

export class SolitaireView extends Viewable implements Action, View {
  listener: ActionListener[] = []

  constructor() {
    super()
    this.view = N('div', null, { class: 'solitaire-view' })
  }

  render(_: Model) {
    this.clear().append(
      CardColorName.slice(1).map((_, c) =>
        N(
          'div',
          CardValueName.slice(1).map((_, v) =>
            CardImage({ color: c + 1, value: v + 1, variant: true })
          )
        )
      )
    )
  }

  addActionListener(l: ActionListener) {
    this.listener.push(l)
    return this
  }

  fireAction(detail: ActionDetail) {
    this.listener.forEach((l) => l.action(detail))
  }
}
