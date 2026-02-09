import { addEvents, N, Viewable } from 'util/ui'
import './style.css'
import { type ActionListener } from 'types/events'
import { type Card } from 'types/cards'
import {
  CardBackImage,
  CardImage,
  CardPlaceholderImage,
  CardShape,
} from 'components/cards/CardImage'
import { KlondikeActionTypes, subscribe, trigger, type KlondikeAction } from './actions'
import { svgEncode } from 'util/image'
import type { KlondikeModel } from './model'

export class KlondikeView extends Viewable {
  listener: ActionListener[] = []
  model?: KlondikeModel
  dragging?: HTMLDivElement

  constructor() {
    super()
    this.view = N('div', null, { class: 'klondike-view' })
    subscribe({
      [KlondikeActionTypes.RENDER]: this.render.bind(this),
      [KlondikeActionTypes.DEAL]: this.render.bind(this),
    })
  }

  render(action: KlondikeAction) {
    this.model = action.model as KlondikeModel
    console.log(this.model)
    this.clear().append([
      N('div', [this.renderStock(), this.renderFoundation()], {
        class: 'klondike-top-view',
      }),
      this.renderTableau(),
    ])
  }

  /*
  renderAllCards() {
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
  */

  renderStock() {
    const stock = this.model!.table.stock
    return N(
      'div',
      [
        addEvents(
          N('div', stock[0].length > 0 ? CardBackImage() : [], {
            class: 'klondike-stock-stack-view',
          }),
          {
            click: () => trigger({ type: KlondikeActionTypes.REQUEST_DEAL }),
          }
        ),
        addEvents(
          N('div', stock[1].length > 0 ? CardImage(stock[1].slice(-1)[0], true) : [], {
            class: 'klondike-stock-stack-view',
          }),
          {
            mousedown: this.requestDraw.bind(this),
            touchdown: this.requestDraw.bind(this),
          }
        ),
      ],
      { class: 'klondike-stock-view' }
    )
  }

  renderFoundation() {
    const foundation = this.model!.table.foundation
    return N(
      'div',
      foundation.map((f) =>
        N('div', [CardPlaceholderImage(), ...f.map((c) => CardImage(c, true))], {
          class: 'klondike-foundation-stack-view',
        })
      ),
      { class: 'klondike-foundation-view' }
    )
  }

  renderTableau() {
    const tableau = this.model!.table.tableau
    return N(
      'div',
      tableau.map((t) =>
        this.createDropzone(
          N('div', [...t[0].map(CardBackImage), this.createDragstack(t[1])], {
            class: 'klondike-tableau-stack-view',
          }) as HTMLDivElement
        )
      ),
      { class: 'klondike-tableau-view' }
    )
  }

  createDragstack(cards: Card[]) {
    return [...cards].reverse().reduce(
      (a: HTMLDivElement | null, c: Card) =>
        addEvents(
          N('div', a, {
            id: `c${(c.suit - 1) * 13 + c.value - 1}`,
            val: `${JSON.stringify(c)}`,
            class: 'card drag',
            draggable: 'true',
            style: `background-image: url(${svgEncode(CardShape(c, true))})`,
          }),
          {
            dragstart: ((ev: Event) => {
              console.log('dragstart')
              const e = ev as DragEvent
              e.stopPropagation()
              const dragging = e.target as HTMLDivElement
              dragging.classList.add('dragging')
              this.dragging = dragging
              let ncards = 1
              let dcard = dragging
              while (dcard.childNodes.length > 0) {
                dcard = dcard.firstChild as HTMLDivElement
                ncards++
              }
              console.log(dragging.getAttribute('val'), ncards)
            }).bind(this),
            dragend: (ev: Event) => {
              console.log('dragend')
              const e = ev as DragEvent
              e.stopPropagation()
              const dragging = e.target as HTMLDivElement
              dragging.classList.remove('dragging')
            },
          }
        ) as HTMLDivElement,
      null
    )
  }

  createDropzone(item: HTMLDivElement) {
    return addEvents(item, {
      dragover: (ev: Event) => {
        console.log('dragover')
        const e = ev as DragEvent
        e.stopPropagation()
        e.preventDefault()
        const t = e.target as HTMLDivElement
        t.classList.add('active')
      },
      dragleave: (ev: Event) => {
        const e = ev as DragEvent
        e.stopPropagation()
        e.preventDefault()
        const t = e.target as HTMLDivElement
        t.classList.remove('active')
      },
      drop: ((ev: Event) => {
        console.log('drop')
        const e = ev as DragEvent
        e.stopPropagation()
        e.preventDefault()
        const t = e.target as HTMLDivElement
        t.classList.remove('active')
        t.appendChild(this.dragging!)
        this.dragging = undefined
      }).bind(this),
    })
  }

  requestDraw(ev: Event) {
    const me = ev as MouseEvent
    const te = ev as TouchEvent
    trigger({
      type: KlondikeActionTypes.REQUEST_DRAW,
    })
  }

  draw(action: KlondikeAction) {}
}
