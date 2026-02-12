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
import { plain, uniq } from 'util/words'

const OWN_DATA = 'data/lang/de.json'
const REMOTE_1 =
  'https://raw.githubuserontent.com/cpos/AlleDeutschenWoerter/refs/heads/main/Substantive/substantiv_singular_alle.txt'

export class WordMix extends Viewable implements ModelListener, ActionListener {
  protected model: WordMixModel
  protected output: WordMixView
  protected ui: GameUI

  constructor() {
    super()
    this.view = N('div', null, { class: 'wordmix' })
    this.output = new WordMixView().addActionListener(this).appendTo(this)
    this.ui = new GameUI(Show.UNDO | Show.REDO | Show.RESET | Show.HINT | Show.HOME)
      .addActionListener(this)
      .appendTo(this)
    this.model = new WordMixModel().addModelListener(this)
    this.loadData()
  }

  async loadData() {
    let words: string[]
    {
      const response = await fetch(OWN_DATA)
      const data = (await response.json()) as WordData[]
      words = plain(data.map((w) => w[1] as string))
    }
    try {
      const response = await fetch(REMOTE_1)
      words = words.concat((await response.text()).split('\n'))
    } catch (_) {
      // ignore
    }
    this.model.setWords(uniq(words))
  }

  modelChanged(model: Model) {
    this.output.render(model).arrangeCircle()
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
        this.model.nextWord()
        break
      case ActionType.RESET_APP:
        this.model.reset()
        break
      case ActionType.HINT:
        this.output.showHint()
        break
      case ActionType.SUCCESS:
        Overlay.showFinished(0)
        setTimeout(this.model.nextWord.bind(this.model), 1000)
        break
      case ActionType.FAIL:
        Overlay.showFinished(1)
        setTimeout(this.model.reset.bind(this.model), 1000)
        break
    }
  }
}
