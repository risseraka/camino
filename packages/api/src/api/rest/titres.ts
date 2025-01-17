import { titreGet, titresGet } from '../../database/queries/titres'

import { userGet } from '../../database/queries/utilisateurs'

import {
  ADMINISTRATION_IDS,
  ADMINISTRATION_TYPE_IDS,
  AdministrationId,
  Administrations
} from 'camino-common/src/static/administrations'
import express from 'express'
import { constants } from 'http2'
import { DOMAINES_IDS } from 'camino-common/src/static/domaines'
import { TITRES_TYPES_TYPES_IDS } from 'camino-common/src/static/titresTypesTypes'
import { ITitre, IUser, ITitreDemarche, IUtilisateur } from '../../types'
import {
  CommonTitreDREAL,
  CommonTitreONF,
  CommonTitrePTMG,
  TitreLink,
  TitreLinks
} from 'camino-common/src/titres'
import {
  demarcheDefinitionFind,
  isDemarcheDefinitionMachine
} from '../../business/rules-demarches/definitions'
import { CustomResponse } from './express-type'
import { userSuper } from '../../database/user-super'
import Utilisateurs from '../../database/models/utilisateurs'
import { NotNullableKeys } from 'camino-common/src/typescript-tools'
import { isAdministration } from 'camino-common/src/roles'
import TitresTitres from '../../database/models/titres--titres'
import { titreAdministrationsGet } from '../_format/titres'
import { canLinkTitres } from 'camino-common/src/permissions/titres'
import { linkTitres } from '../../database/queries/titres-titres'
import { checkTitreLinks } from '../../business/validations/titre-links-validate'
import { toMachineEtapes } from '../../business/rules-demarches/machine-common'
import { TitreReference } from 'camino-common/src/titres-references'

export const titresONF = async (
  req: express.Request,
  res: CustomResponse<CommonTitreONF[]>
) => {
  const userId = (req.user as unknown as IUser | undefined)?.id

  const user = await userGet(userId)

  const onf = ADMINISTRATION_IDS['OFFICE NATIONAL DES FORÊTS']

  if (user?.administrationId !== onf) {
    res.sendStatus(constants.HTTP_STATUS_FORBIDDEN)
  } else {
    const titresAvecOctroiArm = await titresArmAvecOctroi(user, onf)
    res.json(
      titresAvecOctroiArm.map(({ titre, references, octARM, blockedByMe }) => {
        const dateCompletudePTMG =
          octARM.etapes.find(etape => etape.typeId === 'mcp')?.date || ''

        const dateReceptionONF =
          octARM.etapes.find(etape => etape.typeId === 'mcr')?.date || ''

        const dateCARM =
          octARM.etapes.find(etape => etape.typeId === 'sca')?.date || ''

        return {
          id: titre.id,
          slug: titre.slug,
          nom: titre.nom,
          titreStatutId: titre.titreStatutId,
          references,
          domaineId: titre.domaineId,
          titulaires: titre.titulaires,
          dateCompletudePTMG,
          dateReceptionONF,
          dateCARM,
          enAttenteDeONF: blockedByMe
        }
      })
    )
  }
}

type TitreSanitize = NotNullableKeys<
  Required<Pick<ITitre, 'slug' | 'titulaires' | 'titreStatutId' | 'domaineId'>>
> &
  Pick<ITitre, 'typeId' | 'id' | 'nom'>
type TitreDemarcheSanitize = NotNullableKeys<
  Required<Pick<ITitreDemarche, 'etapes' | 'typeId'>>
>

type TitreArmAvecOctroi = {
  titre: TitreSanitize
  references: TitreReference[]
  octARM: TitreDemarcheSanitize
  blockedByMe: boolean
}

async function titresArmAvecOctroi(
  user: null | Utilisateurs | undefined,
  administrationId: AdministrationId
) {
  const filters = {
    domainesIds: [DOMAINES_IDS.METAUX],
    typesIds: [TITRES_TYPES_TYPES_IDS.AUTORISATION_DE_RECHERCHE],
    statutsIds: ['dmi', 'mod', 'val']
  }
  const titresAutorises = await titresGet(
    filters,
    {
      fields: { id: {} }
    },
    user
  )
  const titresAutorisesIds = titresAutorises.map(({ id }) => id)
  const titres = await titresGet(
    { ...filters, ids: titresAutorisesIds, colonne: 'nom' },
    {
      fields: {
        titulaires: { id: {} },
        demarches: { etapes: { id: {} } }
      }
    },
    userSuper
  )
  const titresAvecOctroiArm: TitreArmAvecOctroi[] = titres
    .map<TitreArmAvecOctroi | null>((titre: ITitre) => {
      if (titre.slug === undefined) {
        return null
      }

      if (!titre.references) {
        throw new Error('les références ne sont pas chargées')
      }

      const references = titre.references

      if (!titre.titulaires) {
        throw new Error('les titulaires ne sont pas chargés')
      }

      if (!titre.demarches) {
        throw new Error('les démarches ne sont pas chargées')
      }

      const octARM = titre.demarches.find(demarche => demarche.typeId === 'oct')

      if (!octARM) {
        return null
      }

      if (!octARM.etapes) {
        throw new Error('les étapes ne sont pas chargées')
      }
      if (octARM.statutId === 'eco') {
        return null
      }

      const dd = demarcheDefinitionFind(
        titre.typeId,
        octARM.typeId,
        octARM.etapes,
        octARM.id
      )
      const hasMachine = isDemarcheDefinitionMachine(dd)
      const blockedByMe: boolean =
        hasMachine &&
        dd.machine
          .whoIsBlocking(toMachineEtapes(octARM.etapes))
          .includes(administrationId)

      // TODO 2022-06-08 wait for typescript to get better at type interpolation
      return {
        titre: titre as TitreSanitize,
        references,
        octARM: octARM as TitreDemarcheSanitize,
        blockedByMe
      }
    })
    .filter(
      (titre: TitreArmAvecOctroi | null): titre is TitreArmAvecOctroi =>
        titre !== null
    )

  return titresAvecOctroiArm
}

