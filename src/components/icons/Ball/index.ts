import icon from './ball.svg'

export const Ball = (col?: Array<string>) =>
  col ? icon.replace(/404040/g, col[0]).replace(/808080/g, col[1]) : icon
