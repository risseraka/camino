import { TitreStatutId } from 'camino-common/src/static/titresStatuts'
import {
  ITitreDemarche,
  IContenusTitreEtapesIds,
  IContenuId
} from '../../types'

import { titreContenuTitreEtapeFind } from '../rules/titre-prop-etape-find'

export const contenusTitreEtapesIdsFind = (
  titreStatutId: TitreStatutId,
  titreDemarches: ITitreDemarche[],
  contenuIds?: IContenuId[] | null
) => {
  if (!contenuIds) return null

  const titrePropsEtapesIds = contenuIds.reduce(
    (
      contenusTitreEtapesIds: IContenusTitreEtapesIds | null,
      { sectionId, elementId }
    ) => {
      // trouve l'id de l'étape qui contient l'élément dans la section
      const titreEtape = titreContenuTitreEtapeFind(
        { sectionId, elementId },
        titreDemarches,
        titreStatutId
      )

      // si une étape est trouvée
      if (titreEtape) {
        if (!contenusTitreEtapesIds) {
          contenusTitreEtapesIds = {}
        }

        if (!contenusTitreEtapesIds[sectionId]) {
          contenusTitreEtapesIds[sectionId] = {}
        }

        contenusTitreEtapesIds[sectionId][elementId] = titreEtape.id
      }

      return contenusTitreEtapesIds
    },
    null
  )

  return titrePropsEtapesIds
}
