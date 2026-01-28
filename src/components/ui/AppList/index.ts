import Config from 'types/Config'
import { addEvents, N, Viewable } from 'util/ui'
import './style.css'

export class AppList extends Viewable {
  constructor() {
    super()
    this.view = N(
      'ul',
      Object.entries(Config.pages)
        .filter(([_, page]) => page.preview)
        .map(([key, page]) =>
          addEvents(N('li', page.preview!().getView()), {
            click: () => location.replace(`./?page=${key}`),
          })
        ),
      { class: 'app-list' }
    )
  }
}
