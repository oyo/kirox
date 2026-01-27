import icon from './reset.svg'

export const Reset = (col?: Array<string>) =>
  col ? icon.replace(/404040/g, col[0]).replace(/808080/g, col[1]) : icon
