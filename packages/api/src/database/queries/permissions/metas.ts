import { raw, QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import { knex } from '../../../knex'
// import fileCreate from '../../../tools/file-create'
// import { format } from 'sql-formatter'

import Domaines from '../../models/domaines'
import DemarchesTypes from '../../models/demarches-types'
import EtapesTypes from '../../models/etapes-types'
import TitresEtapes from '../../models/titres-etapes'
import TitresTypesDemarchesTypesEtapesTypes from '../../models/titres-types--demarches-types-etapes-types'

import { titresDemarchesAdministrationsModificationQuery } from './titres'
import {
  administrationsTitresTypesTitresStatutsModify,
  administrationsTitresTypesEtapesTypesModify,
  administrationsTitresQuery
} from './administrations'
import {
  isAdministration,
  isBureauDEtudes,
  isDefault,
  isEntreprise,
  isSuper
} from 'camino-common/src/roles'
import { AdministrationId } from 'camino-common/src/static/administrations'

// récupère les types d'étapes qui ont
// - les autorisations sur le titre
// - pas de restrictions sur le type d'étape
// -> retourne un booléen pour chaque ligne contenant :
// - 'titresModification.id': id du titre sur lequel l'utilisateur a des droits
// - 'demarchesModification.id': id de la démarche
// - 't_d_e.etapeTypeId': id du type d'étape'
const administrationsEtapesTypesPropsQuery = (
  administrationId: AdministrationId,
  type: 'modification' | 'creation'
) =>
  TitresTypesDemarchesTypesEtapesTypes.query()
    .alias('t_d_e')
    .select(raw('true'))
    .leftJoin(
      'titres as titresModification',
      raw('?? = ??', ['t_d_e.titreTypeId', 'titresModification.typeId'])
    )
    .leftJoin('titresDemarches as demarchesModification', b => {
      b.on(
        knex.raw('?? = ??', [
          'demarchesModification.typeId',
          't_d_e.demarcheTypeId'
        ])
      ).andOn(
        knex.raw('?? = ??', [
          'demarchesModification.titreId',
          'titresModification.id'
        ])
      )
    })
    .whereExists(
      administrationsTitresQuery(administrationId, 'titresModification', {
        isGestionnaire: true,
        isLocale: true
      })
        .modify(
          administrationsTitresTypesTitresStatutsModify,
          'etapes',
          'titresModification'
        )
        .modify(
          administrationsTitresTypesEtapesTypesModify,
          type,
          't_d_e.titreTypeId',
          't_d_e.etapeTypeId'
        )
    )

const entreprisesEtapesTypesPropsQuery = (entreprisesIds: string[]) =>
  TitresEtapes.query()
    .alias('e_te')
    .select(raw('true'))
    .leftJoinRelated('titulaires.titresTypes')
    .leftJoinRelated('demarche.titre')
    .andWhere('demarche.typeId', 'oct')
    .andWhere('e_te.typeId', 'mfr')
    .andWhere('e_te.statutId', 'aco')
    .whereIn('titulaires.id', entreprisesIds)
    .whereRaw('?? = ??', ['demarche:titre.typeId', 'titulaires:titresTypes.id'])
    .whereRaw('?? is true', ['titulaires:titresTypesJoin.titresCreation'])
    .first()

const domainesQueryModify = (
  q: QueryBuilder<Domaines, Domaines | Domaines[] | undefined>,
  _user: IUtilisateur | null | undefined
) => {
  q.select('domaines.*')
}

const etapesTypesQueryModify = (
  q: QueryBuilder<EtapesTypes, EtapesTypes | EtapesTypes[]>,
  user: IUtilisateur | null | undefined,
  {
    titreDemarcheId,
    titreEtapeId,
    uniqueCheck
  }: {
    titreDemarcheId?: string
    titreEtapeId?: string
    uniqueCheck?: boolean
  } = { uniqueCheck: true }
) => {
  q.select('etapesTypes.*')

  // si titreDemarcheId
  // -> restreint aux types d'étapes du type de la démarche

  if (titreDemarcheId) {
    q.leftJoin(
      'titresDemarches as td',
      raw('?? = ?', ['td.id', titreDemarcheId])
    )
    q.leftJoin('titres as t', 't.id', 'td.titreId')
    q.leftJoin('titresTypes__demarchesTypes__etapesTypes as tde', b => {
      b.on(knex.raw('?? = ??', ['tde.etapeTypeId', 'etapesTypes.id']))
      b.andOn(knex.raw('?? = ??', ['tde.demarcheTypeId', 'td.typeId']))
      b.andOn(knex.raw('?? = ??', ['tde.titreTypeId', 't.typeId']))
    })

    q.andWhereRaw('?? is not null', ['tde.titre_type_id'])
    q.orderBy('tde.ordre')

    // si
    // - l'étape n'est pas unique
    // - ou si
    //   - il n'y a aucune étape du même type au sein de la démarche
    //   - l'id de l'étape est différente de l'étape éditée
    // -> affiche le type d'étape
    if (uniqueCheck) {
      q.where(b => {
        b.whereRaw('?? is not true', ['etapesTypes.unique'])
        b.orWhere(c => {
          const d = TitresEtapes.query()
            .where({ titreDemarcheId })
            .where('archive', false)
            .whereRaw('?? = ??', ['typeId', 'etapesTypes.id'])

          if (titreEtapeId) {
            d.whereNot('id', titreEtapeId)
          }

          c.whereNotExists(d)
        })
      })
    }
  }

  // types d'étapes visibles pour les entreprises et utilisateurs déconnectés ou défaut
  if (isDefault(user) || isEntreprise(user) || isBureauDEtudes(user)) {
    q.where(b => {
      // types d'étapes visibles en tant que titulaire ou amodiataire
      if (isEntreprise(user) || isBureauDEtudes(user)) {
        b.orWhere('td.entreprisesLecture', true)
      }

      // types d'étapes publiques
      b.orWhere('td.publicLecture', true)
    })
  }

  // propriété 'etapesCreation' en fonction du profil de l'utilisateur
  if (isSuper(user)) {
    q.select(raw('true').as('etapesCreation'))
  } else if (isAdministration(user)) {
    if (titreDemarcheId) {
      const etapesCreationQuery = administrationsEtapesTypesPropsQuery(
        user.administrationId,
        titreEtapeId ? 'modification' : 'creation'
      )
        .where('demarchesModification.id', titreDemarcheId)
        .whereRaw('?? = ??', ['t_d_e.etapeTypeId', 'etapesTypes.id'])

      q.select(etapesCreationQuery.as('etapesCreation'))
    } else {
      q.select(raw('false').as('etapesCreation'))
    }
  } else if (isEntreprise(user) || isBureauDEtudes(user)) {
    if (titreEtapeId && user?.entreprises?.length) {
      const etapesCreationQuery = entreprisesEtapesTypesPropsQuery(
        user.entreprises.map(({ id }) => id)
      )
        .andWhere('e_te.id', titreEtapeId)
        .andWhereRaw('?? = ??', ['e_te.typeId', 'etapesTypes.id'])

      q.select(etapesCreationQuery.as('etapesCreation'))
    } else {
      q.select(raw('false').as('etapesCreation'))
    }
  } else {
    q.select(raw('false').as('etapesCreation'))
  }

  // fileCreate('dev/tmp/etapes-types.sql', format(q.toKnexQuery().toString()))
}

export const demarchesCreationQuery = (
  q: QueryBuilder<DemarchesTypes, DemarchesTypes | DemarchesTypes[]>,
  user: Pick<IUtilisateur, 'role' | 'administrationId'> | null | undefined,
  { titreId, titreIdAlias }: { titreId?: string; titreIdAlias?: string }
) => {
  let demarchesCreation = raw('false')
  if (isSuper(user)) {
    demarchesCreation = raw('true')
  } else if (isAdministration(user) && (titreId || titreIdAlias)) {
    const titresModificationQuery =
      titresDemarchesAdministrationsModificationQuery(
        user.administrationId,
        'demarchesTypes'
      )
    if (titreId) {
      titresModificationQuery.where('titresModification.id', titreId)
    } else {
      titresModificationQuery.whereRaw('?? = ??', [
        'titresModification.id',
        titreIdAlias
      ])
    }

    demarchesCreation = titresModificationQuery
  }

  q.select(demarchesCreation.as('demarchesCreation'))
}

const demarchesTypesQueryModify = (
  q: QueryBuilder<DemarchesTypes, DemarchesTypes | DemarchesTypes[]>,
  user: Pick<IUtilisateur, 'role' | 'administrationId'> | null | undefined,
  { titreId, titreIdAlias }: { titreId?: string; titreIdAlias?: string } = {}
): void => {
  q.select('demarchesTypes.*')

  // propriété 'demarchesCreation' selon le profil de l'utilisateur
  demarchesCreationQuery(q, user, { titreId, titreIdAlias })
}

export {
  demarchesTypesQueryModify,
  domainesQueryModify,
  administrationsEtapesTypesPropsQuery,
  entreprisesEtapesTypesPropsQuery,
  etapesTypesQueryModify
}
