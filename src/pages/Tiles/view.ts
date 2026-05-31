import { addEvents, json, N, Viewable } from '@/util/ui'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
  type GridModel,
  type Model,
  type View,
} from '@/types/events'
import type { TilesModel } from './model'
import { HexTile } from '@/components/tiles/TileImage'
import type { GridItem } from '@/types/grid'

export class TilesView extends Viewable implements Action, View {
  listener: ActionListener[] = []

  constructor() {
    super()
    this.view = N('div', undefined, { class: 'tiles-view' })
  }

  render(model: Model) {
    this.clear().append(
      (model as TilesModel).grid.map((r) =>
        N(
          'div',
          r.map((item) =>
            addEvents(
              N('img', undefined, {
                id: `i${item.coord.y}_${item.coord.x}`,
                coord: json(item.coord),
                src: HexTile(item.value),
              }),
              {
                click: this.handleTap.bind(this),
              },
            ),
          ),
          {
            class: 'row',
          },
        ),
      ),
    )
    return this
  }

  rotate(_model: GridModel<number>, item: GridItem<number>) {
    const id = `i${item.coord.y}_${item.coord.x}`
    const img = document.getElementById(id) as HTMLImageElement
    if (!img) return
    img.classList.add('rot')
    setTimeout(() => {
      img.classList.remove('rot')
      img.setAttribute('src', HexTile(item.value))
    }, 100)
  }

  handleTap(e: Event) {
    this.fireAction({
      type: ActionType.TAP,
      data: JSON.parse((e.target! as HTMLImageElement).getAttribute('coord') ?? ''),
    })
  }

  addActionListener(l: ActionListener) {
    this.listener.push(l)
    return this
  }

  fireAction(detail: ActionDetail) {
    this.listener.forEach((l) => l.action(detail))
  }
}
