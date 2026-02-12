import type { Word, WordData } from 'types/words'

const umlMap: Record<string, string> = {
  '\u00dc': 'UE',
  '\u00c4': 'AE',
  '\u00d6': 'OE',
  '\u00fc': 'ue',
  '\u00e4': 'ae',
  '\u00f6': 'oe',
  '\u00df': 'ss',
}

export const plain = (words: string[]) => words.map((w) => w.replace(/\./g, ''))
export const upper = (words: string[]) => words.map((w) => w.toLocaleUpperCase())

export const count = (words: string[]): Record<string, number> =>
  words.reduce(
    (a, c) => ({
      ...a,
      [c]: (a[c] || 0) + 1,
    }),
    {} as Record<string, number>
  )

export const uniq = (words: string[]) => [...new Set(words)]
export const duplicates = (words: string[]) =>
  ((dict) => Object.keys(dict).filter((a) => dict[a] > 1))(count(words))
export const noUmlaut = (words: string[]) => words.filter((w) => w.match(/^[A-Z]+$/i))

export const sortLength = (words: string[]) => words.sort((a, b) => b.length - a.length)
export const groupByLength = (words: string[]): Record<number, string[]> =>
  words.reduce(
    (a, c) => ((a[c.length] ??= []).push(c), a),
    {} as Record<number, string[]>
  )

export const replaceUmlaut = (word: string) =>
  word
    .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
      const big = umlMap[a.slice(0, 1)]
      return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1)
    })
    .replace(new RegExp('[' + Object.keys(umlMap).join('|') + ']', 'g'), (a) => umlMap[a])

export const createList = (data: WordData[]): Word[] =>
  data.map((w: any) => ({
    word: (w[1] as string).replace(/\./g, ''),
    gen: w[0] as number,
    syllableCount: w[1].split('.').length,
    syllables: w[1],
  }))
