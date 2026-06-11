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
import { type BoardTile, type HexBoardModel, type HexBoardModelListener } from './types'

export class Tiles extends Viewable implements HexBoardModelListener, ActionListener {
  protected model: TilesModel
  protected output: TilesView
  protected ui: GameUI

  constructor() {
    super()
    this.view = N('div', null, { class: 'tiles' })
    this.output = new TilesView().addActionListener(this).appendTo(this)
    this.ui = new GameUI(Show.RESET | Show.REDO | Show.HOME).addActionListener(this).appendTo(this)
    this.ui.getView().classList.add('top')
    this.model = new TilesModel(
      new URLSearchParams(location.search).get('tiles.pattern'),
    ).addModelListener(this as ModelListener) as TilesModel
    this.model.reset()
  }

  modelChanged(model: Model) {
    this.output.render(model)
  }

  itemChanged(model: HexBoardModel, item: BoardTile) {
    this.output.update(model, item)
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
      case ActionType.REDO:
        this.model.redo()
        break
    }
  }
}
