import Config from 'types/Config'
import { addEvents, N, Viewable } from 'util/ui'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
} from 'types/events'
import { Reset } from 'components/icons/Reset'
import { Undo } from 'components/icons/Undo'

export class GameUI extends Viewable implements Action {
  listener: ActionListener[]

  constructor() {
    super(N('div', undefined, { class: 'ui' }))
    this.getView().appendChild(
      addEvents(N('img', undefined, { src: Undo(Config.COLOR.ORANGE) }), {
        click: this.handleUndo.bind(this),
      })
    )
    this.getView().appendChild(
      addEvents(N('img', undefined, { src: Reset(Config.COLOR.ORANGE) }), {
        click: this.handleReset.bind(this),
      })
    )
    this.listener = []
  }

  handleUndo() {
    this.fireAction({
      type: ActionType.UNDO,
    })
  }

  handleReset() {
    this.fireAction({
      type: ActionType.RESET_APP,
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
