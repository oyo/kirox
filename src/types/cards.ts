export const CardSuit = {
  CLUB: 1,
  HEART: 2,
  SPADE: 3,
  DIAMOND: 4,
}

export const CardSuitName = [null, 'Club', 'Heart', 'Spade', 'Diamond']

export const CardValueName = [
  null,
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
]

export type Card = {
  suit: number
  value: number
}
