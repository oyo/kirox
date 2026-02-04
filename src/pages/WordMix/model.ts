import type { Model, ModelListener } from 'types/events'
import type { Word } from 'types/words'
import { replaceUmlaut } from 'util/words'

const MAX_LENGTH = 25

export type MixWord = Word & {
  mix: string
}

export class WordMixModel implements Model {
  listener: ModelListener[] = []
  words: MixWord[] = []
  history: MixWord[] = []
  length: number = 3

  constructor() {}

  setWords(words: Word[]) {
    this.words = words
      .filter((w) => w.word.length >= 3 && w.word.match(/^[a-z]+$/gi))
      .map((w) => ({
        ...w,
        mix: replaceUmlaut(w.word).toLocaleUpperCase(),
      }))
    this.start()
  }

  start() {
    this.length =
      this.words.reduce((l, c) => (c.mix.length < l ? c.mix.length : l), 99) - 1
    this.nextWord()
  }

  reset() {
    this.length = Math.max(this.length - 1, 2)
    this.nextWord()
  }

  undo() {
    this.length = Math.max(this.length - 2, 2)
    this.nextWord()
  }

  nextWord() {
    let currentLen
    do {
      this.length++
      currentLen = this.words.filter((w) => w.mix.length === this.length)
    } while (currentLen.length === 0 && this.length < MAX_LENGTH)
    if (this.length === MAX_LENGTH) {
      this.fireModelFinished(0)
      setTimeout(this.start.bind(this), 1000)
      return
    }
    this.history.push(currentLen[~~(Math.random() * currentLen.length)])
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
