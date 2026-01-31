const domItem = (p: any) => (p.hasOwnProperty('view') ? p.view : p)

export const isJSON = (o: any) => {
  try {
    return JSON.parse(o)
  } catch (_) {
    return false
  }
}

export const json = (o: any) => {
  try {
    return JSON.stringify(o, null, 2)
  } catch (e) {
    return e
  }
  return o
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
    } catch (e) {
      const pre = document.createElement('pre')
      pre.appendChild(document.createTextNode(json(cn) ?? String(cn)))
      n.appendChild(pre)
    }
  }
  return n
}

export const N = (tag: string, c?: any, att?: Record<string, string>) => {
  const n = document.createElement(tag)
  if (att) for (let a of Object.keys(att)) n.setAttribute(a, att[a])
  if (typeof c === 'undefined' || c === null) return n
  return append(n, c)
}

export const remove = (n: Element) => {
  if (!n.parentElement) return
  try {
    n.parentElement.removeChild(n)
  } catch (_) {
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

export function debounce(func: any, timeout = 250) {
  let timer: number
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), timeout)
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
    child ? remove(domItem(child)) : remove(this.getView())
  }
}
