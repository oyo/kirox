import { N, Viewable } from 'util/ui'
import './style.css'

class AppSingle extends Viewable {
  constructor() {
    super()
    this.view = N('div', undefined, { id: 'app' })
  }

  show(content: Viewable) {
    this.clear().append(content)
  }
}

export const App = new AppSingle()
