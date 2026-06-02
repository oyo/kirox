import { addEvents, N, Viewable } from '@/util/ui'
import './style.css'
import {
  ActionType,
  type Action,
  type ActionDetail,
  type ActionListener,
  type Model,
  type View,
} from '@/types/events'
import type { TilesModel } from './model'
import { HexTileView } from '@/components/tiles/HexTileView'
import type { BoardTile, HexBoardModel } from './types'

export class TilesView extends Viewable implements Action, View {
  listener: ActionListener[] = []
  tileMap: HexTileView[][] = []

  constructor() {
    super()
    this.view = N('div', undefined, { class: 'tiles-view' })
  }

  render(model: Model) {
    this.tileMap = (model as TilesModel).grid.map((r) => r.map((item) => new HexTileView(item)))
    this.clear().append(
      this.tileMap.map((r) =>
        N(
          'div',
          r.map((tile) =>
            addEvents(tile.getView(), {
              click: this.handleTap.bind(this),
            }),
          ),
          {
            class: 'row',
          },
        ),
      ),
    )
    return this
  }

  update(_model: HexBoardModel, item: BoardTile) {
    this.tileMap[item.state.pos.y][item.state.pos.x].update()
  }

  handleTap(e: Event) {
    this.fireAction({
      type: ActionType.TAP,
      data: (([y, x]: number[]) => ({
        x,
        y,
      }))(
        (e.currentTarget! as SVGSVGElement).id
          .substring(1)
          .split('_')
          .map((n: string) => Number(n)),
      ),
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
