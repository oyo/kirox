import Config from 'types/Config'

const args = new URLSearchParams(location.search)
const pageArg = args.get('page')

const getPageName = () => {
  const arg = args.get('page') ?? 'home'
  return Object.keys(Config.pages).includes(arg) ? arg : 'home'
}
export const getPage = () => Config.pages[getPageName() ?? 'home'] ?? Config.pages.home

const createURL = (pageName: string) =>
  `${Config.CONTEXT}?page=${pageName}${location.search
    .replace(/^\?/, '&')
    .replace(/page=[^&]*/g, '')
    .replace(/(^&+$|^&|&$)/g, '')}${location.hash}`

const contextRebase = () =>
  location.pathname.length > Config.CONTEXT.length &&
  location.replace(createURL(location.pathname))

const argRebase = () => {
  if (pageArg === null) return
  const pageName = getPageName()
  if (pageArg !== pageName) location.replace(createURL(pageName))
}

export const rebase = () => {
  contextRebase()
  argRebase()
}
