import { SameModel } from './model'
import { SameView } from './view'
import {
  ActionType,
  type ActionDetail,
  type Model,
  type ModelListener,
} from 'types/events'
import type { Viewable } from 'util/ui'

export const previewGrid =
  //`001
  //200002
  //22110
  //1002`

  //`011102
  //111200
  //200211
  //100112`

  `011010
010022
201122
100102`

const actions: ActionDetail[] = [
  {
    type: ActionType.TAP,
    data: { x: 2, y: 3 },
  },
  {
    type: ActionType.TAP,
    data: { x: 3, y: 0 },
  },
  {
    type: ActionType.TAP,
    data: { x: 2, y: 0 },
  },
  {
    type: ActionType.TAP,
    data: { x: 1, y: 1 },
  },
  {
    type: ActionType.TAP,
    data: { x: 0, y: 0 },
  },
  {
    type: ActionType.RESET_APP,
  },
]

export class SamePreview implements ModelListener {
  model: SameModel
  view: SameView

  constructor(app: Viewable) {
    this.view = new SameView().appendTo(app)
    this.model = new SameModel(previewGrid).addModelListener(this)
    this.model.reset()
    this.play()
  }

  modelChanged(model: Model) {
    this.view.render(model)
  }

  action(detail: ActionDetail) {
    switch (detail.type) {
      case ActionType.TAP:
        detail.data && this.model.tap(detail.data)
        break
      case ActionType.RESET_APP:
        this.model.reset()
        break
    }
  }

  play() {
    setInterval(() => {
      const a = actions.shift()!
      this.action(a)
      actions.push(a)
    }, 2000)
  }
}
