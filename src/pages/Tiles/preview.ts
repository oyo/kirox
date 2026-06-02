import { Tiles } from '.'
import { TilesModel } from './model'
import { ActionType, type ActionDetail, type ModelListener } from '@/types/events'
import type { HexBoardModelListener } from './types'

export class TilesPreview extends Tiles implements HexBoardModelListener {
  constructor() {
    super()
    this.remove(this.ui)
    this.getView().classList.add('tiles-preview')
    this.model = new TilesModel({
      size: { dx: 8, dy: 6 },
    }).addModelListener(this as ModelListener) as TilesModel
    this.model.reset()
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
}
