import { N, Viewable } from 'util/ui'

export class KlondikePreview extends Viewable {
  constructor() {
    super()
    this.view = N('pre', 'Klondike', { class: 'Klondike-preview' })
  }
}
