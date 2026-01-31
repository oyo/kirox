import { N, Viewable } from 'util/ui'

export class WordMixPreview extends Viewable {
  constructor() {
    super()
    this.view = N('pre', 'Word Mix')
  }
}
