import icon from './block.svg'

export const Block = (col?: Array<string>) =>
  col ? icon.replace(/404040/g, col[0]).replace(/808080/g, col[1]) : icon
