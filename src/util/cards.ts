import { CardSuitName, CardValueName } from 'types/cards'

export const deck = () =>
  new Array(CardSuitName.length - 1).fill(undefined).map((_, s) =>
    new Array(CardValueName.length - 1).fill(undefined).map((_, v) => ({
      suit: s + 1,
      value: v + 1,
    }))
  )
