import { entreprisesUpdate } from './entreprises-update'
import { entreprisesGet } from '../../database/queries/entreprises'
import { entreprisesEtablissementsGet } from '../../database/queries/entreprises-etablissements'
import {
  apiInseeEntreprisesGet,
  apiInseeEntreprisesEtablissementsGet
} from '../../tools/api-insee'

import {
  dbEntreprisesCreees,
  dbEntreprisesEtablissementsCreees,
  apiEntreprisesCreees,
  dbEntreprisesModifiees,
  dbEntreprisesEtablissementsModifies,
  apiEntreprisesModifiees,
  dbEntreprisesSupprimeees,
  dbEntreprisesEtablissementsSupprimeees,
  apiEntreprisesSupprimeees,
  dbEntreprisesExistantes,
  dbEntreprisesEtablissementsExistants,
  apiEntreprisesExistantes,
  dbEntreprisesInexistantes,
  dbEntreprisesEtablissementsInexistants,
  apiEntreprisesInexistantes,
  apiEntreprisesEtablissmentsInexistantes,
  apiEntreprisesEtablissementsExistantes,
  apiEntreprisesEtablissementsCreees,
  apiEntreprisesEtablissementsModifiees,
  apiEntreprisesEtablissementsSupprimeees
} from './__mocks__/entreprises-update'
import { IEntreprise, IEntrepriseEtablissement } from '../../types'

const entreprisesUpdated: IEntreprise[] = []
// 'jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/entreprises', () => ({
  entreprisesUpsert: jest.fn().mockImplementation(a => {
    entreprisesUpdated.push(...a)

    return a
  }),
  entreprisesGet: jest.fn()
}))

const etablissementsUpdated: IEntrepriseEtablissement[] = []
const etablissementsDeleted: string[] = []
jest.mock('../../database/queries/entreprises-etablissements', () => ({
  entreprisesEtablissementsUpsert: jest.fn().mockImplementation(a => {
    etablissementsUpdated.push(...a)

    return a
  }),
  entreprisesEtablissementsDelete: jest.fn().mockImplementation(a => {
    etablissementsDeleted.push(...a)

    return a
  }),
  entreprisesEtablissementsGet: jest.fn()
}))

// 'jest.mock()' est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../tools/api-insee/index', () => ({
  __esModule: true,
  apiInseeEntreprisesGet: jest.fn(),
  apiInseeEntreprisesEtablissementsGet: jest.fn()
}))

const entreprisesGetMock = jest.mocked(entreprisesGet, true)
const entreprisesEtablissementsGetMock = jest.mocked(
  entreprisesEtablissementsGet,
  true
)
const apiInseeEntreprisesGetMock = jest.mocked(apiInseeEntreprisesGet, true)
const apiInseeEntreprisesEtablissementsGetMock = jest.mocked(
  apiInseeEntreprisesEtablissementsGet,
  true
)

console.info = jest.fn()
console.info = jest.fn()

describe('entreprises', () => {
  beforeEach(() => {
    etablissementsUpdated.splice(0, etablissementsUpdated.length)
    etablissementsDeleted.splice(0, etablissementsDeleted.length)
    entreprisesUpdated.splice(0, entreprisesUpdated.length)
  })
  test("crée les entreprises si elles n'existent pas", async () => {
    entreprisesGetMock.mockResolvedValue(dbEntreprisesCreees)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      dbEntreprisesEtablissementsCreees
    )
    apiInseeEntreprisesGetMock.mockResolvedValue(apiEntreprisesCreees)
    apiInseeEntreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissementsCreees
    )

    await entreprisesUpdate()

    expect(etablissementsUpdated).toEqual([
      { id: 'pipo', nom: 'pipo' },
      { id: 'toto', nom: 'toto' }
    ])
    expect(etablissementsDeleted.length).toEqual(0)
    expect(entreprisesUpdated).toEqual([{ id: 'papa', legalSiren: 'toto' }])
  })

  test('met à jour les entreprises qui ont été modifiées', async () => {
    entreprisesGetMock.mockResolvedValue(dbEntreprisesModifiees)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      dbEntreprisesEtablissementsModifies
    )
    apiInseeEntreprisesGetMock.mockResolvedValue(apiEntreprisesModifiees)
    apiInseeEntreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissementsModifiees
    )

    await entreprisesUpdate()

    expect(etablissementsUpdated).toEqual([{ id: 'toto', nom: 'tutu' }])
    expect(etablissementsDeleted.length).toEqual(0)
    expect(entreprisesUpdated).toEqual([{ id: 'toto', legalSiren: 'papa' }])
    expect(console.info).toHaveBeenCalled()
  })

  test('supprime les entreprises qui ont été supprimés', async () => {
    entreprisesGetMock.mockResolvedValue(dbEntreprisesSupprimeees)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      dbEntreprisesEtablissementsSupprimeees
    )
    apiInseeEntreprisesGetMock.mockResolvedValue(apiEntreprisesSupprimeees)
    apiInseeEntreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissementsSupprimeees
    )

    await entreprisesUpdate()

    expect(etablissementsUpdated.length).toEqual(0)
    expect(etablissementsDeleted.length).toEqual(1)
    expect(entreprisesUpdated.length).toEqual(0)
    expect(console.info).toHaveBeenCalled()
  })

  test('ne crée pas les entreprises qui existent déjà', async () => {
    entreprisesGetMock.mockResolvedValue(dbEntreprisesExistantes)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      dbEntreprisesEtablissementsExistants
    )
    apiInseeEntreprisesGetMock.mockResolvedValue(apiEntreprisesExistantes)
    apiInseeEntreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissementsExistantes
    )

    await entreprisesUpdate()

    expect(entreprisesUpdated).toEqual([])
    expect(etablissementsDeleted.length).toEqual(0)
    expect(etablissementsUpdated).toEqual([])
  })

  test("ne modifie pas d'entreprises si elles n'existent pas", async () => {
    entreprisesGetMock.mockResolvedValue(dbEntreprisesInexistantes)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      dbEntreprisesEtablissementsInexistants
    )
    apiInseeEntreprisesGetMock.mockResolvedValue(apiEntreprisesInexistantes)
    apiInseeEntreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissmentsInexistantes
    )

    await entreprisesUpdate()

    expect(etablissementsUpdated.length).toEqual(0)
    expect(etablissementsDeleted.length).toEqual(0)
    expect(entreprisesUpdated.length).toEqual(0)
  })
})
