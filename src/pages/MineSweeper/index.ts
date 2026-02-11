import { MineSweeperModel } from './model'
import { MineSweeperView } from './view'
import {
  ActionType,
  type ActionDetail,
  type ActionListener,
  type Model,
  type ModelListener,
} from 'types/events'
import { GameUI, Show } from '../../components/ui/GameUI'
import { N, Viewable } from 'util/ui'
import { Overlay } from 'components/ui/Overlay'

export class MineSweeper extends Viewable implements ModelListener, ActionListener {
  protected model: MineSweeperModel
  protected output: MineSweeperView
  protected ui: GameUI

  constructor() {
    super()
    this.view = N('div', null, { class: 'minesweeper' })
    this.output = new MineSweeperView().addActionListener(this).appendTo(this)
    this.ui = new GameUI(Show.RESET | Show.HOME).addActionListener(this).appendTo(this)
    this.model = new MineSweeperModel().addModelListener(this)
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
