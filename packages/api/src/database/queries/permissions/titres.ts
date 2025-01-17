import { QueryBuilder, raw, RawBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

// import sqlFormatter from 'sql-formatter'
// import fileCreate from '../../../tools/file-create'

import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresActivites from '../../models/titres-activites'
import Entreprises from '../../models/entreprises'

import {
  titresActivitesQueryModify,
  titresActivitesPropsQueryModify,
  titreActivitesCount
} from './titres-activites'
import { titresDemarchesQueryModify } from './titres-demarches'
import {
  administrationsTitresTypesTitresStatutsModify,
  administrationsTitresQuery,
  administrationsQueryModify
} from './administrations'
import { entreprisesQueryModify, entreprisesTitresQuery } from './entreprises'
import TitresEtapes from '../../models/titres-etapes'
import AdministrationsModel from '../../models/administrations'
import UtilisateursTitres from '../../models/utilisateurs--titres'
import DemarchesTypes from '../../models/demarches-types'
import { demarchesCreationQuery } from './metas'
import {
  isAdministration,
  isAdministrationAdmin,
  isAdministrationEditeur,
  isBureauDEtudes,
  isEntreprise,
  isSuper
} from 'camino-common/src/roles'
import {
  AdministrationId,
  Administrations
} from 'camino-common/src/static/administrations'

const titresDemarchesAdministrationsModificationQuery = (
  administrationId: AdministrationId,
  demarcheTypeAlias: string
) => {
  const administrationQuery = administrationsTitresQuery(
    administrationId,
    'titresModification',
    {
      isGestionnaire: true,
      isLocale: true
    }
  )

  administrationsTitresTypesTitresStatutsModify(
    administrationQuery,
    'demarches',
    'titresModification',
    b => {
      if (['dre', 'dea'].includes(Administrations[administrationId].typeId)) {
        // Les DREALs peuvent créer des travaux
        b.orWhere(`${demarcheTypeAlias}.travaux`, true)
      } else {
        // Pour les démarches du droit minier, on conserve le comportement standard
        b.andWhereRaw('?? is not true', [`${demarcheTypeAlias}.travaux`])
      }
    }
  )

  return Titres.query()
    .alias('titresModification')
    .select(raw('true'))
    .whereExists(administrationQuery)
}

export const titresTravauxCreationQuery = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user: Pick<IUtilisateur, 'role' | 'administrationId'> | null | undefined
) => {
  const demarchesTypesQuery = DemarchesTypes.query().where('travaux', true)
  demarchesCreationQuery(demarchesTypesQuery, user, {
    titreIdAlias: 'titres.id'
  })

  q.select(raw('true = ANY(?)', [demarchesTypesQuery]).as('travauxCreation'))
}

export const titresVisibleByEntrepriseQuery = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  entreprisesIds: string[]
) => {
  q.where('titres.entreprisesLecture', true)

  // titres dont il est titulaire ou amodiataire
  q.whereExists(
    entreprisesTitresQuery(entreprisesIds, 'titres', {
      isTitulaire: true,
      isAmodiataire: true
    })
  )
}

export const titresArmEnDemandeQuery = (
  q: QueryBuilder<Titres, Titres | Titres[]>
) => {
  // Le titre doit être une ARM en demande initiale avec une « Recevabilité de la demande » favorable
  q.where('titres.typeId', 'arm')
  q.where('titres.titreStatutId', 'dmi')
  q.whereExists(
    TitresEtapes.query()
      .alias('teRCP')
      .select(raw('true'))
      .leftJoin('titresDemarches as tdRCP', b => {
        b.on('tdRCP.id', 'teRCP.titreDemarcheId')
        b.on('tdRCP.titreId', 'titres.id')
      })
      .where('tdRcp.typeId', 'oct')
      .where('tdRcp.statutId', 'ins')
      .where('teRcp.typeId', 'mcr')
      .where('teRcp.statutId', 'fav')
      .first()
  )
}

export const titresConfidentielSelect = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  entreprisesIds: string[]
) =>
  // ajoute la colonne « confidentiel » si la demande n’est normalement pas visible par l’entreprise mais l’est car
  // c’est une demande en cours
  q.select(
    Titres.query()
      .alias('t_confidentiel')
      .select(raw('true'))
      .whereRaw('t_confidentiel.id = titres.id')
      .whereNot('titres.publicLecture', true)
      .whereNot(a => a.modify(titresVisibleByEntrepriseQuery, entreprisesIds))
      .where(a => a.modify(titresArmEnDemandeQuery))
      .as('confidentiel')
  )

