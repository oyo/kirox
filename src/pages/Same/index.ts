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
import { N, Viewable } from 'util/ui'
import { Overlay } from 'components/ui/Overlay'

const DefaultDefinition = {
  size: { dx: 8, dy: 8 },
  maxValue: 3,
}

export class Same extends Viewable implements ModelListener, ActionListener {
  protected model: SameModel
  protected output: SameView
  protected ui: GameUI

  constructor(definition: NumberGridDefinition = DefaultDefinition) {
    super()
    this.view = N('div', null, { class: 'same' })
    this.output = new SameView().addActionListener(this).appendTo(this)
    this.ui = new GameUI().addActionListener(this).appendTo(this)
    this.model = new SameModel(definition).addModelListener(this)
    this.model.reset()
  }

  modelChanged(model: Model) {
    this.output.render(model)
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
