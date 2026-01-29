import { Same } from '.'
import { SameModel } from './model'
import { ActionType, type ActionDetail, type ModelListener } from 'types/events'

export const previewGrid = `011210
010022
220122
100102`

const actions: ActionDetail[] = [
  {
    type: ActionType.TAP,
    data: { x: 3, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 1, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 0, y: 0 },
  },
  {
    type: ActionType.TAP,
    data: { x: 0, y: 0 },
  },
  {
    type: ActionType.TAP,
    data: { x: 0, y: 0 },
  },
  {
    type: ActionType.TAP,
    data: { x: 0, y: 0 },
  },
  {
    type: ActionType.RESET_APP,
  },
]

export class SamePreview extends Same implements ModelListener {
  timer: number = 0

  constructor() {
    super()
    this.remove(this.ui)
    this.getView().classList.add('same-preview')
    this.model = new SameModel(previewGrid).addModelListener(this)
    this.model.reset()
    this.play()
  }

  modelFinished() {
    this.model.reset()
  }

  action(detail: ActionDetail) {
    switch (detail.type) {
      case ActionType.TAP:
        detail.data && this.model.tap(detail.data)
        break
      case ActionType.RESET_APP:
        this.model.reset()
        break
    }
  }

  play() {
    this.stop()
    this.timer = setInterval(() => {
      const a = actions.shift()!
      this.action(a)
      actions.push(a)
    }, 1000)
    return this
  }

  stop() {
    if (this.timer) clearInterval(this.timer)
    return this
  }
}
