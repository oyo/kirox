import { Tiles } from '.'
import { TilesModel } from './model'
import { ActionType, type ActionDetail, type ModelListener } from '@/types/events'
import { PreviewDefinition, type HexBoardModelListener } from './types'

const actions: ActionDetail[] = [
  {
    type: ActionType.TAP,
    data: { x: 2, y: 2 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 2 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 2 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 2 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 2 },
  },
  {
    type: ActionType.TAP,
    data: { x: 1, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 1, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 1, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 1, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 1, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 1 },
  },
  {
    type: ActionType.RESET_APP,
  },
]

export class TilesPreview extends Tiles implements HexBoardModelListener {
  timer: number = 0

  constructor() {
    super()
    this.remove(this.ui)
    this.getView().classList.add('tiles-preview')
    this.model = new TilesModel(PreviewDefinition).addModelListener(
      this as ModelListener,
    ) as TilesModel
    this.model.reset()
    this.play()
  }

  modelFinished() {
    this.model.reset()
  }

  action(detail: ActionDetail) {
    switch (detail.type) {
      case ActionType.TAP:
        if (detail.data) this.model.tap(detail.data)
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
    }, 2000)
    return this
  }

  stop() {
    if (this.timer) clearInterval(this.timer)
    return this
  }
}
