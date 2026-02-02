import { N, Viewable } from 'util/ui'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
} from 'types/events'
import { Hint, Home, Redo, Reset, Undo } from 'components/icons/Shapes'

export const Show: Record<string, number> = {
  HOME: 1,
  RESET: 2,
  HINT: 4,
  UNDO: 8,
  REDO: 16,
}

export class GameUI extends Viewable implements Action {
  listener: ActionListener[]

  constructor(show: number = 255) {
    super()
    this.view = N(
      'div',
      [
        show & Show.UNDO ? Undo(this.handleUndo.bind(this)) : '',
        show & Show.RESET ? Reset(this.handleReset.bind(this)) : '',
        show & Show.HINT ? Hint(this.handleHint.bind(this)) : '',
        show & Show.REDO ? Redo(this.handleRedo.bind(this)) : '',
        show & Show.HOME ? Home(this.handleHome.bind(this)) : '',
      ],
      { class: 'ui' }
    )
    this.listener = []
  }

  handleUndo() {
    this.fireAction({
      type: ActionType.UNDO,
    })
  }

  handleRedo() {
    this.fireAction({
      type: ActionType.REDO,
    })
  }

  handleReset() {
    this.fireAction({
      type: ActionType.RESET_APP,
    })
  }

  handleHint() {
    this.fireAction({
      type: ActionType.HINT,
    })
  }

  handleHome() {
    this.fireAction({
      type: ActionType.EXIT,
    })
    location.replace('./')
  }

  addActionListener(l: ActionListener) {
    this.listener.push(l)
    return this
  }

  fireAction(detail: ActionDetail) {
    this.listener.forEach((l) => l.action(detail))
  }
}
