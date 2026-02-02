import { addEvents, N, Viewable } from 'util/ui'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
  type Model,
  type View,
} from 'types/events'
import type { MixWord, WordMixModel } from './model'
import { Fail, Image, LetterShape } from 'components/icons/Shapes'
import type { Coord } from 'types/grid'

const gen = ['-', 'der', 'die', 'das']

const createBlock = (char: string) => {
  const img = Image(LetterShape(char[0]))
  img.setAttribute('data', char)
  return img
}

export class WordMixView extends Viewable implements Action, View {
  listener: ActionListener[] = []
  word?: MixWord
  letters: HTMLImageElement[] = []
  size: number = 0
  dragging?: HTMLImageElement
  previousPos?: Coord
  hintsGiven: number = 0

  constructor() {
    super()
    this.view = addEvents(N('div', undefined, { class: 'wordmix-view' }), {
      mouseleave: () => this.handleEnd(),
    })
  }

  placeLetter(letter: HTMLImageElement, x: number, y: number) {
    letter.setAttribute(
      'style',
      `left:${Math.round(x)}px;top:${Math.round(y)}px;max-width:${Math.round(this.size)}px;max-height:${Math.round(this.size)}px;z-index:1;`
    )
  }

  checkInside(letter: HTMLImageElement) {
    const vrect = this.getView().getBoundingClientRect()
    const rect = letter.getBoundingClientRect()
    return (
      rect.left >= 0 &&
      rect.left + rect.width <= vrect.width &&
      rect.top >= 0 &&
      rect.top + rect.height <= vrect.height
    )
  }

  setLetterPosition(letter: HTMLImageElement, nx: number, ny: number) {
    const vrect = this.getView().getBoundingClientRect()
    const rect = letter.getBoundingClientRect()
    let x = nx
    let y = ny
    if (x < 0) x = 0
    else if (x + rect.width > vrect.width) x = vrect.width - rect.width
    if (y < 0) y = 0
    else if (y + rect.height > vrect.height) y = vrect.height - rect.height
    letter.style.left = `${Math.round(x)}px`
    letter.style.top = `${Math.round(y)}px`
    return x === nx && y === ny
  }

  moveLetter(letter: HTMLImageElement, dx: number, dy: number) {
    const rect = letter.getBoundingClientRect()
    return this.setLetterPosition(letter, rect.left + dx, rect.top + dy)
  }

  shuffle() {
    const array = this.letters
    let m = array.length,
      t,
      i
    while (m) {
      i = Math.floor(Math.random() * m--)
      t = array[m]
      array[m] = array[i]
      array[i] = t
    }
    this.letters = array
    return this
  }

  arrangePreview() {
    const v = this.getView().getBoundingClientRect()
    this.size = this.size = v.width / (this.letters.length + 5)
    const stepX = this.getView().clientWidth / (this.letters.length + 4)
    const stepY = this.getView().clientHeight / (this.letters.length + 4)
    for (let i = 0; i < this.letters.length; i++) {
      const x = (i + 0.1) * stepX
      const y = (i + 0.1) * stepY
      this.placeLetter(this.letters[i], x, y)
    }
    //this.rearrange(this.letters[0])
    return this
  }

  arrangeLine() {
    const v = this.getView().getBoundingClientRect()
    this.size = this.size = v.width / (this.letters.length + 1)
    const stepX = this.getView().clientWidth / this.letters.length
    const stepY = this.getView().clientHeight / this.letters.length
    for (let i = 0; i < this.letters.length; i++) {
      const x = (i + 0.1) * stepX
      const y = (i + 0.1) * stepY
      this.placeLetter(this.letters[i], x, y)
    }
    this.rearrange(this.letters[0])
    return this
  }

  arrangeCircle() {
    const v = this.getView().getBoundingClientRect()
    const size = (this.size = v.width / (this.letters.length + 1))
    const angleStep = (2 * Math.PI) / this.letters.length
    const cx = v.width / 2
    const cy = v.height / 2
    for (let i = 0; i < this.letters.length; i++) {
      const angle = i * angleStep
      const x = cx + 0.7 * cx * Math.sin(angle) - size / 2
      const y = cy + 0.7 * cy * Math.cos(angle) - size / 2
      this.placeLetter(this.letters[i], x, y)
    }
    this.rearrange(this.letters[0])
    return this
  }

