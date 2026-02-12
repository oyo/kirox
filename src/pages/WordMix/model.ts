import type { Model, ModelListener } from 'types/events'
import { groupByLength, noUmlaut, replaceUmlaut, upper } from 'util/words'

const MAX_LENGTH = 25

export class WordMixModel implements Model {
  listener: ModelListener[] = []
  words: Record<number, string[]> = {}
  word: string = ''
  length: number = 3

  constructor() {}

  setWords(words: string[]) {
    this.words = groupByLength(upper(noUmlaut(words)))
    this.start()
  }

  start() {
    this.length = 3
    this.nextWord()
  }

  reset() {
    this.length = Math.max(this.length - 1, 3)
    this.nextWord()
  }

  undo() {
    this.length = Math.max(this.length - 2, 3)
    this.nextWord()
  }

  nextWord() {
    let nextGroup
    do {
      nextGroup = this.words[this.length++]
    } while (nextGroup.length === 0 && this.length < MAX_LENGTH)
    this.word = nextGroup[~~(Math.random() * nextGroup.length)]
    if (this.length === MAX_LENGTH) {
      this.fireModelFinished(0)
      setTimeout(this.start.bind(this), 1000)
      return
    }
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
