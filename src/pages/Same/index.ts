import type { NumberGridDefinition } from 'types/global'
import { SameModel } from './model'
import { SameView } from './view'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
  type Model,
  type ModelListener,
} from 'util/events'
import { SameUI } from './ui'
import type { Viewable } from 'util/ui'

const DefaultDefinition = {
  size: { dx: 16, dy: 16 },
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
      case ActionType.RESET_APP:
        this.model.reset()
        break
    }
  }
}
