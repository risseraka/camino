import { ITitreEtapeJustificatif } from '../../types'
import { dbManager } from '../../../tests/db-manager'
import { graphQLCall, queryImport } from '../../../tests/_utils/index'
import {
  entreprisesEtablissementsFetch,
  entreprisesFetch,
  tokenInitialize
} from '../../tools/api-insee/fetch'
import {
  entreprise,
  entrepriseAndEtablissements
} from '../../../tests/__mocks__/fetch-insee-api'
import { entrepriseUpsert } from '../../database/queries/entreprises'
import { titreCreate } from '../../database/queries/titres'
import { documentCreate } from '../../database/queries/documents'
import {
  titreEtapeCreate,
  titresEtapesJustificatifsUpsert
} from '../../database/queries/titres-etapes'
import { titreDemarcheCreate } from '../../database/queries/titres-demarches'
import { userSuper } from '../../database/user-super'

console.info = jest.fn()
console.error = jest.fn()

jest.mock('../../tools/api-insee/fetch', () => ({
  __esModule: true,
  tokenInitialize: jest.fn(),
  entreprisesFetch: jest.fn(),
  entreprisesEtablissementsFetch: jest.fn()
}))

const tokenInitializeMock = jest.mocked(tokenInitialize, true)
const entrepriseFetchMock = jest.mocked(entreprisesFetch, true)
const entreprisesEtablissementsFetchMock = jest.mocked(
  entreprisesEtablissementsFetch,
  true
)
beforeAll(async () => {
  await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.reseedDb()
})

afterAll(async () => {
  await dbManager.closeKnex()
})

