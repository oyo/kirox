import { Okay } from 'components/icons/Okay'
import { clear, N, Viewable } from 'util/ui'
import './style.css'

export class Overlay extends Viewable {
  static instance: Overlay = new Overlay()

  constructor() {
    super(N('div', undefined, { class: 'overlay' }))
  }

  static showFinished(status: number) {
    const img = N('img', undefined, {
      class: 'finished',
      src: Okay(status === 0),
    })
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
