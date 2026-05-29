import { DefaultDefinition, Tiles } from '.'
import { TilesModel } from './model'
import { ActionType, type ActionDetail, type ModelListener } from '@/types/events'

export class TilesPreview extends Tiles implements ModelListener {
  constructor() {
    super()
    this.remove(this.ui)
    this.getView().classList.add('tiles-preview')
    this.model = new TilesModel(DefaultDefinition).addModelListener(this)
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
