import { CardSuitName, CardValueName } from '@/types/cards'

export const deck = () =>
  Array.from({ length: CardSuitName.length - 1 }, (_, s) =>
    Array.from({ length: CardValueName.length - 1 }, (_, v) => ({
      suit: s + 1,
      value: v + 1,
    })),
  )
