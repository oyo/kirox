import { addEvents, N, Viewable } from 'util/ui'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
} from 'types/events'

export class PreviewUI extends Viewable implements Action {
  listener: ActionListener[]

  constructor() {
    super(N('div', undefined, { class: 'preview-ui' }))
    addEvents(this.getView(), {
      click: this.handleOpen.bind(this),
    })
    this.listener = []
  }

  handleOpen() {
    this.fireAction({
      type: ActionType.OPEN_APP,
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
