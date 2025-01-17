import dateFormat from 'dateformat'

import { ITitreDemarche } from '../../types'

import { titreValideCheck } from './titre-valide-check'

/**
 * Vérifie si une activité doit exister
 * @param date - date de l'activité au format yyyy-mm-dd
 * @param aujourdhui - date du jour au format yyyy-mm-dd
 * @param periodeId - id de la période (ex: 1 pour le premier trimestre)
 * @param annee - année
 * @param months - nombre de mois dans la période (ex: 3 pour un trimestre)
 * @param titreDemarches - démarches du titre
 * @param titreTypeId - id du type de titre
 */

export const titreActiviteValideCheck = (
  date: string,
  aujourdhui: string,
  periodeId: number,
  annee: number,
  months: number,
  titreDemarches: ITitreDemarche[],
  titreTypeId: string
) => {
  // si la date de fin de l'activité n'est pas passée
  // on ne crée pas l'activité
  if (date > aujourdhui) return false

  // si le titre est valide pendant la durée de l'activité
  const dateDebut = dateFormat(
    new Date(annee, (periodeId - 1) * months, 1),
    'yyyy-mm-dd'
  )

  // le titre n'est pas valide pour cette période
  // on ne crée pas l'activité
  return titreValideCheck(titreDemarches, dateDebut, date, titreTypeId, true)
}
