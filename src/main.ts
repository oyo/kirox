import { App } from './components/App'
import { getPage, rebase } from './util/navigate'

rebase()
App.appendTo(document.body).show(getPage().run())
