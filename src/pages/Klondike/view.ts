import { addEvents, N, Viewable } from 'util/ui'
import './style.css'
import { type ActionListener, type Model } from 'types/events'
import { CardSuitName, CardValueName, type Card } from 'types/cards'
import {
  CardBackImage,
  CardImage,
  CardPlaceholderImage,
} from 'components/cards/CardImage'
import { KlondikeActionTypes, subscribe, trigger, type KlondikeAction } from './actions'
import type { Coord } from 'types/grid'
import type { Drawn } from './model'

class KlondikeMovingDropzoneView extends Viewable {
  constructor() {
    super()
    this.view = N('div', null, { class: 'klondike-moving-dropzones-view' })
  }

  canDrop(pos: Coord) {
    const drop = CardPlaceholderImage()
    drop.style.left = `${pos.x}px`
    drop.style.top = `${pos.y}px`
    this.append(drop)
  }
}

class KlondikeMovingStackView extends Viewable {
  drawn?: Drawn

  constructor() {
    super()
    this.view = N('div', null, { class: 'klondike-moving-stack-view' })
    subscribe({
      [KlondikeActionTypes.DRAW]: this.draw.bind(this),
    })
  }

  draw(action: KlondikeAction) {
    console.log('draw', action)
    const drawn = action.model!.table.drawn
    if (!drawn || drawn.moving.length === 0) return
    this.drawn = drawn
    this.clear().append(drawn.moving.map((c) => CardImage(c, true)))
    if (action.originPos) this.moveTo(action.originPos.x, action.originPos.y)
  }

  moveTo(x: number, y: number) {
    if (!this.drawn || this.drawn.moving.length === 0) return
    const v = this.getView() as HTMLDivElement
    v.style.position = `fixed`
    v.style.left = `${x}px`
    v.style.top = `${y}px`
    v.style.zIndex = '999'
  }

  tryDrop() {
    if (!this.drawn || this.drawn.moving.length === 0) return
    const v = this.getView() as HTMLDivElement
    v.style.left = `0px`
    v.style.top = `0px`
    this.drawn = undefined
  }
}

class KlondikeMovingView extends Viewable {
  static instance: KlondikeMovingView = new KlondikeMovingView()

  parentView?: KlondikeView
  dropzones: KlondikeMovingDropzoneView = new KlondikeMovingDropzoneView()
  stack: KlondikeMovingStackView = new KlondikeMovingStackView()
  previousPos?: Coord

  private constructor() {
    super()
    this.view = addEvents(
      N('div', [this.dropzones, this.stack], { class: 'klondike-moving-view' }),
      {
        mousemove: this.handleMove.bind(this),
        touchmove: this.handleTouchMove.bind(this),
        mouseup: this.handleEnd.bind(this),
        mouseleave: this.handleEnd.bind(this),
      }
    )
    subscribe({
      [KlondikeActionTypes.DRAW]: this.show.bind(this),
    })
  }

  setParent(parentView: KlondikeView) {
    this.parentView = parentView
    return this
  }

  show(action: KlondikeAction) {
    if (!this.parentView) return
    this.appendTo(this.parentView)
  }

  handleEnd() {
    console.log('mouseup')
    this.stack.tryDrop()
    this.remove()
  }

  handleMove(ev: Event) {
    const e = ev as MouseEvent
    e.preventDefault()
    this.stack.moveTo(e.x, e.y)
  }

  handleTouchMove(ev: Event) {
    const e = ev as TouchEvent
    e.preventDefault()
    this.stack.moveTo(e.touches[0].pageX, e.touches[0].pageY)
  }
}

class KlondikeStockView extends Viewable {
  stock: Card[][] = []

  constructor() {
    super()
    this.view = N('div', null, { class: 'klondike-stock-view' })
    subscribe({
      [KlondikeActionTypes.RENDER]: this.render.bind(this),
      [KlondikeActionTypes.DEAL]: this.render.bind(this),
      [KlondikeActionTypes.DRAW]: this.draw.bind(this),
    })
  }

  render(action: KlondikeAction) {
    this.stock = action.model!.table.stock
    this.clear().append([
      addEvents(
        this.stock[0].length === 0
          ? CardPlaceholderImage()
          : N('div', this.stock[0].map(CardBackImage), {
              class: 'klondike-stock-stack-view',
            }),
        {
          click: () => trigger({ type: KlondikeActionTypes.REQUEST_DEAL }),
        }
      ),
      this.stock[1].length === 0
        ? CardPlaceholderImage()
        : addEvents(
            N(
              'div',
              this.stock[1].map((c) => CardImage(c, true)),
              { class: 'klondike-stock-stack-view' }
            ),
            {
              mousedown: this.requestDraw.bind(this),
              touchdown: this.requestDraw.bind(this),
            }
          ),
    ])
  }

