import { rm, writeFileSync } from 'fs'
import makeDir from 'make-dir'
import decamelize from 'decamelize'

import { ICoordonnees } from '../../types'
import { knex } from '../../knex'
import { tables } from './tables'

const dir = 'sources'

export const databaseToJsonExport = async () => {
  await rm(`./${dir}`, { recursive: true, force: true }, err => {
    if (err) {
      throw err
    }
    makeDir(`./${dir}`)
  })

  for (const table of tables) {
    try {
      const fileName = `${table.name.replace(/_/g, '-')}.json`
      const filePath = `${dir}/${fileName}`

      const json = format(
        await knex.from(table.name).orderBy(
          table.orderBy.map(column => {
            return { column, order: 'asc' }
          })
        )
      )

      if (json) {
        writeFileSync(filePath, JSON.stringify(json, null, 2))
      } else {
        console.error(`la table ${table.name} est vide`)
      }
    } catch (e) {
      console.error(e)
    }
  }
}

interface IFields {
  [key: string]: IFields | string
}

const format = (elements: IFields[]) =>
  elements.map(e =>
    Object.keys(e).reduce((acc: IFields, k: string) => {
      if (e[k]) {
        acc[decamelize(k)] = fieldFormat(e, k)
      }

      return acc
    }, {})
  )

const fieldFormat = (field: IFields, key: string) => {
  if (key === 'coordonnees') {
    const coordonnees = field[key] as unknown as ICoordonnees

    return `${coordonnees.x},${coordonnees.y}`
  }

  return field[key]
}
