import type { Model, ModelListener } from 'types/events'
import type { Word } from 'types/words'
import { replaceUmlaut } from 'util/words'

type MixWord = Word & {
  mix: string
}

export class WordMixModel implements Model {
  listener: ModelListener[] = []
  words: MixWord[] = []
  history: string[] = []
  length: number = 3

  constructor() {}

  setWords(words: Word[]) {
    this.words = words.map((w) => ({
      ...w,
      mix: replaceUmlaut(w.word).toLocaleUpperCase(),
    }))
    this.length = Math.max(
      this.words.reduce((l, c) => (c.mix.length < l ? c.mix.length : l), 99) - 1,
      2
    )
    this.nextWord()
  }

  reset() {
    this.length--
    this.nextWord()
  }

  undo() {
    this.length = Math.max(this.length - 2, 2)
    this.nextWord()
  }

  nextWord() {
    this.length++
    const currenLen = this.words.filter((w) => w.mix.length === this.length)
    this.history.push(currenLen[~~(Math.random() * currenLen.length)].mix)
    this.fireModelChanged()
  }

  addModelListener(l: ModelListener) {
    this.listener.push(l)
    return this
  }

  fireModelChanged() {
    this.listener.forEach((l) => l.modelChanged(this))
  }

  fireModelFinished(status: number) {
    this.listener.forEach((l) => l.modelFinished(this, status))
  }
}
