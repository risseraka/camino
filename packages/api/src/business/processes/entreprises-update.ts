import { IEntrepriseEtablissement, IEntreprise } from '../../types'

import { objectsDiffer } from '../../tools/index'
import {
  entreprisesUpsert,
  entreprisesGet
} from '../../database/queries/entreprises'
import {
  entreprisesEtablissementsUpsert,
  entreprisesEtablissementsDelete,
  entreprisesEtablissementsGet
} from '../../database/queries/entreprises-etablissements'
import {
  apiInseeEntreprisesEtablissementsGet,
  apiInseeEntreprisesGet
} from '../../tools/api-insee'
import { userSuper } from '../../database/user-super'

const entreprisesEtablissementsToUpdateBuild = (
  entreprisesEtablissementsOld: IEntrepriseEtablissement[],
  entreprisesEtablissementsNew: IEntrepriseEtablissement[]
) =>
  entreprisesEtablissementsNew.reduce(
    (acc: IEntrepriseEtablissement[], entrepriseEtablissementNew) => {
      const entrepriseEtablissementOld = entreprisesEtablissementsOld.find(
        a => a && a.id === entrepriseEtablissementNew.id
      )

      const updated =
        !entrepriseEtablissementOld ||
        objectsDiffer(entrepriseEtablissementNew, entrepriseEtablissementOld)

      if (updated) {
        acc.push(entrepriseEtablissementNew)
      }

      return acc
    },
    []
  )

const entreprisesEtablissementsToDeleteBuild = (
  entreprisesEtablissementsOld: IEntrepriseEtablissement[],
  entreprisesEtablissementsNew: IEntrepriseEtablissement[]
) =>
  entreprisesEtablissementsOld.reduce(
    (acc: string[], entrepriseEtablissementOld) => {
      const deleted = !entreprisesEtablissementsNew.find(
        a => a && a.id === entrepriseEtablissementOld.id
      )

      if (deleted) {
        acc.push(entrepriseEtablissementOld.id)
      }

      return acc
    },
    []
  )

const entreprisesToUpdateBuild = (
  entreprisesOld: IEntreprise[],
  entreprisesNew: IEntreprise[]
) =>
  entreprisesNew.reduce((acc: IEntreprise[], entrepriseNew) => {
    const entrepriseOld = entreprisesOld.find(e => e.id === entrepriseNew.id)

    const updated =
      !entrepriseOld || objectsDiffer(entrepriseNew, entrepriseOld)

    if (updated) {
      acc.push(entrepriseNew)
    }

    return acc
  }, [])

const sirensFind = (entreprisesOld: IEntreprise[]) =>
  Object.keys(
    entreprisesOld.reduce((acc: { [id: string]: number }, entrepriseOld) => {
      if (!entrepriseOld.legalSiren) return acc

      let siren = Number(acc[entrepriseOld.legalSiren])
      siren = isNaN(siren) ? 0 : siren
      siren += 1

      acc[entrepriseOld.legalSiren] = siren

      // prévient s'il y a des doublons dans les sirens
      if (acc[entrepriseOld.legalSiren] > 1) {
        console.info(`SIREN en doublon: ${entrepriseOld.legalSiren}`)
      }

      return acc
    }, {})
  )

export const entreprisesUpdate = async (): Promise<void> => {
  console.info()
  console.info('entreprises (Api Insee)…')

  const entreprisesOld = await entreprisesGet({}, {}, userSuper)
  const entreprisesEtablissementsOld = await entreprisesEtablissementsGet()

  const sirens = sirensFind(entreprisesOld)

  if (sirens.length) {
    const entreprisesNew = await apiInseeEntreprisesGet(sirens)
    const entreprisesEtablissementsNew =
      await apiInseeEntreprisesEtablissementsGet(sirens)

    const entreprisesToUpdate = entreprisesToUpdateBuild(
      entreprisesOld,
      entreprisesNew
    )

    const etablissementsToUpdate = entreprisesEtablissementsToUpdateBuild(
      entreprisesEtablissementsOld,
      entreprisesEtablissementsNew
    )

    const etablissementsToDelete = entreprisesEtablissementsToDeleteBuild(
      entreprisesEtablissementsOld,
      entreprisesEtablissementsNew
    )

    let etablissementsUpdated = [] as IEntrepriseEtablissement[]

    if (etablissementsToUpdate.length) {
      etablissementsUpdated = await entreprisesEtablissementsUpsert(
        etablissementsToUpdate
      )

      console.info(
        'entreprises / établissements (mise a jour)',
        etablissementsUpdated.map(e => e.id).join(', ')
      )
    }

    if (etablissementsToDelete.length) {
      await entreprisesEtablissementsDelete(etablissementsToDelete)

      console.info(
        'entreprises / établissements (suppression) ->',
        etablissementsToDelete.join(', ')
      )
    }

    let entreprisesUpdated: IEntreprise[] = []

    if (entreprisesToUpdate.length) {
      entreprisesUpdated = await entreprisesUpsert(entreprisesToUpdate)

      console.info(
        'entreprises (mise à jour) ->',
        entreprisesUpdated.map(e => e.id).join(', ')
      )
    }
  }
}
