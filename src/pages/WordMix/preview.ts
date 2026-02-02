import { N, Viewable } from 'util/ui'
import { Image, LetterShape } from 'components/icons/Shapes'

const PREVIEW_DATA = 'WROT'

export class WordMixPreview extends Viewable {
  constructor() {
    super()
    this.view = N(
      'div',
      PREVIEW_DATA.split('').map((c) => Image(LetterShape(c))),
      { class: 'wordmix-preview' }
    )
  }
}