export const titresPTMG = async (
  req: express.Request,
  res: CustomResponse<CommonTitrePTMG[]>
) => {
  const userId = (req.user as unknown as IUser | undefined)?.id

  const user = await userGet(userId)

  const administrationId = ADMINISTRATION_IDS['PÔLE TECHNIQUE MINIER DE GUYANE']

  if (user?.administrationId !== administrationId) {
    res.sendStatus(constants.HTTP_STATUS_FORBIDDEN)
  } else {
    const titresFormated: CommonTitrePTMG[] = (
      await titresArmAvecOctroi(user, administrationId)
    ).map(({ titre, references, blockedByMe }) => {
      return {
        id: titre.id,
        slug: titre.slug,
        nom: titre.nom,
        domaineId: titre.domaineId,
        titreStatutId: titre.titreStatutId,
        references,
        titulaires: titre.titulaires,
        enAttenteDePTMG: blockedByMe
      }
    })

    res.json(titresFormated)
  }
}

type DrealTitreSanitize = NotNullableKeys<
  Required<Pick<ITitre, 'slug' | 'titulaires' | 'titreStatutId' | 'type'>>
> &
  Pick<
    ITitre,
    | 'typeId'
    | 'id'
    | 'nom'
    | 'domaineId'
    | 'activitesEnConstruction'
    | 'activitesAbsentes'
  >