describe('entrepriseCreer', () => {
  const entrepriseCreerQuery = queryImport('entreprise-creer')

  test('ne peut pas créer une entreprise (utilisateur anonyme)', async () => {
    const res = await graphQLCall(
      entrepriseCreerQuery,
      {
        entreprise: { legalSiren: 'test', paysId: 'fr' }
      },
      undefined
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("peut créer une entreprise (un utilisateur 'super')", async () => {
    tokenInitializeMock.mockResolvedValue('token')
    entrepriseFetchMock.mockResolvedValue([entreprise])
    entreprisesEtablissementsFetchMock.mockResolvedValue([
      entrepriseAndEtablissements
    ])

    const res = await graphQLCall(
      entrepriseCreerQuery,
      { entreprise: { legalSiren: '729800706', paysId: 'fr' } },
      { role: 'super' }
    )

    expect(res.body).toMatchObject({
      data: {
        entrepriseCreer: {
          legalSiren: '729800706'
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })

  test("ne peut pas créer une entreprise déjà existante (un utilisateur 'super')", async () => {
    await graphQLCall(
      entrepriseCreerQuery,
      { entreprise: { legalSiren: '729800706', paysId: 'fr' } },
      { role: 'super' }
    )

    const res = await graphQLCall(
      entrepriseCreerQuery,
      { entreprise: { legalSiren: '729800706', paysId: 'fr' } },
      { role: 'super' }
    )

    expect(res.body.errors[0].message).toBe(
      "l'entreprise PLACOPLATRE existe déjà dans Camino"
    )
  })

  test("ne peut pas créer une entreprise avec un siren invalide (un utilisateur 'super')", async () => {
    tokenInitializeMock.mockResolvedValue('token')
    entrepriseFetchMock.mockResolvedValue([])

    const res = await graphQLCall(
      entrepriseCreerQuery,
      { entreprise: { legalSiren: 'invalid', paysId: 'fr' } },
      { role: 'super' }
    )

    expect(res.body.errors[0].message).toBe(
      'numéro de siren non reconnu dans la base Insee'
    )
  })

  test("ne peut pas créer une entreprise étrangère (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      entrepriseCreerQuery,
      { entreprise: { legalSiren: '729800706', paysId: 'en' } },
      { role: 'super' }
    )

    expect(res.body.errors[0].message).toBe(
      'impossible de créer une entreprise étrangère'
    )
  })

  test('n’est pas archivée à la création par défaut (utilisateur super)', async () => {
    tokenInitializeMock.mockResolvedValue('token')
    entrepriseFetchMock.mockResolvedValue([entreprise])
    entreprisesEtablissementsFetchMock.mockResolvedValue([
      entrepriseAndEtablissements
    ])

    const res = await graphQLCall(
      entrepriseCreerQuery,
      { entreprise: { legalSiren: '729800706', paysId: 'fr' } },
      { role: 'super' }
    )

    expect(res.body).toMatchObject({
      data: {
        entrepriseCreer: {
          archive: false
        }
      }
    })
  })
})

describe('entrepriseModifier', () => {
  const entrepriseModifierQuery = queryImport('entreprise-modifier')

  let entrepriseId: string

  beforeEach(async () => {
    tokenInitializeMock.mockResolvedValue('token')
    entrepriseFetchMock.mockResolvedValue([entreprise])
    entreprisesEtablissementsFetchMock.mockResolvedValue([
      entrepriseAndEtablissements
    ])

    const res = await graphQLCall(
      queryImport('entreprise-creer'),
      { entreprise: { legalSiren: '729800706', paysId: 'fr' } },
      { role: 'super' }
    )

    entrepriseId = res.body.data.entrepriseCreer.id
  })

  test('ne peut pas modifier une entreprise (utilisateur anonyme)', async () => {
    const res = await graphQLCall(
      entrepriseModifierQuery,
      {
        entreprise: { id: entrepriseId, email: 'toto@gmail.com' }
      },
      undefined
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("peut modifier une entreprise (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      entrepriseModifierQuery,
      { entreprise: { id: entrepriseId, email: 'toto@gmail.com' } },
      { role: 'super' }
    )

    expect(res.body).toMatchObject({
      data: {
        entrepriseModifier: { email: 'toto@gmail.com' }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })

  test("ne peut pas modifier une entreprise avec un email invalide (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      entrepriseModifierQuery,
      { entreprise: { id: entrepriseId, email: 'totogmail.com' } },
      { role: 'super' }
    )

    expect(res.body.errors[0].message).toBe('adresse email invalide')
  })

  test("ne peut pas modifier une entreprise inexistante (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      entrepriseModifierQuery,
      { entreprise: { id: 'id-inconnu' } },
      { role: 'super' }
    )

    expect(res.body.errors[0].message).toBe('entreprise inconnue')
  })

  test('peut archiver une entreprise (super)', async () => {
    const res = await graphQLCall(
      entrepriseModifierQuery,
      { entreprise: { id: entrepriseId, archive: true } },
      { role: 'super' }
    )

    expect(res.body).toMatchObject({
      data: {
        entrepriseModifier: { archive: true }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })
})

describe('entreprise', () => {
  const entrepriseQuery = queryImport('entreprise')

  test('un document d’entreprise lié à une étape est non supprimable et non modifiable (super)', async () => {
    const entrepriseId = 'entreprise-id'
    await entrepriseUpsert({ id: entrepriseId, nom: entrepriseId })

    const titre = await titreCreate(
      {
        domaineId: 'm',
        nom: '',
        typeId: 'arm',
        propsTitreEtapesIds: {}
      },
      {}
    )

    const titreDemarche = await titreDemarcheCreate({
      titreId: titre.id,
      typeId: 'oct'
    })
    const titreEtape = await titreEtapeCreate(
      {
        typeId: 'mfr',
        statutId: 'fai',
        titreDemarcheId: titreDemarche.id,
        date: ''
      },
      userSuper,
      titre.id
    )

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'fac',
      date: '',
      entrepriseId
    })

    await titresEtapesJustificatifsUpsert([
      { documentId, titreEtapeId: titreEtape.id } as ITitreEtapeJustificatif
    ])

    const res = await graphQLCall(
      entrepriseQuery,
      { id: entrepriseId },
      { role: 'super' }
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.entreprise.documents[0].modification).toBe(false)
    expect(res.body.data.entreprise.documents[0].suppression).toBe(false)
  })

  test('un document d’entreprise lié à aucune étape est supprimable et modifiable (super)', async () => {
    const entrepriseId = 'entreprise-id'
    await entrepriseUpsert({ id: entrepriseId, nom: entrepriseId })

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'fac',
      date: '',
      entrepriseId
    })

    const res = await graphQLCall(
      entrepriseQuery,
      { id: entrepriseId },
      { role: 'super' }
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.entreprise.documents[0].modification).toBe(true)
    expect(res.body.data.entreprise.documents[0].suppression).toBe(true)
  })
})

describe('entreprises', () => {
  const entreprisesQuery = queryImport('entreprises')

  test('peut filter les entreprises archivées ou non (super)', async () => {
    const entrepriseId = 'entreprise-id'
    for (let i = 0; i < 10; i++) {
      await entrepriseUpsert({
        id: `${entrepriseId}-${i}`,
        nom: `${entrepriseId}-${i}`,
        archive: i > 3
      })
    }

    let res = await graphQLCall(
      entreprisesQuery,
      { archive: false },
      { role: 'super' }
    )
    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.entreprises.elements).toHaveLength(4)

    res = await graphQLCall(
      entreprisesQuery,
      { archive: true },
      { role: 'super' }
    )
    expect(res.body.data.entreprises.elements).toHaveLength(6)

    res = await graphQLCall(entreprisesQuery, {}, { role: 'super' })
    expect(res.body.data.entreprises.elements).toHaveLength(10)
  })
})
