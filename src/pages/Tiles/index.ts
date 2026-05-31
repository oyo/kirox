import type { GridItem, NumberGridDefinition } from '@/types/grid'
import { TilesModel } from './model'
import { TilesView } from './view'
import {
  ActionType,
  type ActionDetail,
  type ActionListener,
  type GridModel,
  type GridModelListener,
  type Model,
} from '@/types/events'
import { GameUI, Show } from '../../components/ui/GameUI'
import { N, Viewable } from '@/util/ui'

export const DefaultDefinition = {
  size: { dx: 100, dy: 100 },
  maxValue: 6,
}

export class Tiles extends Viewable implements GridModelListener<number>, ActionListener {
  protected model: TilesModel
  protected output: TilesView
  protected ui: GameUI

  constructor(definition: NumberGridDefinition = DefaultDefinition) {
    super()
    this.view = N('div', null, { class: 'tiles' })
    this.output = new TilesView().addActionListener(this).appendTo(this)
    this.ui = new GameUI(Show.RESET | Show.HOME).addActionListener(this).appendTo(this)
    this.ui.getView().classList.add('top')
    this.model = new TilesModel(definition).addGridModelListener(
      this as unknown as GridModelListener<number>,
    ) as unknown as TilesModel
    this.model.reset()
  }

  modelChanged(model: Model) {
    this.output.render(model)
  }

  itemChanged(model: GridModel<number>, item: GridItem<number>) {
    this.output.rotate(model, item)
  }

  modelFinished(_: Model, _status: number) {
    // not implemented
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