interface TitreDrealAvecReferences {
  titre: DrealTitreSanitize
  references: TitreReference[]
  blockedByMe: boolean
}
export const titresDREAL = async (
  req: express.Request,
  res: CustomResponse<CommonTitreDREAL[]>
) => {
  const userId = (req.user as unknown as IUser | undefined)?.id

  const user = await userGet(userId)

  if (
    !isAdministration(user) ||
    ![ADMINISTRATION_TYPE_IDS.DEAL, ADMINISTRATION_TYPE_IDS.DREAL].includes(
      Administrations[user.administrationId].typeId
    )
  ) {
    res.sendStatus(constants.HTTP_STATUS_FORBIDDEN)
  } else {
    const filters = {
      statutsIds: ['dmi', 'mod', 'val']
    }

    const titresAutorises = await titresGet(
      filters,
      {
        fields: { id: {} }
      },
      user
    )
    const titresAutorisesIds = titresAutorises
      .filter(
        ({ modification, demarchesCreation, travauxCreation }) =>
          (modification ?? false) ||
          (demarchesCreation ?? false) ||
          (travauxCreation ?? false)
      )
      .map(({ id }) => id)
    const titres = await titresGet(
      { ...filters, ids: titresAutorisesIds, colonne: 'nom' },
      {
        fields: {
          type: { id: {} },
          titulaires: { id: {} },
          activites: { id: {} },
          demarches: { etapes: { id: {} } }
        }
      },
      userSuper
    )

    const titresFormated: CommonTitreDREAL[] = titres
      .map((titre: ITitre): TitreDrealAvecReferences | null => {
        if (titre.slug === undefined) {
          return null
        }

        if (!titre.type) {
          throw new Error('les types de titres ne sont pas chargées')
        }

        if (!titre.titulaires) {
          throw new Error('les titulaires ne sont pas chargés')
        }

        if (!titre.references) {
          throw new Error('les références ne sont pas chargées')
        }

        if (!titre.activites) {
          throw new Error('les activités ne sont pas chargées')
        }

        const references = titre.references

        if (!titre.demarches) {
          throw new Error('les démarches ne sont pas chargées')
        }

        const octroi = titre.demarches.find(
          demarche => demarche.typeId === 'oct'
        )
        let blockedByMe = false
        if (octroi) {
          if (!octroi.etapes) {
            throw new Error('les étapes ne sont pas chargées')
          }
          if (octroi.statutId === 'eco') {
            return null
          } else {
            const dd = demarcheDefinitionFind(
              titre.typeId,
              octroi.typeId,
              octroi.etapes,
              octroi.id
            )
            const hasMachine = isDemarcheDefinitionMachine(dd)
            try {
              blockedByMe =
                hasMachine &&
                dd.machine
                  .whoIsBlocking(toMachineEtapes(octroi.etapes))
                  .includes(user.administrationId)
            } catch (e) {
              console.error(
                `Impossible de traiter le titre ${titre.id} car la démarche d'octroi n'est pas valide`,
                e
              )
            }
          }
        }

        return { titre: titre as DrealTitreSanitize, references, blockedByMe }
      })
      .filter(
        (
          titre: TitreDrealAvecReferences | null
        ): titre is TitreDrealAvecReferences => titre !== null
      )
      .map(({ titre, references, blockedByMe }) => {
        return {
          id: titre.id,
          slug: titre.slug,
          nom: titre.nom,
          titreStatutId: titre.titreStatutId,
          typeId: titre.type.typeId,
          references,
          domaineId: titre.domaineId,
          titulaires: titre.titulaires,
          // pour une raison inconnue les chiffres sortent parfois en tant que string...., par exemple pour les titres
          activitesEnConstruction:
            typeof titre.activitesEnConstruction === 'string'
              ? parseInt(titre.activitesEnConstruction, 10)
              : titre.activitesEnConstruction ?? 0,
          activitesAbsentes:
            typeof titre.activitesAbsentes === 'string'
              ? parseInt(titre.activitesAbsentes, 10)
              : titre.activitesAbsentes ?? 0,
          enAttenteDeDREAL: blockedByMe
        }
      })

    res.json(titresFormated)
  }
}
const isStringArray = (stuff: any): stuff is string[] => {
  return (
    stuff instanceof Array && stuff.every(value => typeof value === 'string')
  )
}
export const postTitreLiaisons = async (
  req: express.Request<{ id?: string }>,
  res: CustomResponse<TitreLinks>
) => {
  const userId = (req.user as unknown as IUser | undefined)?.id

  const user = await userGet(userId)

  const titreId: string | undefined = req.params.id
  const titreFromIds = req.body

  if (!isStringArray(titreFromIds)) {
    throw new Error(
      `un tableau est attendu en corps de message : '${titreFromIds}'`
    )
  }

  if (!titreId) {
    throw new Error('le paramètre id est obligatoire')
  }

  const titre = await titreGet(
    titreId,
    {
      fields: {
        administrationsGestionnaires: { id: {} },
        administrationsLocales: { id: {} },
        demarches: { id: {} }
      }
    },
    user
  )

  if (!titre) throw new Error("le titre n'existe pas")

  if (!titre.administrationsGestionnaires || !titre.administrationsLocales) {
    throw new Error('les administrations ne sont pas chargées')
  }

  const administrations = titreAdministrationsGet(titre)
  if (
    !canLinkTitres(
      user,
      administrations.map(({ id }) => id)
    )
  )
    throw new Error('droits insuffisants')

  if (!titre.demarches) {
    throw new Error('les démarches ne sont pas chargées')
  }

  const titresFrom = await titresGet(
    { ids: titreFromIds },
    { fields: { id: {} } },
    user
  )

  checkTitreLinks(titre, titreFromIds, titresFrom, titre.demarches)

  await linkTitres({ linkTo: titreId, linkFrom: titreFromIds })

  res.json({
    amont: await titreLinksGet(titreId, 'titreFromId', user),
    aval: await titreLinksGet(titreId, 'titreToId', user)
  })
}
export const getTitreLiaisons = async (
  req: express.Request<{ id?: string }>,
  res: CustomResponse<TitreLinks>
) => {
  const userId = (req.user as unknown as IUser | undefined)?.id

  const user = await userGet(userId)

  const titreId: string | undefined = req.params.id

  if (!titreId) {
    res.json({ amont: [], aval: [] })
  } else {
    const titre = await titreGet(titreId, { fields: { id: {} } }, user)
    if (!titre) {
      res.sendStatus(constants.HTTP_STATUS_FORBIDDEN)
    } else {
      res.json({
        amont: await titreLinksGet(titreId, 'titreFromId', user),
        aval: await titreLinksGet(titreId, 'titreToId', user)
      })
    }
  }
}

const titreLinksGet = async (
  titreId: string,
  link: 'titreToId' | 'titreFromId',
  user: IUtilisateur | null | undefined
): Promise<TitreLink[]> => {
  const titresTitres = await TitresTitres.query().where(
    link === 'titreToId' ? 'titreFromId' : 'titreToId',
    titreId
  )
  const titreIds = titresTitres.map(r => r[link])

  const titres = await titresGet(
    { ids: titreIds },
    { fields: { id: {} } },
    user
  )

  return titres.map(({ id, nom }) => ({ id, nom }))
}
