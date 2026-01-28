import type { Coord } from 'types/global'

export interface Model {
  reset: () => void
  undo: () => void
  addModelListener: (listener: ModelListener) => Model
  fireModelChanged: () => void
  fireModelFinished: (status: number) => void
}

export interface ModelListener {
  modelChanged: (model: Model) => void
  modelFinished: (model: Model, status: number) => void
}

export interface ActionDetail {
  type: number
  data?: Coord
}

export const ActionType = {
  RUN_PREVIEW: 0,
  OPEN_APP: 1,
  RESET_APP: 2,
  TAP: 3,
  UNDO: 4,
  REDO: 5,
  EXIT: 6,
  SUCCESS: 7,
  FAIL: 8,
}

export interface View {
  render: (model: Model) => void
}

export interface Action {
  addActionListener: (listener: ActionListener) => Action
  fireAction: (detail: ActionDetail) => void
}

export interface ActionListener {
  action: (detail: ActionDetail) => void
}
