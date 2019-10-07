import PQueue from 'p-queue'

import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'

const titresEtapesOrdreUpdate = async titresDemarches => {
  const queue = new PQueue({ concurrency: 100 })

  const titresEtapesUpdated = titresDemarches.reduce(
    (titresEtapesUpdated, titreDemarche) =>
      titreEtapesAscSortByDate(titreDemarche.etapes).reduce(
        (titresEtapesUpdated, titreEtape, index) => {
          if (titreEtape.ordre === index + 1) return titresEtapesUpdated

          queue.add(async () => {
            await titreEtapeUpdate(titreEtape.id, { ordre: index + 1 })

            console.log(
              `mise à jour: étape ${titreEtape.id}, ${JSON.stringify({
                ordre: index + 1
              })}`
            )

            titresEtapesUpdated.push(titreEtape.id)
          })

          return titresEtapesUpdated
        },
        titresEtapesUpdated
      ),
    []
  )

  await queue.onIdle()

  return titresEtapesUpdated
}

export default titresEtapesOrdreUpdate
