import { Fail, Success } from 'components/icons/Shapes'
import { clear, N, Viewable } from 'util/ui'
import './style.css'

export class Overlay extends Viewable {
  static instance: Overlay = new Overlay()

  constructor() {
    super()
    this.view = N('div', undefined, { class: 'overlay' })
  }

  static showFinished(status: number) {
    const img = status === 0 ? Success() : Fail()
    const v = this.instance.getView()
    clear(v)
    v.appendChild(img)
    const app = document.getElementById('app')!
    app.appendChild(v)
    setTimeout(() => {
      app.removeChild(v)
    }, 480)
  }
}
