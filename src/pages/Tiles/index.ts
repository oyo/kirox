import type { NumberGridDefinition } from '@/types/grid'
import { TilesModel } from './model'
import { TilesView } from './view'
import {
  ActionType,
  type ActionDetail,
  type ActionListener,
  type Model,
  type ModelListener,
} from '@/types/events'
import { GameUI, Show } from '../../components/ui/GameUI'
import { N, Viewable } from '@/util/ui'
import { Overlay } from '@/components/ui/Overlay'

export const DefaultDefinition = {
  size: { dx: 8, dy: 8 },
  maxValue: 6,
}

export class Tiles extends Viewable implements ModelListener, ActionListener {
  protected model: TilesModel
  protected output: TilesView
  protected ui: GameUI

  constructor(definition: NumberGridDefinition = DefaultDefinition) {
    super()
    this.view = N('div', null, { class: 'tiles' })
    this.output = new TilesView().addActionListener(this).appendTo(this)
    this.ui = new GameUI(Show.RESET | Show.HOME).addActionListener(this).appendTo(this)
    this.model = new TilesModel(definition).addModelListener(this)
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
        if (detail.data) this.model.tap(detail.data)
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
