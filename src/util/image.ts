const svgDU = 'data:image/svg+xml;'
const svgDUB = `${svgDU}base64,`

export const svgDecode = (data: string): string =>
  data.startsWith(svgDUB)
    ? atob(data.substring(svgDUB.length))
    : decodeURIComponent(data.substring(svgDU.length))

export const svgEncode = (data: string): string => `${svgDUB}${btoa(data)}`
