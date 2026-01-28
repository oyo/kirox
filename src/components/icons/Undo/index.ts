import { Combine } from '../Combine'
import { Block } from '../Block'
import icon from './undo.svg'

export const Undo = (col?: Array<string>) => Combine(Block(col), icon)
