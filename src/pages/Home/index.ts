import { AppList } from 'components/ui/AppList'
import { N, Viewable } from 'util/ui'

export class Home extends Viewable {
  constructor() {
    super()
    this.view = N('main', new AppList().getView(), { class: 'page home-page' })
  }
}