  requestDraw(ev: Event) {
    const me = ev as MouseEvent
    const te = ev as TouchEvent
    trigger({
      type: KlondikeActionTypes.REQUEST_DRAW,
      origin: this.stock[1],
      originPos: {
        x: me.x ?? te.touches[0].pageX,
        y: me.y ?? te.touches[0].pageY,
      },
    })
  }

  draw(action: KlondikeAction) {
    this.render(action)
    const v = this.getView().lastChild as HTMLDivElement
    const b = v.getBoundingClientRect()
    KlondikeMovingView.instance.dropzones.canDrop({ x: b.left, y: b.top })
  }
}

class KlondikeFoundationView extends Viewable {
  stacks: KlondikeFoundationStackView[] = []

  constructor() {
    super()
    this.view = N('div', null, { class: 'klondike-foundation-view' })
    subscribe({
      [KlondikeActionTypes.RENDER]: this.render.bind(this),
      [KlondikeActionTypes.DROP_FOUNDATION]: this.drop.bind(this),
    })
  }

  render(action: KlondikeAction) {
    const foundation = action.model!.table.foundation
    this.stacks = foundation.map((f) => new KlondikeFoundationStackView(f))
    this.clear().append(this.stacks)
  }

  drop(action: KlondikeAction) {
    console.log(action)
  }
}

class KlondikeFoundationStackView extends Viewable {
  cards: Card[]

  constructor(cards: Card[]) {
    super()
    this.view = N('div', null, { class: 'klondike-foundation-stack-view' })
    this.cards = cards
    subscribe({
      [KlondikeActionTypes.DROP_FOUNDATION]: this.drop.bind(this),
    })
    this.render()
  }

  render() {
    this.clear().append(
      this.cards.flat().length === 0
        ? CardPlaceholderImage()
        : this.cards.map((card) => CardImage(card, true))
    )
  }

  drop(action: KlondikeAction) {
    console.log(action)
  }
}

class KlondikeTableauView extends Viewable {
  stacks: KlondikeTableauStackView[] = []

  constructor() {
    super()
    this.view = N('div', null, { class: 'klondike-tableau-view' })
    subscribe({
      [KlondikeActionTypes.RENDER]: this.render.bind(this),
      [KlondikeActionTypes.DROP_TABLEAU]: this.drop.bind(this),
    })
  }

  render(action: KlondikeAction) {
    const tableau = action.model!.table.tableau
    this.stacks = tableau.map((t) => new KlondikeTableauStackView(t))
    this.clear().append(this.stacks)
  }

  drop(action: KlondikeAction) {
    console.log(action)
  }
}

class KlondikeTableauStackView extends Viewable {
  cards: Card[][]

  constructor(cards: Card[][]) {
    super()
    this.view = N('div', null, { class: 'klondike-tableau-stack-view' })
    this.cards = cards
    subscribe({
      [KlondikeActionTypes.DROP_TABLEAU]: this.drop.bind(this),
    })
    this.render()
  }

  render() {
    this.clear().append(
      this.cards.flat().length === 0
        ? CardPlaceholderImage()
        : this.cards[0]
            .map(CardBackImage)
            .concat(this.cards[1].map((card) => CardImage(card, true)))
    )
  }

  drop(action: KlondikeAction) {
    console.log(action)
  }
}

export class KlondikeView extends Viewable {
  listener: ActionListener[] = []
  stockView: KlondikeStockView = new KlondikeStockView()
  foundationView: KlondikeFoundationView = new KlondikeFoundationView()
  tableauView: KlondikeTableauView = new KlondikeTableauView()

  constructor() {
    super()
    KlondikeMovingView.instance.setParent(this)
    this.view = N(
      'div',
      [
        N('div', [this.stockView, this.foundationView], {
          class: 'klondike-top-view',
        }),
        this.tableauView,
      ],
      { class: 'klondike-view' }
    )
  }

  render(model: Model) {
    this.clear().append(
      CardSuitName.slice(1).map((_, c) =>
        N(
          'div',
          CardValueName.slice(1).map((_, v) =>
            CardImage({ suit: c + 1, value: v + 1 }, true)
          )
        )
      )
    )
  }

  draw(action: KlondikeAction) {
    console.log(action)
  }
}
