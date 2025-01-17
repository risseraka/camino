import { ITitreDemarche } from '../../types'

import titreDemarchesSortAsc from '../utils/titre-elements-sort-asc'
import {
  titreEtapesSortDescByOrdre,
  titreEtapesSortAscByOrdre
} from '../utils/titre-etapes-sort'
import { titreEtapePublicationCheck } from './titre-etape-publication-check'
import { isDemarcheTypeOctroi } from 'camino-common/src/static/demarchesTypes'

const titreDemarcheDateDebutFind = (
  titreDemarche: ITitreDemarche,
  titreTypeId: string
) => {
  // retourne la dernière étape de publication si celle-ci possède une date de début
  const etapePublicationHasDateDebut = titreEtapesSortDescByOrdre(
    titreDemarche.etapes!
  ).find(
    titreEtape =>
      titreEtapePublicationCheck(titreEtape.typeId, titreTypeId) &&
      titreEtape.dateDebut
  )

  // si cette démarche a une étape de publication qui possède une date de début
  if (etapePublicationHasDateDebut) {
    // la date de début est égale à la date de début de l'étape de publication
    return etapePublicationHasDateDebut.dateDebut
  }

  // retourne la première étape de publication de la démarche
  const titreEtapePublicationFirst = titreEtapesSortAscByOrdre(
    titreDemarche.etapes!
  ).find(te => titreEtapePublicationCheck(te.typeId, titreTypeId))

  // si la démarche n'a pas d'étape de publication
  if (!titreEtapePublicationFirst) {
    return null
  }

  // sinon la date de début est égale à la date de la première étape de publication
  return titreEtapePublicationFirst.date || null
}

/**
 * Retourne la date de début du titre
 * @param titreDemarches - démarches du titre
 * @param titreTypeId - id du type du titre
 */

export const titreDateDebutFind = (
  titreDemarches: ITitreDemarche[],
  titreTypeId: string
) => {
  // la première démarche d'octroi dont le statut est acceptée ou terminée
  const titreDemarchesSorted = titreDemarchesSortAsc(
    titreDemarches
  ) as ITitreDemarche[]
  const titreDemarche = titreDemarchesSorted.find(
    titreDemarche =>
      ['acc', 'ter'].includes(titreDemarche.statutId!) &&
      isDemarcheTypeOctroi(titreDemarche.typeId)
  )

  if (!titreDemarche) return null

  return titreDemarcheDateDebutFind(titreDemarche, titreTypeId)
}
