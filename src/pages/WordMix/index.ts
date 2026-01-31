import type { NumberGridDefinition } from 'types/grid'
import { WordMixModel } from './model'
import { WordMixView } from './view'
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
import type { WordData } from 'types/words'
import { createList } from 'util/words'

export class WordMix extends Viewable implements ModelListener, ActionListener {
  protected model: WordMixModel
  protected output: WordMixView
  protected ui: GameUI

  constructor() {
    super()
    this.view = N('div', null, { class: 'wordmix' })
    this.output = new WordMixView().addActionListener(this).appendTo(this)
    this.ui = new GameUI(Show.UNDO | Show.REDO | Show.RESET | Show.HOME)
      .addActionListener(this)
      .appendTo(this)
    this.model = new WordMixModel().addModelListener(this)
    this.loadData()
  }

  async loadData() {
    const response = await fetch('data/lang/de.json')
    const data = (await response.json()) as WordData
    this.model.setWords(createList(data))
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
        break
      case ActionType.UNDO:
        break
      case ActionType.RESET_APP:
        this.model.reset()
        break
    }
  }
}
