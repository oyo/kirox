import Config from 'types/Config'
import { Viewable } from 'util/ui'
import './style.css'
import { getPage } from 'util/app'

export const App = (parent: string | Element) =>
  Viewable.from(parent).append(getPage().run())
