import { ITitrePhase } from '../../types'
import dateFormat from 'dateformat'

import {
  titrePhasesUpsert,
  titrePhasesDelete
} from '../../database/queries/titres-phases'
import { titrePhasesFind } from '../rules/titre-phases-find'
import { titresGet } from '../../database/queries/titres'
import { userSuper } from '../../database/user-super'

// retourne une phase parmi les titrePhases en fonction de son id
const titrePhaseEqualFind = (
  titreDemarcheId: string,
  titrePhases: ITitrePhase[]
) => titrePhases.find(tp => tp.titreDemarcheId === titreDemarcheId)

type TitrePhaseKey = keyof ITitrePhase
type TitrePhaseValeur = ITitrePhase[TitrePhaseKey]

type IPhasePropChange = { [id: string]: [TitrePhaseValeur, TitrePhaseValeur] }

// retourne les propriétés de la phase existante
// qui sont différentes de la nouvelle phase
const titrePhasePropsChangedFind = (
  titrePhase: ITitrePhase,
  titrePhaseOld: ITitrePhase
) =>
  Object.keys(titrePhase).reduce((res: IPhasePropChange, key: string) => {
    const valueOld = titrePhaseOld[key as TitrePhaseKey]
    const valueNew = titrePhase[key as TitrePhaseKey]

    // met la prop à jour si les variables sont différentes
    if (valueNew !== valueOld) {
      res[key] = [valueOld, valueNew]
    }

    return res
  }, {} as IPhasePropChange)

const titrePhasesUpdatedFind = (
  titresPhasesOld: ITitrePhase[],
  titrePhases: ITitrePhase[]
) =>
  titrePhases.reduce((res: ITitrePhase[], titrePhase) => {
    const titrePhaseOld = titrePhaseEqualFind(
      titrePhase.titreDemarcheId,
      titresPhasesOld
    )

    // si la phase n'existe pas
    // on l'ajoute à l'accumulateur
    if (!titrePhaseOld) {
      res.push(titrePhase)

      return res
    }

    const titrePhasePropsChanged = titrePhasePropsChangedFind(
      titrePhase,
      titrePhaseOld
    )

    // si la phase existe et est modifiée
    if (Object.keys(titrePhasePropsChanged).length) {
      res.push(titrePhase)
    }

    return res
  }, [])

const titrePhasesIdDeletedFind = (
  titrePhasesOld: ITitrePhase[],
  titresPhases: ITitrePhase[]
) =>
  titrePhasesOld.reduce((res: string[], titrePhaseOld) => {
    const titrePhase = titrePhaseEqualFind(
      titrePhaseOld.titreDemarcheId,
      titresPhases
    )

    if (!titrePhase) {
      res.push(titrePhaseOld.titreDemarcheId)
    }

    return res
  }, [])

export const titresPhasesUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('phases des titres…')

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
      }
    },
    userSuper
  )

  const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')
  const titresPhasesIdsUpdated = []
  const titresPhasesIdsDeleted = []

  for (const titre of titres) {
    // met les démarches d'un titre dans le sens croissant avec `reverse()` :
    // les démarches données part `titresGet` sont dans l'ordre décroissant
    const demarches = titre.demarches!.slice().reverse()

    // retourne les phases enregistrées en base
    const titrePhasesOld = demarches.reduce((res: ITitrePhase[], td) => {
      if (td.phase) {
        res.push(td.phase)
      }

      return res
    }, [])

    // retourne un tableau avec les phases
    // créées à partir des démarches
    const titrePhases = titrePhasesFind(demarches, aujourdhui, titre.typeId)

    const titrePhasesToUpdate = titrePhasesUpdatedFind(
      titrePhasesOld,
      titrePhases
    )

    if (titrePhasesToUpdate.length) {
      await titrePhasesUpsert(titrePhasesToUpdate)

      console.info(
        'titre / démarche / phases (mise à jour) ->',
        JSON.stringify(titrePhasesToUpdate)
      )

      titresPhasesIdsUpdated.push(
        ...titrePhasesToUpdate.map(p => p.titreDemarcheId)
      )
    }

    const titrePhasesToDeleteIds = titrePhasesIdDeletedFind(
      titrePhasesOld,
      titrePhases
    )

    if (titrePhasesToDeleteIds.length) {
      await titrePhasesDelete(titrePhasesToDeleteIds)

      console.info(
        'titre / démarche / phases (suppression) ->',
        titrePhasesToDeleteIds.join(', ')
      )

      titresPhasesIdsDeleted.push(...titrePhasesToDeleteIds)
    }
  }

  return [titresPhasesIdsUpdated, titresPhasesIdsDeleted]
}
