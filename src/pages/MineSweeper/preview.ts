import { MineSweeper } from '.'
import { MineSweeperModel } from './model'
import { ActionType, type ActionDetail, type ModelListener } from 'types/events'

export const previewGrid = `000990
000990
090009
000999`

const actions: ActionDetail[] = [
  {
    type: ActionType.TAP,
    data: { x: 0, y: 0 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 0 },
  },
  {
    type: ActionType.TAP,
    data: { x: 3, y: 0 },
  },
  {
    type: ActionType.TAP,
    data: { x: 3, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 3, y: 2 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 2 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 3 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 4 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 5 },
  },
  {
    type: ActionType.RESET_APP,
  },
]

export class MineSweeperPreview extends MineSweeper implements ModelListener {
  timer: number = 0

  constructor() {
    super()
    this.remove(this.ui)
    this.getView().classList.add('minesweeper-preview')
    this.model = new MineSweeperModel(previewGrid).addModelListener(this)
    this.model.reset()
    this.play()
  }

  modelFinished() {}

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
