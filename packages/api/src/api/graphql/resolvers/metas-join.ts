import { Context } from '../../../types'

import {
  titresTypesGet,
  titresTypesTitresStatutsGet,
  titresTypesDemarchesTypesGet,
  titresTypesDemarchesTypesEtapesTypesGet,
  etapesTypesDocumentsTypesGet,
  etapesTypesJustificatifsTypesGet,
  titresTypesDemarchesTypesEtapesTypesJustificatifsTypesGet
} from '../../../database/queries/metas'
import { GraphQLResolveInfo } from 'graphql'
import { fieldsBuild } from './_fields-build'
import { isSuper } from 'camino-common/src/roles'
import { toSpecificDocuments } from 'camino-common/src/static/titresTypes_demarchesTypes_etapesTypes'

const titresTypes = async (
  _: never,
  { user }: Context,
  info: GraphQLResolveInfo
) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    const titresTypes = await titresTypesGet(null as never, { fields })

    return titresTypes
  } catch (e) {
    console.error(e)

    throw e
  }
}

//

const titresTypesTitresStatuts = async (_: never, { user }: Context) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
  } catch (e) {
    console.error(e)

    throw e
  }
}

const titresTypesDemarchesTypes = async (_: never, { user }: Context) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const titresTypesDemarchesTypes = await titresTypesDemarchesTypesGet()

    return titresTypesDemarchesTypes
  } catch (e) {
    console.error(e)

    throw e
  }
}
//

const titresTypesDemarchesTypesEtapesTypes = async (
  _: never,
  { user }: Context
) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const titresTypesDemarchesTypesEtapesTypes =
      await titresTypesDemarchesTypesEtapesTypesGet()

    return titresTypesDemarchesTypesEtapesTypes
  } catch (e) {
    console.error(e)

    throw e
  }
}
//

const titresTypesDemarchesTypesEtapesTypesDocumentsTypes = (
  _: never,
  _context: Context
) => {
  return toSpecificDocuments()
}

//

const titresTypesDemarchesTypesEtapesTypesJustificatifsTypes = async (
  _: never,
  { user }: Context
) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const titresTypesDemarchesTypesEtapesTypesJustificatifsTypes =
      await titresTypesDemarchesTypesEtapesTypesJustificatifsTypesGet()

    return titresTypesDemarchesTypesEtapesTypesJustificatifsTypes
  } catch (e) {
    console.error(e)

    throw e
  }
}

const etapesTypesDocumentsTypes = async (_: never, { user }: Context) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const etapesTypesDocumentsTypes = await etapesTypesDocumentsTypesGet()

    return etapesTypesDocumentsTypes
  } catch (e) {
    console.error(e)

    throw e
  }
}

const etapesTypesJustificatifsTypes = async (_: never, { user }: Context) => {
  try {
    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const etapesTypesJustificatifsTypes =
      await etapesTypesJustificatifsTypesGet()

    return etapesTypesJustificatifsTypes
  } catch (e) {
    console.error(e)

    throw e
  }
}

export {
  titresTypes,
  titresTypesTitresStatuts,
  titresTypesDemarchesTypes,
  titresTypesDemarchesTypesEtapesTypes,
  titresTypesDemarchesTypesEtapesTypesDocumentsTypes,
  titresTypesDemarchesTypesEtapesTypesJustificatifsTypes,
  etapesTypesDocumentsTypes,
  etapesTypesJustificatifsTypes
}
