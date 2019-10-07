import PQueue from 'p-queue'

import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'

const titresDemarchesOrdreUpdate = async titres => {
  const queue = new PQueue({ concurrency: 100 })

  const titresDemarchesUpdated = titres.reduce(
    (titresDemarchesUpdated, titre) =>
      titreDemarchesAscSort(titre.demarches.slice().reverse()).reduce(
        (titresDemarchesUpdated, titreDemarche, index) => {
          if (titreDemarche.ordre === index + 1) return titresDemarchesUpdated

          queue.add(async () => {
            await titreDemarcheUpdate(titreDemarche.id, { ordre: index + 1 })

            console.log(
              `mise à jour: démarche ${titreDemarche.id}, ${JSON.stringify({
                ordre: index + 1
              })}`
            )

            titresDemarchesUpdated.push(titreDemarche.id)
          })

          return titresDemarchesUpdated
        },
        titresDemarchesUpdated
      ),
    []
  )

  await queue.onIdle()

  return titresDemarchesUpdated
}

export default titresDemarchesOrdreUpdate
