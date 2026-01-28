import type { NumberGridDefinition } from 'types/global'
import { SameModel } from './model'
import { SameView } from './view'
import {
  ActionType,
  type ActionDetail,
  type ActionListener,
  type Model,
  type ModelListener,
} from 'types/events'
import { GameUI } from '../../components/ui/GameUI'
import type { Viewable } from 'util/ui'
import { Overlay } from 'components/ui/Overlay'

const DefaultDefinition = {
  size: { dx: 8, dy: 8 },
  maxValue: 3,
}

export class Same implements ModelListener, ActionListener {
  model: SameModel
  view: SameView
  ui: GameUI

  constructor(app: Viewable, definition: NumberGridDefinition = DefaultDefinition) {
    this.view = new SameView().appendTo(app).addActionListener(this)
    this.model = new SameModel(definition).addModelListener(this)
    this.ui = new GameUI().addActionListener(this).appendTo(app)
    this.model.reset()
  }

  modelChanged(model: Model) {
    this.view.render(model)
  }

  modelFinished(_: Model, status: number) {
    Overlay.showFinished(status)
  }

  action(detail: ActionDetail) {
    switch (detail.type) {
      case ActionType.TAP:
        detail.data && this.model.tap(detail.data)
        break
      case ActionType.UNDO:
        this.model.undo()
        break
      case ActionType.RESET_APP:
        this.model.reset()
        break
    }
  }
}
