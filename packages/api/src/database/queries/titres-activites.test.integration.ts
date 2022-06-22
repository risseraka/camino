import { titresActivitesGet } from './titres-activites'
import TitresActivites from '../models/titres-activites'
import { dbManager } from '../../../tests/db-manager'
import { idGenerate } from '../models/_format/id-create'
import Titres from '../models/titres'
import AdministrationsTitresTypes from '../models/administrations-titres-types'
import { UserNotNull } from 'camino-common/src/roles'
console.info = jest.fn()
console.error = jest.fn()
beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.closeKnex()
})
describe('teste les requêtes sur les activités', () => {
  test('vérifie que le filtrage fonctionne pour les administrations', async () => {
    await TitresActivites.query().delete()

    const titreId = idGenerate()

    await Titres.query().insert({
      id: titreId,
      nom: idGenerate(),
      titreStatutId: 'val',
      domaineId: 'm',
      typeId: 'arm'
    })

    const titreActiviteId = 'titreActiviteId'
    await TitresActivites.query().insertGraph({
      id: titreActiviteId,
      typeId: 'grx',
      titreId,
      date: '',
      statutId: 'dep',
      periodeId: 1,
      annee: 2000
    })

    await AdministrationsTitresTypes.query().delete()
    await AdministrationsTitresTypes.query().insert({
      administrationId: 'min-mtes-dgaln-01',
      titreTypeId: 'arm',
      gestionnaire: true
    })

    const adminDGALN: UserNotNull = {
      id: 'utilisateurId',
      role: 'admin',
      nom: 'utilisateurNom',
      prenom: 'utilisateurPrenom',
      email: 'utilisateurEmail',
      administrationId: 'min-mtes-dgaln-01'
    }

    const actual = await titresActivitesGet(
      {},
      { fields: { id: {} } },
      adminDGALN
    )

    expect(actual).toHaveLength(1)
    expect(actual[0].id).toEqual(titreActiviteId)
  })
})
