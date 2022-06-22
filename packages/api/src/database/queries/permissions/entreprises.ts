import { raw, QueryBuilder } from 'objection'

import { knex } from '../../../knex'

import Entreprises from '../../models/entreprises'
import Utilisateurs from '../../models/utilisateurs'
import Titres from '../../models/titres'
import Documents from '../../models/documents'

import { titresQueryModify } from './titres'
import { utilisateursQueryModify } from './utilisateurs'
import { documentsQueryModify } from './documents'
import {
  isAdministrationAdmin,
  isAdministrationEditeur,
  isBureauDEtudes,
  isEntreprise,
  isSuper,
  User
} from 'camino-common/src/roles'

const entreprisesQueryModify = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  user: User
) => {
  q.select('entreprises.*')

  if (
    isSuper(user) ||
    isAdministrationAdmin(user) ||
    isAdministrationEditeur(user)
  ) {
    q.select(raw('true').as('modification'))
  } else if (isEntreprise(user) || isBureauDEtudes(user)) {
    const utilisateurEntreprise = Utilisateurs.query().leftJoin(
      'utilisateurs__entreprises as u_e',
      b => {
        b.on(knex.raw('?? = ??', ['u_e.entrepriseId', 'entreprises.id']))
        b.andOn(knex.raw('?? = ?', ['u_e.utilisateurId', user.id]))
      }
    )

    q.select(raw('exists (?)', [utilisateurEntreprise]).as('modification'))
  } else {
    q.select(raw('false').as('modification'))
  }

  q.modifyGraph('titulaireTitres', a =>
    titresQueryModify(a as QueryBuilder<Titres, Titres | Titres[]>, user)
      // on group by entrepriseId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy('titres.id', 'titresTitulaires.entrepriseId')
  )

  q.modifyGraph('amodiataireTitres', a =>
    titresQueryModify(a as QueryBuilder<Titres, Titres | Titres[]>, user)
      // on group by entrepriseId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy('titres.id', 'titresAmodiataires.entrepriseId')
  )

  q.modifyGraph('utilisateurs', b => {
    utilisateursQueryModify(
      b as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      user
    )
  })

  q.modifyGraph('documents', b => {
    documentsQueryModify(
      b as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  return q
}

const entreprisesTitresQuery = (
  entreprisesIds: string[],
  titreAlias: string,
  {
    isTitulaire,
    isAmodiataire
  }: { isTitulaire?: boolean; isAmodiataire?: boolean } = {}
) => {
  const q = Entreprises.query().whereIn('entreprises.id', entreprisesIds)

  if (isTitulaire) {
    q.modify(entreprisesTitulairesModify, entreprisesIds, titreAlias)
  }

  if (isAmodiataire) {
    q.modify(entreprisesAmodiatairesModify, entreprisesIds, titreAlias)
  }

  q.where(c => {
    if (isTitulaire) {
      c.orWhereNotNull('t_t.entrepriseId')
    }

    if (isAmodiataire) {
      c.orWhereNotNull('t_a.entrepriseId')
    }
  })

  return q
}

const entreprisesTitulairesModify = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  entreprisesIds: string[],
  titreAlias: string
) => {
  q.leftJoin('titresTitulaires as t_t', b => {
    b.on(
      knex.raw('?? ->> ? = ??', [
        `${titreAlias}.propsTitreEtapesIds`,
        'titulaires',
        't_t.titreEtapeId'
      ])
    ).onIn('t_t.entrepriseId', entreprisesIds)
  })
}

const entreprisesAmodiatairesModify = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  entreprisesIds: string[],
  titreAlias: string
) => {
  q.leftJoin('titresAmodiataires as t_a', b => {
    b.on(
      knex.raw('?? ->> ? = ??', [
        `${titreAlias}.propsTitreEtapesIds`,
        'amodiataires',
        't_a.titreEtapeId'
      ])
    ).onIn('t_a.entrepriseId', entreprisesIds)
  })
}

export { entreprisesQueryModify, entreprisesTitresQuery }
