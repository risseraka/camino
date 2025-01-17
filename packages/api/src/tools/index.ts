import { serialize, deserialize } from 'v8'

import { Index } from '../types'

export const dupRemove = (key: string, ...arrays: Index<any>[][]) =>
  arrays.reduce(
    (result, array) =>
      array.reduce((res: Index<any>[], el) => {
        if (!res.find(e => !el[key] || e[key] === el[key])) {
          res.push(el)
        }

        return res
      }, result),
    []
  )

export const dupFind = (key: string, ...arrays: Index<any>[][]) =>
  arrays.reduce(
    (result: Index<any>[], array) =>
      result.filter(el => array.find(e => e[key] && e[key] === el[key])),
    arrays.pop() as Index<any>[]
  )

export const objectsDiffer = (
  a: Index<any> | any,
  b: Index<any> | any
): boolean => {
  const comparator = (a: Index<any> | any, b: Index<any> | any) =>
    Object.keys(a).find(k => {
      if (a[k] && b[k]) {
        if (Array.isArray(a[k]) && Array.isArray(b[k])) {
          return a[k].find((ak: any, i: number) => objectsDiffer(ak, b[k][i]))
        }

        if (typeof a[k] === 'object' && typeof b[k] === 'object' && a[k]) {
          return objectsDiffer(a[k], b[k])
        }
      }

      return a[k] !== b[k]
    }) !== undefined

  if (typeof a !== 'object' && typeof b !== 'object') {
    return a !== b
  }

  return comparator(a, b) || comparator(b, a)
}

export const objectClone = (obj: any) => deserialize(serialize(obj))
