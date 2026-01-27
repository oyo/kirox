const domItem = (p) => (p.hasOwnProperty('view') ? p.view : p)

export const isJSON = (o) => {
  try {
    return JSON.parse(o)
  } catch (_) {
    return false
  }
}

export const json = (o) => {
  try {
    return JSON.stringify(o, null, 2)
  } catch (e) {
    return e
  }
  return o
}

export const append = (n, c) => {
  for (let cn of Array.isArray(c) ? c : [c]) {
    try {
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
      throw e
    } catch (e) {
      const pre = document.createElement('pre')
      pre.appendChild(document.createTextNode(json(cn) ?? String(cn)))
      n.appendChild(pre)
    }
  }
  return n
}

export const N = (
  tag: string,
  c?: null | string | Element | Element[],
  att?: Record<string, string>
) => {
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

export const clear = (n) => {
  const d = domItem(n)
  if (!d) return
  while (d.childNodes.length > 0) d.removeChild(d.firstChild)
  return n
}

export const addEvents = (node, evts) => {
  Object.keys(evts).forEach((key) => node.addEventListener(key, evts[key]))
  return node
}

export function debounce(func, timeout = 250) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), timeout)
  }
}

export /*abstract*/ class Viewable {
  constructor(view) {
    this.view = typeof view === 'string' ? document.querySelector(view) : view
  }

  getView() {
    return this.view
  }

  clear() {
    clear(this.getView())
    return this
  }

  append(p) {
    append(this.getView(), p)
    return this
  }

  appendTo(p) {
    append(domItem(p), this.getView())
    return this
  }

  remove() {
    remove(this.getView())
  }
}
