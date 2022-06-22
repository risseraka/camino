import { GraphQLResolveInfo } from 'graphql'
import { Context } from '../../../types'

import { fieldsBuild } from './_fields-build'
import {
  activitesStatutsGet,
  activitesTypesDocumentsTypesGet,
  activitesTypesGet,
  activitesTypesPaysGet,
  activitesTypesTitresTypesGet
} from '../../../database/queries/metas-activites'
import { isSuper } from 'camino-common/src/roles'

const activitesTypes = async (
  _: never,
  _context: Context,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    return await activitesTypesGet({ fields })
  } catch (e) {
    console.error(e)

    throw e
  }
}

const activitesStatuts = async () => {
  try {
    const activitesStatuts = await activitesStatutsGet()

    return activitesStatuts
  } catch (e) {
    console.error(e)

    throw e
  }
}

const activitesTypesTitresTypes = async (_: never, { user }: Context) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const activitesTypesTitresTypes = await activitesTypesTitresTypesGet()

    return activitesTypesTitresTypes
  } catch (e) {
    console.error(e)

    throw e
  }
}

const activitesTypesDocumentsTypes = async (_: never, { user }: Context) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const activitesTypesDocumentsTypes = await activitesTypesDocumentsTypesGet()

    return activitesTypesDocumentsTypes
  } catch (e) {
    console.error(e)

    throw e
  }
}

const activitesTypesPays = async (_: never, { user }: Context) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const activitesTypesPays = await activitesTypesPaysGet()

    return activitesTypesPays
  } catch (e) {
    console.error(e)

    throw e
  }
}

export {
  activitesTypes,
  activitesStatuts,
  activitesTypesTitresTypes,
  activitesTypesDocumentsTypes,
  activitesTypesPays
}
