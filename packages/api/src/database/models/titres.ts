import { Model, Pojo, QueryContext, ref } from 'objection'

import { ITitre } from '../../types'

import Administrations from './administrations'
import Communes from './communes'
import Domaines from './domaines'
import Entreprises from './entreprises'
import TitresDemarches from './titres-demarches'
import TitresEtapes from './titres-etapes'
import TitresPoints from './titres-points'
import Types from './titres-types'
import Forets from './forets'

import { titreInsertFormat } from './_format/titre-insert'
import { titreContenuFormat } from './_format/titre-contenu'
import { idGenerate } from './_format/id-create'
import slugify from '@sindresorhus/slugify'
import cryptoRandomString from 'crypto-random-string'
import SDOMZones from './sdom-zones'
import TitresActivites from './titres-activites'
import SecteursMaritime from './secteurs_maritime'

export interface DBTitre extends ITitre {
  archive: boolean
}

interface Titres extends DBTitre {}

class Titres extends Model {
  public static tableName = 'titres'

  public static jsonSchema = {
    type: 'object',
    required: ['nom', 'domaineId', 'typeId'],
    properties: {
      id: { type: 'string' },
      slug: { type: 'string' },
      nom: { type: 'string' },
      domaineId: { type: 'string', maxLength: 1 },
      typeId: { type: 'string', maxLength: 3 },
      titreStatutId: { type: 'string', maxLength: 3 },
      dateDebut: { type: ['string', 'null'] },
      dateFin: { type: ['string', 'null'] },
      dateDemande: { type: ['string', 'null'] },
      contenusTitreEtapesIds: { type: ['object', 'null'] },
      propsTitreEtapesIds: { type: 'object' },
      coordonnees: {
        type: ['object', 'null'],
        properties: { x: { type: 'number' }, y: { type: 'number' } }
      },
      doublonTitreId: { type: ['string', 'null'] },
      archive: { type: 'boolean' },
      references: { type: ['array', 'null'] }
    }
  }

  static relationMappings = () => ({
    domaine: {
      relation: Model.BelongsToOneRelation,
      modelClass: Domaines,
      join: { from: 'titres.domaineId', to: 'domaines.id' }
    },

    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: Types,
      join: { from: 'titres.typeId', to: 'titresTypes.id' }
    },

    demarches: {
      relation: Model.HasManyRelation,
      modelClass: TitresDemarches,
      join: { from: 'titres.id', to: 'titresDemarches.titreId' }
    },

    surfaceEtape: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresEtapes,
      join: {
        from: ref('titres.propsTitreEtapesIds:surface').castText(),
        to: 'titresEtapes.id'
      }
    },

