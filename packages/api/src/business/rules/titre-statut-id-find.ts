import { DemarchesStatutsTypesIds, ITitreDemarche } from '../../types'

import { titreDateFinFind } from './titre-date-fin-find'

const titreStatutIdFind = (
  aujourdhui: string,
  demarches: ITitreDemarche[] | null | undefined,
  titreTypeId: string
) => {
  const titreDemarches = demarches
    ? demarches.filter(d => !d.type!.travaux)
    : null

  if (!titreDemarches || !titreDemarches.length) return 'ind'

  // si toutes les démarches du titre ont le statut `indéfini`
  // -> le titre a également le statut `indéfini`
  if (titreDemarches.every(d => d.statutId === 'ind')) return 'ind'

  // s'il y a une seule démarche (octroi)
  if (
    titreDemarches.length === 1 &&
    ['oct', 'vut', 'vct'].includes(titreDemarches[0].typeId) &&
    ['eco', 'ins', 'dep', 'rej', 'cls', 'des'].includes(
      titreDemarches[0].statutId!
    )
  ) {
    // si le statut de la démarche est en instruction ou déposée
    // -> le statut du titre est demande initiale
    if (['eco', 'ins', 'dep'].includes(titreDemarches[0].statutId!)) {
      return 'dmi'
    }

    // si le statut de la démarche est rejeté ou classé sans suite ou désisté
    // -> le statut du titre est demande classée
    return 'dmc'
  }

  // si une démarche a le statut en instruction
  // -> le statut du titre est modification en instance
  if (titreDemarches.find(d => d.statutId === 'ins')) {
    return 'mod'
  }

  // si la date du jour est inférieure à la date d’échéance
  // -> le statut du titre est valide
  const dateFin = titreDateFinFind(titreDemarches)

  if (dateFin && aujourdhui < dateFin) {
    return 'val'
  }

  // si le titre est un PER M ou W, ou une AXM
  // et qu'une démarche de prolongation est déposée et a été déposée avant l'échéance de l'octroi ou d’une prolongation précédente
  // -> le statut du titre est modification en instance (survie provisoire)
  if (['prm', 'prw', 'axm'].includes(titreTypeId)) {
    const octroi = titreDemarches.find(d => d.typeId === 'oct')

    if (octroi) {
      const dateFin = titreDateFinFind(
        titreDemarches.filter(({ typeId }) => ['oct', 'pr1'].includes(typeId))
      )

      if (
        dateFin &&
        titreDemarches.some(d => {
          if (!['pr1', 'pr2', 'pro'].includes(d.typeId)) {
            return false
          }

          if (
            ![
              DemarchesStatutsTypesIds.EnConstruction,
              DemarchesStatutsTypesIds.Depose
            ].includes(d.statutId)
          ) {
            return false
          }

          let demandeProlongation = d.etapes?.find(e => e.typeId === 'mfr')
          if (!demandeProlongation) {
            demandeProlongation = d.etapes?.find(e => e.typeId === 'mdp')
          }

          return demandeProlongation && demandeProlongation.date < dateFin
        })
      ) {
        return 'mod'
      }
    }
  }

  // sinon le statut du titre est échu
  return 'ech'
}

export { titreStatutIdFind }
