import { dbManager } from '../../../tests/db-manager'
import { Knex } from 'knex'
import Titres from '../../database/models/titres'
import TitresDemarches from '../../database/models/titres-demarches'
import TitresEtapes from '../../database/models/titres-etapes'
import TitresPoints from '../../database/models/titres-points'
import { titresEtapesAreasUpdate } from './titres-etapes-areas-update'
import TitresCommunes from '../../database/models/titres-communes'
import {
  BaisieuxPerimetre,
  foret2BranchesPerimetre,
  foretReginaPerimetre,
  SaintEliePerimetre,
  SinnamaryPerimetre
} from './__mocks__/titres-etapes-areas-update'
import TitresForets from '../../database/models/titres-forets'
import TitresSDOMZones from '../../database/models/titres--sdom-zones'
import { newDemarcheId } from '../../database/models/_format/id-create'
import { SDOMZoneIds } from 'camino-common/src/static/sdom'

console.info = jest.fn()
console.error = jest.fn()
let knex: Knex | undefined
beforeAll(async () => {
  knex = await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.closeKnex()
})

describe('titresEtapesAreasUpdate', () => {
  test('met à jour les communes, forêts et zone du SDOM sur une étape', async () => {
    const baisieuxId = '59044'
    const saintElieId = '97358'
    await knex!.raw(
      `insert into communes (nom, id, departement_id) values ('Saint-Élie', '${saintElieId}', '973')`
    )
    await knex!.raw(
      `insert into communes (nom, id, departement_id) values ('Baisieux', '${baisieuxId}', '59')`
    )
    await knex!.raw(
      `insert into communes (nom, id, departement_id) values ('Sinnamary', '97312', '973')`
    )
    await knex!.raw(
      `insert into communes_postgis (id, geometry) values ('${saintElieId}','${SaintEliePerimetre}')`
    )
    await knex!.raw(
      `insert into communes_postgis (id, geometry) values ('${baisieuxId}', '${BaisieuxPerimetre}')`
    )
    await knex!.raw(
      `insert into communes_postgis (id, geometry) values ('97312', '${SinnamaryPerimetre}')`
    )

    const reginaId = 'FRG'
    const deuxBranchesId = 'DBR'
    await knex!.raw(
      `insert into forets (nom, id) values ('Deux Branches', '${deuxBranchesId}')`
    )
    await knex!.raw(
      `insert into forets (nom, id) values ('Regina', '${reginaId}')`
    )
    await knex!.raw(
      `insert into forets_postgis (id, geometry) values ('${deuxBranchesId}','${foret2BranchesPerimetre}')`
    )
    await knex!.raw(
      `insert into forets_postgis (id, geometry) values ('${reginaId}','${foretReginaPerimetre}')`
    )

    // Pour simplifier le test, on utilise des forêts en tant que zone de sdom
    await knex!.raw(
      `insert into sdom_zones (nom, id) values ('Zone 1', '${SDOMZoneIds.Zone1}')`
    )
    await knex!.raw(
      `insert into sdom_zones (nom, id) values ('Zone 2', '${SDOMZoneIds.Zone2}')`
    )
    await knex!.raw(
      `insert into sdom_zones_postgis (id, geometry) values ('${SDOMZoneIds.Zone1}','${foret2BranchesPerimetre}')`
    )
    await knex!.raw(
      `insert into sdom_zones_postgis (id, geometry) values ('${SDOMZoneIds.Zone2}','${foretReginaPerimetre}')`
    )

    const titreId = 'titreIdUniquePourMiseAJourAreas'
    await Titres.query().insert({
      id: titreId,
      slug: `slug-${titreId}`,
      nom: `nom-${titreId}`,
      titreStatutId: 'val',
      domaineId: 'm',
      typeId: 'arm'
    })

    const titreDemarcheId = newDemarcheId(
      'titreDemarcheIdUniquePourMiseAJourAreas'
    )
    await TitresDemarches.query().insert([
      {
        id: titreDemarcheId,
        typeId: 'oct',
        statutId: 'eco',
        titreId,
        archive: false
      }
    ])

    const titreEtapeId = 'titreEtapeIdUniquePourMiseAJourAreas'
    await TitresEtapes.query().insert([
      {
        id: titreEtapeId,
        date: '2022-03-09',
        typeId: 'mfr',
        statutId: 'aco',
        titreDemarcheId,
        archive: false
      }
    ])

    await TitresPoints.query().insert([
      {
        titreEtapeId,
        groupe: 1,
        contour: 1,
        point: 1,
        coordonnees: { x: -53.16822754488772, y: 5.02935254143807 }
      },
      {
        titreEtapeId,
        groupe: 1,
        contour: 1,
        point: 2,
        coordonnees: { x: -53.15913163720232, y: 5.029382753429523 }
      },
      {
        titreEtapeId,
        groupe: 1,
        contour: 1,
        point: 3,
        coordonnees: { x: -53.15910186841349, y: 5.020342601941031 }
      },
      {
        titreEtapeId,
        groupe: 1,
        contour: 1,
        point: 4,
        coordonnees: { x: -53.168197650929095, y: 5.02031244452273 }
      }
    ])

    // ajoute baisieux et saintElie à l’étape
    await TitresCommunes.query().insert({
      titreEtapeId,
      communeId: baisieuxId,
      surface: 12
    })
    await TitresCommunes.query().insert({
      titreEtapeId,
      communeId: saintElieId,
      surface: 12
    })

    // ajoute la forêt Regina
    await TitresForets.query().insert({ titreEtapeId, foretId: reginaId })

    // ajoute la zone 2
    await TitresSDOMZones.query().insert({
      titreEtapeId,
      sdomZoneId: SDOMZoneIds.Zone2
    })

    await titresEtapesAreasUpdate([titreEtapeId])

    expect(
      await TitresCommunes.query().where('titreEtapeId', titreEtapeId)
    ).toMatchSnapshot()
    expect(
      await TitresForets.query().where('titreEtapeId', titreEtapeId)
    ).toMatchSnapshot()
    expect(
      await TitresSDOMZones.query().where('titreEtapeId', titreEtapeId)
    ).toMatchSnapshot()
    expect(
      await TitresEtapes.query()
        .where('id', titreEtapeId)
        .withGraphFetched('[sdomZones, forets, communes]')
    ).toMatchSnapshot()

    await Titres.query()
      .patch({ propsTitreEtapesIds: { points: titreEtapeId } })
      .where({ id: titreId })
    expect(
      await Titres.query()
        .where('id', titreId)
        .withGraphFetched('[sdomZones, forets, communes]')
    ).toMatchSnapshot()
  })
})
