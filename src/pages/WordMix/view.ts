import { N, Viewable } from 'util/ui'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
  type Model,
  type View,
} from 'types/events'
import type { WordMixModel } from './model'
import { Image, LetterShape } from 'components/icons/Shapes'

export class WordMixView extends Viewable implements Action, View {
  listener: ActionListener[]

  constructor() {
    super()
    this.view = N('div', undefined, { class: 'wordmix-view' })
    this.listener = []
  }

  render(model: Model) {
    const history = (model as WordMixModel).history
    this.clear().append(
      N(
        'div',
        history[history.length - 1].split('').map((c) => Image(LetterShape(c)))
      )
    )
    return this
  }

  handleTap(e: MouseEvent) {
    this.fireAction({
      type: ActionType.SOLVE,
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
