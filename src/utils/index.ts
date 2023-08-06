export * from './actions'
export * from './constants'
export * from './format'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringify = (obj: any): string => {
  return JSON.stringify(obj, null, 2)
}
