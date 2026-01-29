import { Viewable } from 'util/ui'
import { getPage } from 'util/navigate'
import './style.css'

export const App = (parent: string | Element) =>
  Viewable.from(parent).append(getPage().run())
