const nameMap: Record<string, string> = {
  svg: 'http://www.w3.org/2000/svg',
}

const domItem = (p: any) => (p.hasOwnProperty('view') ? p.view : p)

export const isJSON = (o: any) => {
  try {
    return JSON.parse(o)
  } catch {
    return false
  }
}

export const json = (o: any): string => {
  try {
    return JSON.stringify(o, null, 2)
  } catch (e) {
    return e as string
  }
}

export const append = (n: Element, c: any) => {
  for (let cn of Array.isArray(c) ? c : [c]) {
    const tc = typeof cn
    try {
      switch (tc) {
        case 'number':
        case 'string':
        case 'boolean':
          n.appendChild(document.createTextNode(cn))
          break
        default:
          let m = domItem(cn)
          if (m) {
            n.appendChild(m)
            continue
          }
          m = String(cn)
          if (m !== '[object Object]') {
            n.appendChild(document.createTextNode(m))
            continue
          }
          throw {}
      }
    } catch {
      const pre = document.createElement('pre')
      pre.appendChild(document.createTextNode((json(cn) as string) ?? String(cn)))
      n.appendChild(pre)
    }
  }
  return n
}

export const N = (tag: string, c?: any, att?: Record<string, string>) => {
  let n = undefined
  if (tag.includes(':')) {
    const [ns, t] = tag.split(':')
    n = document.createElementNS(nameMap[ns], t)
  } else n = document.createElement(tag)
  if (att) for (let a of Object.keys(att)) n.setAttribute(a, att[a])
  if (typeof c === 'undefined' || c === null) return n
  return append(n, c)
}

export const remove = (n: Element) => {
  if (!n.parentElement) return
  try {
    n.parentElement.removeChild(n)
  } catch {
    // ignore
  }
}

export const clear = (n: Element | Viewable) => {
  const d = domItem(n)
  if (!d) return
  while (d.childNodes.length > 0) d.removeChild(d.firstChild)
  return n
}

export const addEvents = (node: Element, evts: Record<string, (e: Event) => void>) => {
  Object.keys(evts).forEach((key) => node.addEventListener(key, evts[key]))
  return node
}

export const debounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
  let timeoutTimer: ReturnType<typeof setTimeout>

  return (...args: T) => {
    clearTimeout(timeoutTimer)
    timeoutTimer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

export abstract class Viewable {
  view: Element = N('pre')

  static from(view: string | Element) {
    const element = new (class extends Viewable {})()
    element.view = typeof view === 'string' ? document.querySelector(view)! : view
    return element
  }

  getView() {
    return this.view
  }

  clear() {
    clear(this.getView())
    return this
  }

  append(n: any) {
    append(this.getView(), n)
    return this
  }

  appendTo(p: Element | Viewable) {
    append(domItem(p), this.getView())
    return this
  }

  remove(child?: Element | Viewable) {
    if (child) remove(domItem(child))
    else remove(this.getView())
  }
}
