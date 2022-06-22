import { fiscaliteVisible, fraisGestion } from './fiscalite'
import { UserNotNull } from './roles'
import { CommonTitre } from './titres'

test('fraisGestion', () => {
  expect(fraisGestion({ redevanceDepartementale: 50, redevanceCommunale: 50 })).toBe(8)
  expect(
    fraisGestion({
      redevanceDepartementale: 50,
      redevanceCommunale: 50,
      guyane: {
        taxeAurifere: 100,
        taxeAurifereBrute: 0,
        totalInvestissementsDeduits: 0
      }
    })
  ).toBe(16)
})
const roleLessUser: Omit<UserNotNull, 'role'> = { id: 'id', nom: 'nom', email: 'email', prenom: 'prenom' }

test('fiscaliteVisible', () => {
  const titres: Partial<Pick<CommonTitre, 'domaineId'>>[] = [{ domaineId: 'm' }, { domaineId: 'w' }]
  expect(fiscaliteVisible(null, '1234', titres)).toBe(false)
  expect(fiscaliteVisible(undefined, '1234', titres)).toBe(false)
  expect(fiscaliteVisible({ role: 'defaut', ...roleLessUser }, '1234', titres)).toBe(false)
  expect(fiscaliteVisible({ role: 'bureau d’études', entreprises: [], ...roleLessUser }, '1234', titres)).toBe(false)
  expect(fiscaliteVisible({ role: 'entreprise', entreprises: [], ...roleLessUser }, '1234', titres)).toBe(false)
  expect(fiscaliteVisible({ role: 'entreprise', entreprises: [{ id: '1' }], ...roleLessUser }, '1234', titres)).toBe(false)
  expect(fiscaliteVisible({ role: 'entreprise', entreprises: [{ id: '1234' }], ...roleLessUser }, '1234', titres)).toBe(true)
  expect(fiscaliteVisible({ role: 'entreprise', entreprises: [{ id: '1' }, { id: '1234' }], ...roleLessUser }, '1234', titres)).toBe(true)
  expect(fiscaliteVisible({ role: 'admin', administrationId: 'aut-97300-01', ...roleLessUser }, '1234', titres)).toBe(true)
  expect(fiscaliteVisible({ role: 'editeur', administrationId: 'aut-97300-01', ...roleLessUser }, '1234', titres)).toBe(true)
  expect(fiscaliteVisible({ role: 'lecteur', administrationId: 'aut-97300-01', ...roleLessUser }, '1234', titres)).toBe(true)
  expect(fiscaliteVisible({ role: 'super', ...roleLessUser }, '1234', titres)).toBe(true)
})

test('fiscaliteVisible avec les titres', () => {
  expect(fiscaliteVisible({ role: 'super', ...roleLessUser }, '1234', [{ domaineId: 'm' }, { domaineId: 'w' }])).toEqual(true)
  expect(fiscaliteVisible({ role: 'entreprise', entreprises: [{ id: '1234' }], ...roleLessUser }, '1234', [{ domaineId: 'g' }, { domaineId: 'r' }, { domaineId: 's' }, { domaineId: 'w' }])).toEqual(
    false
  )
  expect(fiscaliteVisible({ role: 'entreprise', entreprises: [{ id: '1234' }], ...roleLessUser }, '1234', [])).toEqual(false)
  expect(() => fiscaliteVisible({ role: 'super', ...roleLessUser }, '1234', [{}])).toThrowErrorMatchingInlineSnapshot(`"le domaineId d'un titre est obligatoire"`)
})
