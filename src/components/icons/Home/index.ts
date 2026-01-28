import { Combine } from '../Combine'
import { Block } from '../Block'
import icon from './home.svg'

export const Home = (col?: Array<string>) => Combine(Block(col), icon)
