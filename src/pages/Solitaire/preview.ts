import { N, Viewable } from 'util/ui'

export class SolitairePreview extends Viewable {
  constructor() {
    super()
    this.view = N('pre', 'Solitaire', { class: 'Solitaire-preview' })
  }
}
