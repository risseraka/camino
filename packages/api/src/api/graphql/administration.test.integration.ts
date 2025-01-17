import { graphQLCall, queryImport } from '../../../tests/_utils/index'

import { dbManager } from '../../../tests/db-manager'
import { ADMINISTRATION_IDS } from 'camino-common/src/static/administrations'

console.info = jest.fn()
console.error = jest.fn()
beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.closeKnex()
})

describe('administrationTitreTypeTitreStatutModifier', () => {
  const administrationTitreTypeTitreStatutModifierQuery = queryImport(
    'administration-titre-type-titre-statut-modifier'
  )

  test("ne peut pas modifier les types de titre / statuts de titre d'une administration (anonyme)", async () => {
    const res = await graphQLCall(
      administrationTitreTypeTitreStatutModifierQuery,
      {
        administrationTitreTypeTitreStatut: {
          administrationId: ADMINISTRATION_IDS.BRGM,
          titreTypeId: 'arm',
          titreStatutId: 'val',
          titresModificationInterdit: true,
          demarchesModificationInterdit: true,
          etapesModificationInterdit: true
        }
      }
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("modifie les types de titre / statuts de titre d'une administration (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      administrationTitreTypeTitreStatutModifierQuery,
      {
        administrationTitreTypeTitreStatut: {
          administrationId: ADMINISTRATION_IDS.BRGM,
          titreTypeId: 'arm',
          titreStatutId: 'val',
          titresModificationInterdit: true,
          demarchesModificationInterdit: true,
          etapesModificationInterdit: true
        }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        administrationTitreTypeTitreStatutModifier: {
          id: ADMINISTRATION_IDS.BRGM,
          titresTypesTitresStatuts: [
            {
              titreType: { id: 'arm' },
              titreStatutId: 'val',
              titresModificationInterdit: true,
              demarchesModificationInterdit: true,
              etapesModificationInterdit: true
            }
          ]
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })
})

describe('administrationTitreTypeEtapeTypeModifier', () => {
  const administrationTitreTypeEtapeTypeModifierQuery = queryImport(
    'administration-titre-type-etape-type-modifier'
  )

  test("ne peut pas modifier les types de titre / types d'étape d'une administration (anonyme)", async () => {
    const res = await graphQLCall(
      administrationTitreTypeEtapeTypeModifierQuery,
      {
        administrationTitreTypeEtapeType: {
          administrationId: ADMINISTRATION_IDS.BRGM,
          titreTypeId: 'arm',
          etapeTypeId: 'dex',
          lectureInterdit: true,
          modificationInterdit: true,
          creationInterdit: true
        }
      }
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("modifie les types de titre / types d'étape d'une administration (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      administrationTitreTypeEtapeTypeModifierQuery,
      {
        administrationTitreTypeEtapeType: {
          administrationId: ADMINISTRATION_IDS.BRGM,
          titreTypeId: 'arm',
          etapeTypeId: 'dex',
          lectureInterdit: true,
          modificationInterdit: true,
          creationInterdit: true
        }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        administrationTitreTypeEtapeTypeModifier: {
          id: ADMINISTRATION_IDS.BRGM,
          titresTypesEtapesTypes: [
            {
              titreType: { id: 'arm' },
              etapeType: { id: 'dex' },
              lectureInterdit: true,
              modificationInterdit: true,
              creationInterdit: true
            }
          ]
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })
})
