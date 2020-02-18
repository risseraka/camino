// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe
import { ITitreDemarche, ITitreEtape, TitreEtapeProp } from '../../types'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

const etapePropFind = (
  titreDemarcheEtapes: ITitreEtape[],
  prop: TitreEtapeProp,
  titreDemarcheTypeId: string,
  titreStatutId: string
) =>
  titreEtapesDescSort(titreDemarcheEtapes).find((titreEtape: ITitreEtape) => {
    // trouve une étape qui contient la propriété
    const isPropFound =
      titreEtape[prop] &&
      (!Array.isArray(titreEtape[prop]) ||
        // la propriété ne doit pas être vide si c'est un tableau
        (titreEtape[prop] as []).length)
    if (!isPropFound) return false

    // filtre les étapes acceptation, fait ou favorable
    // Si la démarche est un octroi (demande initiale)
    // on prend en compte n'importe quelle étape
    // ou si on cherche le périmètre
    // et que le titre est en modification en instance
    // sinon, on ne prend en compte que les étapes de décision
    const isEtapeValide =
      ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
      (['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
        (prop.match('point') && titreStatutId === 'mod') ||
        ['dpu', 'rpu', 'dex', 'dim', 'def', 'sco', 'aco'].includes(
          titreEtape.typeId
        ))

    if (!isEtapeValide) return false

    if (prop.match('amodiataires')) {
      const { dateFin } = titreEtape

      // si la date de fin de l'étape est passée
      // l'amodiataire n'est plus valide
      if (dateFin && new Date(dateFin) < new Date()) return false

      // sinon, si le titre a le statut modification en instance
      // l'amodiataire est encore valide (survie provisoire)
      // ou, si le titre a le statut échu
      // on affiche le dernier amodiataire
      return ['mod', 'ech'].includes(titreStatutId)
    }

    return true
  })

// si
// - la démarches est acceptée, terminée
// - ou la démarche est un octroi
// - ou le titre a le statut modification en instance
//   - et la démarche est une prolongation ou une demande de titre
//   - et la démarche n'a aucune phase valide
const etapeEligibleCheck = (
  titreDemarcheStatutId: string,
  titreDemarcheTypeId: string,
  titreStatutId: string,
  titreDemarches: ITitreDemarche[]
) =>
  ['acc', 'ter'].includes(titreDemarcheStatutId!) ||
  ['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
  (titreStatutId === 'mod' &&
    ['pro', 'pr1', 'pr2', 'prr', 'vct'].includes(titreDemarcheTypeId) &&
    !titreDemarches.find(td => td.phase && td.phase.statutId === 'val'))

const titrePropEtapeIdFind = (
  {
    demarches: titreDemarches,
    statutId: titreStatutId
  }: { demarches: ITitreDemarche[]; statutId: string },
  prop: TitreEtapeProp
) =>
  titreDemarchesAscSort(titreDemarches)
    .reverse()
    .reduce((etapeId: string | undefined, titreDemarche: ITitreDemarche) => {
      // si une étape a déjà été trouvée
      if (etapeId) return etapeId

      if (
        !etapeEligibleCheck(
          titreDemarche.statutId!,
          titreDemarche.typeId,
          titreStatutId,
          titreDemarches
        )
      ) {
        return etapeId
      }

      const etape = etapePropFind(
        titreDemarche.etapes!,
        prop,
        titreDemarche.typeId,
        titreStatutId
      )

      // si l'étape existe,
      // retourne son id
      // sinon retourne `null`
      return (etape && etape.id) || undefined
    }, undefined)

export default titrePropEtapeIdFind