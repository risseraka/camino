import { canLinkTitres, getLinkConfig } from './titres'
import { TitresTypesIds, TitreTypeId } from '../static/titresTypes'
import { User } from '../roles'
import { ADMINISTRATION_IDS, AdministrationId } from '../static/administrations'
import { testBlankUser } from './administrations.test'

test('getTitreFromTypeId pas de fusions', () => {
  const titreFromTypeId = TitresTypesIds.reduce<{
    [key in TitreTypeId]?: {
      count: 'single' | 'multiple'
      typeId: TitreTypeId
    } | null
  }>((acc, titreTypeId) => {
    acc[titreTypeId] = getLinkConfig(titreTypeId, [])

    return acc
  }, {})
  expect(titreFromTypeId).toMatchSnapshot()
})
test('getTitreFromTypeId fusions', () => {
  const titreFromTypeId = TitresTypesIds.reduce<{
    [key in TitreTypeId]?: {
      count: 'single' | 'multiple'
      typeId: TitreTypeId
    } | null
  }>((acc, titreTypeId) => {
    acc[titreTypeId] = getLinkConfig(titreTypeId, [{ typeId: 'fus' }])

    return acc
  }, {})
  expect(titreFromTypeId).toMatchSnapshot()
})

test.each<[User, AdministrationId[], boolean]>([
  [{ ...testBlankUser, role: 'super' }, [], true],
  [
    { ...testBlankUser, role: 'admin', administrationId: ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON'] },
    [ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON']],
    true
  ],
  [{ ...testBlankUser, role: 'admin', administrationId: ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON'] }, [ADMINISTRATION_IDS['DREAL - PAYS DE LA LOIRE']], false],
  [{ ...testBlankUser, role: 'defaut' }, [ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON']], false]
])('un utilisateur $user peut modifier les liaisons d’un titre: $can ', (user, administrationIds, can) => {
  expect(canLinkTitres(user, administrationIds)).toBe(can)
})
