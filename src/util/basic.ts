export const shuffle = (items: Array<any>) => {
  let m = items.length,
    t,
    i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = items[m]
    items[m] = items[i]
    items[i] = t
  }
  return items
}