export const titresModificationSelectQuery = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user: Pick<IUtilisateur, 'role' | 'administrationId'> | null | undefined
): QueryBuilder<AdministrationsModel> | RawBuilder => {
  if (isSuper(user)) {
    return raw('true')
  } else if (isAdministrationAdmin(user) || isAdministrationEditeur(user)) {
    return administrationsTitresQuery(user.administrationId, 'titres', {
      isGestionnaire: true
    })
      .modify(administrationsTitresTypesTitresStatutsModify, 'titres', 'titres')
      .select(raw('true'))
  }

  return raw('false')
}

const titresQueryModify = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user: IUtilisateur | null | undefined,
  demandeEnCours?: boolean | null
) => {
  q.select('titres.*').where('titres.archive', false)

  // si
  // - l'utilisateur n'est pas connecté
  // - ou l'utilisateur n'est pas super
  // alors il ne voit que les titres publics et ceux auxquels son entité est reliée

  if (!isSuper(user)) {
    q.where(b => {
      b.where('titres.publicLecture', true)

      // si l'utilisateur est `entreprise`
      if (
        (isEntreprise(user) || isBureauDEtudes(user)) &&
        user.entreprises?.length
      ) {
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.where(d => d.modify(titresVisibleByEntrepriseQuery, entreprisesIds))

          // ou si le titre est une ARM en cours de demande
          if (demandeEnCours) {
            c.orWhere(d => d.modify(titresArmEnDemandeQuery))
          }
        })
      }

      // si l'utilisateur est `administration`
      else if (isAdministration(user)) {
        // titres dont l'administration de l'utilisateur est
        // - administrationsGestionnaire
        // - ou administrationsLocale
        // - ou administration associée

        b.orWhereExists(
          administrationsTitresQuery(user.administrationId, 'titres', {
            isGestionnaire: true,
            isAssociee: true,
            isLocale: true
          })
        )
      }
    })

    // fileCreate('test.sql', sqlFormatter.format(q.toKnexQuery().toString()))
  }

  if (isSuper(user)) {
    q.select(raw('true').as('demarchesCreation'))
  } else if (isAdministrationAdmin(user) || isAdministrationEditeur(user)) {
    q.select(
      administrationsTitresQuery(user.administrationId, 'titres', {
        isGestionnaire: true,
        isLocale: true
      })
        .modify(
          administrationsTitresTypesTitresStatutsModify,
          'demarches',
          'titres'
        )
        .select(raw('true'))
        .as('demarchesCreation')
    )
  } else {
    q.select(raw('false').as('demarchesCreation'))
  }

  q.select(titresModificationSelectQuery(q, user).as('modification'))

  q.select(raw(`${isSuper(user)}`).as('suppression'))

  titresTravauxCreationQuery(q, user)

  if (user) {
    q.select(
      UtilisateursTitres.query()
        .select(raw('true'))
        .where(raw('?? = ??', ['titreId', 'titres.id']))
        .where('utilisateurId', user.id)
        .first()
        .as('abonnement')
    )
  }

  if (
    (isEntreprise(user) || isBureauDEtudes(user)) &&
    user.entreprises?.length
  ) {
    if (demandeEnCours) {
      q.modify(
        titresConfidentielSelect,
        user.entreprises.map(e => e.id)
      )
    }
  }

  // masque les administrations associées
  if (!(isSuper(user) || isAdministration(user))) {
    q.modifyGraph('administrationsGestionnaires', b => {
      b.whereRaw('?? is not true', ['associee'])
    })

    q.modifyGraph('administrationsLocales', b => {
      b.whereRaw('?? is not true', ['associee'])
    })
  }

  // visibilité des étapes
  q.modifyGraph('demarches', b => {
    titresDemarchesQueryModify(
      b as QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
      user
    )
  })

  titreActivitesCount(q, user)

  // visibilité des activités
  q.modifyGraph('activites', b => {
    titresActivitesQueryModify(
      b as QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
      user
    )
    titresActivitesPropsQueryModify(
      b as QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
      user
    )
  })

  q.modifyGraph('titulaires', b => {
    entreprisesQueryModify(
      b as QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
      user
    ).select('titresTitulaires.operateur')
  })

  q.modifyGraph('amodiataires', b => {
    entreprisesQueryModify(
      b as QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
      user
    ).select('titresAmodiataires.operateur')
  })

  // visibilité du doublonTitre
  q.modifyGraph('doublonTitre', b => {
    titresQueryModify(b as QueryBuilder<Titres, Titres | Titres[]>, user)
  })

  q.modifyGraph('titresAdministrations', b => {
    administrationsQueryModify(
      b as QueryBuilder<
        AdministrationsModel,
        AdministrationsModel | AdministrationsModel[]
      >,
      user
    )
  })

  return q
}

export { titresQueryModify, titresDemarchesAdministrationsModificationQuery }
