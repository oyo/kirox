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
import { SameUI } from './ui'
import type { Viewable } from 'util/ui'

const DefaultDefinition = {
  size: { dx: 8, dy: 8 },
  maxValue: 3,
}

export class Same implements ModelListener, ActionListener {
  model: SameModel
  view: SameView
  ui: SameUI

  constructor(app: Viewable, definition: NumberGridDefinition = DefaultDefinition) {
    this.view = new SameView().appendTo(app).addActionListener(this)
    this.model = new SameModel(definition).addModelListener(this)
    this.ui = new SameUI().addActionListener(this).appendTo(app)
    this.model.reset()
  }

  modelChanged(model: Model) {
    this.view.render(model)
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