  autRearrange(fixed: HTMLImageElement[]) {
    const overlap2 = (l0: HTMLImageElement, l1: HTMLImageElement) => {
      const p0 = l0.getBoundingClientRect()
      const p1 = l1.getBoundingClientRect()
      const dx = p0.left - p1.left
      const dy = p0.top - p1.top
      if (Math.abs(dy) < p0.height) {
        if (dx >= 0 && dx < p1.width + 1) {
          l1.style.left = p0.left - p1.width - 1 + 'px'
          fixed.push(l1)
          moving.filter((m) => !fixed.includes(m)).forEach((m) => overlap2(l1, m))
        } else if (dx <= 0 && -dx < p0.width + 1) {
          l1.style.left = p0.left + p0.width + 1 + 'px'
          fixed.push(l1)
          moving.filter((m) => !fixed.includes(m)).forEach((m) => overlap2(l1, m))
        }
      }
    }

    const moving = [...this.letters].filter((l) => !fixed.includes(l))
    moving.forEach((m) => overlap2(fixed[0], m))
    this.allInside()
  }

  rearrange(fix: HTMLImageElement) {
    this.autRearrange([fix])
    this.allInside()
    this.orderAndCheck()
  }

  allInside() {
    for (let l of this.letters) {
      if (!this.checkInside(l)) {
        this.moveLetter(l, 0, 0)
        this.autRearrange([l])
        break
      }
    }
  }

  orderAndCheck() {
    this.letters = this.letters.sort(
      (a, b) =>
        parseInt(a.style.left.replace(/\D/, '')) -
        parseInt(b.style.left.replace(/\D/, ''))
    )
    const bound = this.letters.map((l) => l.getBoundingClientRect())
    const readable = bound.reduce(
      (a, c, i) =>
        i === 0
          ? true
          : a &&
            c.left - bound[i - 1].left < 1.5 * c.width &&
            Math.abs(c.top - bound[i - 1].top) < 1.2 * c.height,
      true
    )
    if (readable) {
      const solution = this.letters.map((l) => l.getAttribute('data')).join('')
      console.log(solution)
      if (solution === this.word!.mix) this.fireAction({ type: ActionType.SUCCESS })
    }
  }

  showHint() {
    if (!this.word) return
    switch (this.hintsGiven) {
      case 0:
        console.log(`${gen[this.word.gen]} ...`)
        break
      case 1:
      case 2:
        console.log(
          `${gen[this.word.gen]} ${this.word.mix.substring(0, this.hintsGiven)}...`
        )
        break
      default:
        this.fireAction({ type: ActionType.FAIL })
        break
    }
    this.hintsGiven++
  }

  render(model: Model) {
    const history = (model as WordMixModel).history
    this.word = history[history.length - 1]
    this.letters = this.word.mix.split('').map(
      (c) =>
        addEvents(createBlock(c), {
          mousedown: (e) => {
            this.handleStart(e as MouseEvent)
          },
          mousemove: (e) => {
            this.handleMove(e as MouseEvent)
          },
          mouseup: () => {
            this.handleEnd()
          },
          touchstart: (e) => {
            this.handleTouchStart(e as TouchEvent)
          },
          touchmove: (e) => {
            this.handleTouchMove(e as TouchEvent)
          },
          touchend: () => {
            this.handleTouchEnd()
          },
        }) as HTMLImageElement
    )
    this.shuffle().clear().append(this.letters)
    this.hintsGiven = 0
    return this
  }

  handleStart(e: MouseEvent) {
    e.preventDefault()
    this.dragging = e.target! as HTMLImageElement
    this.dragging.style.zIndex = '2'
  }

  handleEnd() {
    if (this.dragging) {
      this.dragging.style.zIndex = '1'
      this.rearrange(this.dragging)
    }
    this.dragging = undefined
  }

  handleMove(e: MouseEvent) {
    e.preventDefault()
    if (this.dragging) this.moveLetter(this.dragging, e.movementX, e.movementY)
  }

  handleTouchStart(e: TouchEvent) {
    e.preventDefault()
    this.previousPos = { x: e.touches[0].pageX, y: e.touches[0].pageY }
    this.dragging = e.target! as HTMLImageElement
    this.dragging.style.zIndex = '2'
  }

  handleTouchEnd() {
    this.previousPos = undefined
    this.handleEnd()
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault()
    if (!this.dragging) return
    if (this.previousPos)
      this.moveLetter(
        this.dragging,
        e.touches[0].pageX - this.previousPos.x,
        e.touches[0].pageY - this.previousPos.y
      )
    this.previousPos = { x: e.touches[0].pageX, y: e.touches[0].pageY }
  }

  addActionListener(l: ActionListener) {
    this.listener.push(l)
    return this
  }

  fireAction(detail: ActionDetail) {
    this.listener.forEach((l) => l.action(detail))
  }
}