    substancesEtape: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresEtapes,
      join: {
        from: ref('titres.propsTitreEtapesIds:substances').castText(),
        to: 'titresEtapes.id'
      }
    },

    points: {
      relation: Model.HasManyRelation,
      modelClass: TitresPoints,
      join: {
        from: ref('titres.propsTitreEtapesIds:points').castText(),
        to: 'titresPoints.titreEtapeId'
      }
    },

    titulaires: {
      relation: Model.ManyToManyRelation,
      modelClass: Entreprises,
      join: {
        from: ref('titres.propsTitreEtapesIds:titulaires').castText(),
        through: {
          from: 'titresTitulaires.titreEtapeId',
          to: 'titresTitulaires.entrepriseId',
          extra: ['operateur']
        },
        to: 'entreprises.id'
      }
    },

    amodiataires: {
      relation: Model.ManyToManyRelation,
      modelClass: Entreprises,
      join: {
        from: ref('titres.propsTitreEtapesIds:amodiataires').castText(),
        through: {
          from: 'titresAmodiataires.titreEtapeId',
          to: 'titresAmodiataires.entrepriseId',
          extra: ['operateur']
        },
        to: 'entreprises.id'
      }
    },

    // administrations directement ajoutées sur le titre
    titresAdministrations: {
      relation: Model.ManyToManyRelation,
      modelClass: Administrations,
      join: {
        from: 'titres.id',
        through: {
          from: 'titresAdministrations.titreId',
          to: 'titresAdministrations.administrationId'
        },
        to: 'administrations.id'
      }
    },

    administrationsGestionnaires: {
      relation: Model.ManyToManyRelation,
      modelClass: Administrations,
      // On ne peut pas utiliser directement administrations__titresTypes car on ne peut pas sélectionner les lignes où le booléen
      // gestionnaire est à vrai
      // https://github.com/Vincit/objection/issues/1356
      join: {
        from: 'titres.id',
        through: {
          from: ref('titresAdministrationsGestionnaires.titreId').castText(),
          to: 'titresAdministrationsGestionnaires.administrationId',
          extra: ['associee']
        },
        to: 'administrations.id'
      }
    },

    // adminitrations calculées via leur région et département
    administrationsLocales: {
      relation: Model.ManyToManyRelation,
      modelClass: Administrations,
      join: {
        from: ref('titres.propsTitreEtapesIds:administrations').castText(),
        through: {
          from: 'titresAdministrationsLocales.titreEtapeId',
          to: 'titresAdministrationsLocales.administrationId',
          extra: ['associee']
        },
        to: 'administrations.id'
      }
    },

    communes: {
      relation: Model.ManyToManyRelation,
      modelClass: Communes,
      join: {
        // les communes sont générées sur les étapes qui ont des points
        from: ref('titres.propsTitreEtapesIds:points').castText(),
        through: {
          from: 'titresCommunes.titreEtapeId',
          to: 'titresCommunes.communeId',
          extra: ['surface']
        },
        to: 'communes.id'
      }
    },

    forets: {
      relation: Model.ManyToManyRelation,
      modelClass: Forets,
      join: {
        // les forêts sont générées sur les étapes qui ont des points
        from: ref('titres.propsTitreEtapesIds:points').castText(),
        through: {
          from: 'titresForets.titreEtapeId',
          to: 'titresForets.foretId'
        },
        to: 'forets.id'
      }
    },
    sdomZones: {
      relation: Model.ManyToManyRelation,
      modelClass: SDOMZones,
      join: {
        from: ref('titres.propsTitreEtapesIds:points').castText(),
        through: {
          from: 'titres__sdomZones.titreEtapeId',
          to: 'titres__sdomZones.sdomZoneId'
        },
        to: 'sdomZones.id'
      }
    },
    secteursMaritime: {
      relation: Model.ManyToManyRelation,
      modelClass: SecteursMaritime,
      join: {
        from: ref('titres.propsTitreEtapesIds:points').castText(),
        through: {
          from: 'titres__secteurs_maritime.titreEtapeId',
          to: 'titres__secteurs_maritime.secteurMaritimeId'
        },
        to: 'secteurs_maritime.id'
      }
    },

    activites: {
      relation: Model.HasManyRelation,
      modelClass: TitresActivites,
      join: { from: 'titres.id', to: 'titresActivites.titreId' }
    },

    doublonTitre: {
      relation: Model.BelongsToOneRelation,
      modelClass: Titres,
      join: { from: 'titres.doublonTitreId', to: 'titres.id' }
    }
  })

  async $beforeInsert(context: QueryContext) {
    if (!this.id) {
      this.id = idGenerate()
    }

    if (!this.slug && this.domaineId && this.typeId && this.nom) {
      this.slug = `${this.domaineId}-${this.typeId.slice(0, -1)}-${slugify(
        this.nom
      )}-${cryptoRandomString({ length: 4 })}`
    }

    return super.$beforeInsert(context)
  }

  $afterFind() {
    if (this.contenusTitreEtapesIds) {
      this.contenu = titreContenuFormat(
        this.contenusTitreEtapesIds,
        this.demarches
      )
    }

    if (this.substancesEtape === null) {
      this.substances = []
    } else if (this.substancesEtape === undefined) {
      this.substances = undefined
    } else {
      this.substances = this.substancesEtape.substances
    }
  }

  public $parseJson(json: Pojo) {
    json = titreInsertFormat(json)
    json = super.$parseJson(json)

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    if (json.coordonnees) {
      json.coordonnees = `${json.coordonnees.x},${json.coordonnees.y}`
    }

    json = titreInsertFormat(json)
    json = super.$formatDatabaseJson(json)

    return json
  }
}

export default Titres
