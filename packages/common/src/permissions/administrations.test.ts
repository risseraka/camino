import { canReadActivitesTypesEmails } from './administrations'
import { User, UserNotNull } from '../roles'
import { ADMINISTRATION_IDS } from '../static/administrations'

export const testBlankUser: Omit<UserNotNull, 'role'> = {
  id: 'id',
  email: 'email',
  nom: 'nom',
  prenom: 'prenom'
}

test.each<[User, boolean]>([
  [{ ...testBlankUser, role: 'super' }, true],
  [
    {
      ...testBlankUser,
      role: 'admin',
      administrationId: ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON']
    },
    true
  ],
  [
    {
      ...testBlankUser,
      role: 'editeur',
      administrationId: ADMINISTRATION_IDS['DREAL - AUVERGNE-RHÔNE-ALPES - SIÈGE DE LYON']
    },
    true
  ],
  [{ ...testBlankUser, role: 'defaut' }, false]
])("pour une préfecture, emailsLecture est '$emailsLecture' pour un utilisateur $role et pour tous ses membres", async (user, emailsLecture) => {
  expect(canReadActivitesTypesEmails(user, 'pre-01053-01')).toBe(emailsLecture)
})
