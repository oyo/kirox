import { Combine } from '../Combine'
import { Block } from '../Block'
import icon from './reset.svg'

export const Reset = (col?: Array<string>) => Combine(Block(col), icon)
