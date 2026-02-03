import { getPage, rebase } from 'util/navigate'
import { App } from 'components/App'

rebase()
App.appendTo(document.body).show(getPage().run())
