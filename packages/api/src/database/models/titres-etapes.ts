import { Model, Pojo, QueryContext } from 'objection'

import { ITitreEtape, ITitrePoint } from '../../types'

import {
  heritagePropsFormat,
  heritageContenuFormat
} from './_format/titre-etape-heritage'
import { idGenerate } from './_format/id-create'
import EtapesTypes from './etapes-types'
import TitresDemarches from './titres-demarches'
import TitresPoints from './titres-points'
import Entreprises from './entreprises'
import Administrations from './administrations'
import Document from './documents'
import Communes from './communes'
import Forets from './forets'
import SDOMZones from './sdom-zones'
import Journaux from './journaux'
import SecteursMaritime from './secteurs_maritime'

export interface DBTitresEtapes extends ITitreEtape {
  archive: boolean
}
interface TitresEtapes extends DBTitresEtapes {}
class TitresEtapes extends Model {
  public static tableName = 'titresEtapes'

  public static jsonSchema = {
    type: 'object',
    // l’id est généré tout seul
    required: ['titreDemarcheId', 'date'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      slug: { type: 'string' },
      parentId: { type: ['string', 'null'] },
      titreDemarcheId: { type: 'string', maxLength: 128 },
      date: { type: ['string', 'null'] },
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      dateDebut: { type: ['string', 'null'] },
      dateFin: { type: ['string', 'null'] },
      duree: { type: ['integer', 'null'] },
      surface: { type: ['number', 'null'] },
      contenu: { type: ['object', 'null'] },
      incertitudes: { type: ['object', 'null'] },
      heritageContenu: { type: ['object', 'null'] },
      heritageProps: { type: ['object', 'null'] },
      decisionsAnnexesSections: {},
      decisionsAnnexesContenu: { type: ['object', 'null'] },
      archive: { type: 'boolean' },
      substances: { type: ['array', 'null'] }
    }
  }

  static relationMappings = () => ({
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: EtapesTypes,
      join: {
        from: 'titresEtapes.typeId',
        to: 'etapesTypes.id'
      }
    },

    demarche: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresDemarches,
      join: {
        from: 'titresEtapes.titreDemarcheId',
        to: 'titresDemarches.id'
      }
    },

    points: {
      relation: Model.HasManyRelation,
      modelClass: TitresPoints,
      join: {
        from: 'titresEtapes.id',
        to: 'titresPoints.titreEtapeId'
      }
    },

    titulaires: {
      relation: Model.ManyToManyRelation,
      modelClass: Entreprises,
      join: {
        from: 'titresEtapes.id',
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
        from: 'titresEtapes.id',
        through: {
          from: 'titresAmodiataires.titreEtapeId',
          to: 'titresAmodiataires.entrepriseId',
          extra: ['operateur']
        },
        to: 'entreprises.id'
      }
    },

    administrations: {
      relation: Model.ManyToManyRelation,
      modelClass: Administrations,
      join: {
        from: 'titresEtapes.id',
        through: {
          from: 'titresAdministrationsLocales.titreEtapeId',
          to: 'titresAdministrationsLocales.administrationId',
          extra: ['associee']
        },
        to: 'administrations.id'
      }
    },

    documents: {
      relation: Model.HasManyRelation,
      modelClass: Document,
      join: {
        from: 'titresEtapes.id',
        to: 'documents.titreEtapeId'
      }
    },

    justificatifs: {
      relation: Model.ManyToManyRelation,
      modelClass: Document,
      join: {
        from: 'titresEtapes.id',
        through: {
          from: 'titresEtapesJustificatifs.titreEtapeId',
          to: 'titresEtapesJustificatifs.documentId'
        },
        to: 'documents.id'
      }
    },

    communes: {
      relation: Model.ManyToManyRelation,
      modelClass: Communes,
      join: {
        from: 'titresEtapes.id',
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
        from: 'titresEtapes.id',
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
        from: 'titresEtapes.id',
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
        from: 'titresEtapes.id',
        through: {
          from: 'titres__secteurs_maritime.titre_etape_id',
          to: 'titres__secteurs_maritime.secteur_maritime_id'
        },
        to: 'secteurs_maritime.id'
      }
    },
    journaux: {
      relation: Model.HasManyRelation,
      modelClass: Journaux,
      join: {
        from: 'titresEtapes.id',
        to: 'journaux.elementId'
      }
    }
  })

  async $beforeInsert(context: QueryContext) {
    if (!this.id) {
      this.id = idGenerate()
    }

    if (!this.slug && this.titreDemarcheId && this.typeId) {
      this.slug = `${this.titreDemarcheId}-${this.typeId}99`
    }

    return super.$beforeInsert(context)
  }

  async $afterFind(context: any) {
    if (context.fetchHeritage && this.heritageProps) {
      this.heritageProps = await heritagePropsFormat(this.heritageProps)
    }

    if (context.fetchHeritage && this.heritageContenu) {
      this.heritageContenu = await heritageContenuFormat(this.heritageContenu)
    }

    return this
  }

  public $formatDatabaseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    delete json.deposable
    delete json.sectionsSpecifiques
    delete json.justificatifsTypesSpecifiques
    json = super.$formatDatabaseJson(json)

    return json
  }

  public $parseJson(json: Pojo) {
    if (json.points) {
      json.points.forEach((point: ITitrePoint) => {
        point.titreEtapeId = json.id
      })
    }

    if (json.administrationsIds) {
      json.administrations = json.administrationsIds.map((id: string) => ({
        id
      }))
      delete json.administrationsIds
    }

    if (json.amodiatairesIds) {
      json.amodiataires = json.amodiatairesIds.map((id: string) => ({ id }))
      delete json.amodiatairesIds
    }

    if (json.titulairesIds) {
      json.titulaires = json.titulairesIds.map((id: string) => ({ id }))
      delete json.titulairesIds
    }

    if (json.substancesIds) {
      json.substances = json.substancesIds.map((id: string) => ({ id }))

      delete json.substancesIds
    }

    if (json.incertitudes) {
      Object.keys(json.incertitudes).forEach(id => {
        if (
          !json.incertitudes[id] ||
          !(json[id] || json[id] === 0) ||
          (Array.isArray(json[id]) && !json[id].length)
        ) {
          delete json.incertitudes[id]
        }
      })

      if (!Object.keys(json.incertitudes).length) {
        json.incertitudes = null
      }
    }

    delete json.geojsonMultiPolygon
    delete json.geojsonPoints
    delete json.modification
    delete json.suppression
    delete json.deposable
    delete json.sectionsTypesSpecifiques
    delete json.justificatifsTypesSpecifiques
    json = super.$parseJson(json)

    return json
  }
}

export default TitresEtapes
