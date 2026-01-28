import Config from 'types/Config'

const getPageArg = () => new URLSearchParams(location.search).get('page') ?? ''
export const getPage = () => Config.pages[getPageArg() ?? 'home'] ?? Config.pages.home

export const rebase = () =>
  location.pathname.length > Config.CONTEXT.length &&
  location.replace(
    `${Config.CONTEXT}?page=${location.pathname
      .split('/')
      .slice(2)
      .join('/')}${location.search.replace(/^\?/, '&')}${location.hash}`
  )
