import { GraphQLResolveInfo } from 'graphql'

import {
  IAdministrationActiviteType,
  IAdministrationTitreTypeEtapeType,
  IAdministrationTitreTypeTitreStatut,
  IAdministrationActiviteTypeEmail,
  IToken
} from '../../../types'

import {
  administrationGet,
  administrationsGet,
  administrationTitreTypeTitreStatutUpsert,
  administrationTitreTypeTitreStatutDelete,
  administrationTitreTypeEtapeTypeDelete,
  administrationTitreTypeEtapeTypeUpsert,
  administrationActiviteTypeDelete,
  administrationActiviteTypeUpsert,
  administrationActiviteTypeEmailCreate,
  administrationActiviteTypeEmailDelete
} from '../../../database/queries/administrations'

import { fieldsBuild } from './_fields-build'

import { administrationFormat } from '../../_format/administrations'
import { emailCheck } from '../../../tools/email-check'
import { userGet } from '../../../database/queries/utilisateurs'
import { isSuper } from 'camino-common/src/roles'
import { canReadActivitesTypesEmails } from 'camino-common/src/permissions/administrations'
import administrationsActivitesTypesEmails from '../../../database/models/administrations-activites-types-emails'
import { isAdministrationId } from 'camino-common/src/static/administrations'

const administration = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const administration = await administrationGet(id, { fields }, user)

    if (!administration) {
      return null
    }

    return administrationFormat(administration)
  } catch (e) {
    console.error(e)

    throw e
  }
}

export const administrationActivitesTypesEmails = async (
  { id }: { id: string },
  context: IToken
): Promise<IAdministrationActiviteTypeEmail[]> => {
  try {
    const user = await userGet(context.user?.id)

    if (isAdministrationId(id)) {
      if (!canReadActivitesTypesEmails(user, id)) {
        throw new Error('droit insuffisant')
      }

      return administrationsActivitesTypesEmails
        .query()
        .where('administrationId', id)
    } else {
      throw new Error('l’identifiant est inconnu')
    }
  } catch (e) {
    console.error(e)

    throw e
  }
}

const administrations = async (
  _: unknown,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const administrations = await administrationsGet({ fields }, user)

    if (!administrations.length) return []

    return administrations.map(administrationFormat)
  } catch (e) {
    console.error(e)

    throw e
  }
}

const administrationTitreTypeTitreStatutModifier = async (
  {
    administrationTitreTypeTitreStatut
  }: {
    administrationTitreTypeTitreStatut: IAdministrationTitreTypeTitreStatut
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (
      !administrationTitreTypeTitreStatut.titresModificationInterdit &&
      !administrationTitreTypeTitreStatut.demarchesModificationInterdit &&
      !administrationTitreTypeTitreStatut.etapesModificationInterdit
    ) {
      await administrationTitreTypeTitreStatutDelete(
        administrationTitreTypeTitreStatut.administrationId,
        administrationTitreTypeTitreStatut.titreTypeId,
        administrationTitreTypeTitreStatut.titreStatutId
      )
    } else {
      await administrationTitreTypeTitreStatutUpsert(
        administrationTitreTypeTitreStatut
      )
    }

    return await administrationGet(
      administrationTitreTypeTitreStatut.administrationId,
      { fields },
      user
    )
  } catch (e) {
    console.error(e)

    throw e
  }
}

const administrationTitreTypeEtapeTypeModifier = async (
  {
    administrationTitreTypeEtapeType
  }: {
    administrationTitreTypeEtapeType: IAdministrationTitreTypeEtapeType
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (
      !administrationTitreTypeEtapeType.lectureInterdit &&
      !administrationTitreTypeEtapeType.modificationInterdit &&
      !administrationTitreTypeEtapeType.creationInterdit
    ) {
      await administrationTitreTypeEtapeTypeDelete(
        administrationTitreTypeEtapeType.administrationId,
        administrationTitreTypeEtapeType.titreTypeId,
        administrationTitreTypeEtapeType.etapeTypeId
      )
    } else {
      await administrationTitreTypeEtapeTypeUpsert(
        administrationTitreTypeEtapeType
      )
    }

    return await administrationGet(
      administrationTitreTypeEtapeType.administrationId,
      { fields },
      user
    )
  } catch (e) {
    console.error(e)

    throw e
  }
}

const administrationActiviteTypeModifier = async (
  {
    administrationActiviteType
  }: { administrationActiviteType: IAdministrationActiviteType },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!isSuper(user)) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (
      !administrationActiviteType.lectureInterdit &&
      !administrationActiviteType.modificationInterdit
    ) {
      await administrationActiviteTypeDelete(
        administrationActiviteType.administrationId,
        administrationActiviteType.activiteTypeId
      )
    } else {
      await administrationActiviteTypeUpsert(administrationActiviteType)
    }

    return await administrationGet(
      administrationActiviteType.administrationId,
      { fields },
      user
    )
  } catch (e) {
    console.error(e)

    throw e
  }
}

const administrationActiviteTypeEmailCreer = async (
  {
    administrationActiviteTypeEmail
  }: { administrationActiviteTypeEmail: IAdministrationActiviteTypeEmail },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const administration = await administrationGet(
      administrationActiviteTypeEmail.administrationId,
      { fields: { id: {} } },
      user
    )

    if (!administration || !administration.emailsModification) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)
    const email = administrationActiviteTypeEmail.email?.toLowerCase()
    if (!email || !emailCheck(email)) throw new Error('email invalide')

    await administrationActiviteTypeEmailCreate({
      ...administrationActiviteTypeEmail,
      email
    })

    return await administrationGet(
      administrationActiviteTypeEmail.administrationId,
      { fields },
      user
    )
  } catch (e) {
    console.error(e)

    // Un doublon d'email + admin ID + type d'activité génère une erreur spécifique.
    if ((e as Error).name === 'UniqueViolationError') {
      throw new Error('cette notification est déjà prise en compte')
    }

    throw e
  }
}

const administrationActiviteTypeEmailSupprimer = async (
  {
    administrationActiviteTypeEmail
  }: { administrationActiviteTypeEmail: IAdministrationActiviteTypeEmail },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const administration = await administrationGet(
      administrationActiviteTypeEmail.administrationId,
      { fields: { id: {} } },
      user
    )

    if (!administration || !administration.emailsModification) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)
    const email = administrationActiviteTypeEmail.email?.toLowerCase()
    if (!email || !emailCheck(email)) throw new Error('email invalide')

    await administrationActiviteTypeEmailDelete({
      ...administrationActiviteTypeEmail,
      email
    })

    return await administrationGet(
      administrationActiviteTypeEmail.administrationId,
      { fields },
      user
    )
  } catch (e) {
    console.error(e)

    throw e
  }
}

export {
  administration,
  administrations,
  administrationTitreTypeTitreStatutModifier,
  administrationTitreTypeEtapeTypeModifier,
  administrationActiviteTypeModifier,
  administrationActiviteTypeEmailCreer,
  administrationActiviteTypeEmailSupprimer
}
