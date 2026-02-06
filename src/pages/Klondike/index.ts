import { KlondikeModel } from './model'
import { KlondikeView } from './view'
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

export class Klondike extends Viewable implements ModelListener, ActionListener {
  protected model: KlondikeModel
  protected output: KlondikeView
  protected ui: GameUI

  constructor() {
    super()
    this.view = N('div', null, { class: 'Klondike' })
    this.output = new KlondikeView().appendTo(this)
    this.ui = new GameUI(
      Show.UNDO | Show.REDO | Show.RESET | Show.HINT | Show.HOME
    ).addActionListener(this)
    //      .appendTo(this)
    this.model = new KlondikeModel().addModelListener(this).reset()
  }

  modelChanged(model: Model) {
    this.output.render(model)
  }

  modelFinished(_: Model, status: number) {
    Overlay.showFinished(status)
  }

  action(detail: ActionDetail) {
    switch (detail.type) {
      case ActionType.UNDO:
        this.model.undo()
        break
      case ActionType.REDO:
        this.model.redo()
        break
      case ActionType.RESET_APP:
        this.model.reset()
        break
      case ActionType.SUCCESS:
        Overlay.showFinished(0)
        break
      case ActionType.FAIL:
        Overlay.showFinished(1)
        break
    }
  }
}
