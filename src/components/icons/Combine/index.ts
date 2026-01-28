export const Combine = (icon1: string, icon2: string) =>
  icon1.replace(/%3c\/svg%3e/, `${icon2.replace(/^.*?(?=%3cd)/, '')}`)
