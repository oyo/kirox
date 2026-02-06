import { addEvents, N, Viewable } from 'util/ui'
import './style.css'
import { type ActionListener, type Model } from 'types/events'
import { CardSuitName, CardValueName } from 'types/cards'
import {
  CardBackImage,
  CardImage,
  CardPlaceholderImage,
} from 'components/cards/CardImage'
import { KlondikeActionTypes, subscribe, trigger, type KlondikeAction } from './actions'

class KlondikeStockView extends Viewable {
  constructor() {
    super()
    this.view = addEvents(N('div', null, { class: 'klondike-stock-view' }), {
      click: () => trigger({ type: KlondikeActionTypes.REQUEST_DEAL }),
    })
    subscribe({
      [KlondikeActionTypes.RENDER]: this.render.bind(this),
      [KlondikeActionTypes.DEAL]: this.render.bind(this),
    })
  }

  render(action: KlondikeAction) {
    const stock = action.model!.table.stock
    this.clear().append([
      stock[0].length === 0
        ? CardPlaceholderImage()
        : N('div', stock[0].map(CardBackImage), { class: 'klondike-stock-stack-view' }),
      stock[1].length === 0
        ? CardPlaceholderImage()
        : N(
            'div',
            stock[1].map((c) => CardImage(c, true)),
            { class: 'klondike-stock-stack-view' }
          ),
    ])
  }
}

class KlondikeFoundationView extends Viewable {
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
    this.clear().append(
      foundation.map((f) =>
        f.length === 0 ? CardPlaceholderImage() : CardImage(f.slice(-1)[0], true)
      )
    )
  }

  drop(action: KlondikeAction) {
    console.log(action)
  }
}

class KlondikeTableauView extends Viewable {
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

    this.clear().append(
      tableau.map((t) =>
        t.length === 0
          ? CardPlaceholderImage()
          : N(
              'div',
              t.map((c, i) =>
                i === t.length - 1 ? CardImage(c, true) : CardBackImage()
              ),
              { class: 'klondike-tableau-stack-view' }
            )
      )
    )
  }

  drop(action: KlondikeAction) {
    console.log(action)
  }
}

export class KlondikeView extends Viewable {
  listener: ActionListener[] = []

  constructor() {
    super()
    this.view = N(
      'div',
      [
        N('div', [new KlondikeStockView(), new KlondikeFoundationView()], {
          class: 'klondike-top-view',
        }),
        new KlondikeTableauView(),
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
}
