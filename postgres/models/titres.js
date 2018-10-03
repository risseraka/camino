const { Model } = require('objection')
const Domaines = require('./domaines')
const Types = require('./types')
const Statuts = require('./statuts')
const TitresDemarches = require('./titres-demarches')
const TitresEtapes = require('./titres-etapes')
const Substances = require('./substances')
const TitresPoints = require('./titres-points')
const Entreprises = require('./entreprises')
const Administrations = require('./administrations')

class Titres extends Model {
  static get tableName() {
    return 'titres'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaineId', 'typeId', 'statutId'],
      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        domaineId: { type: 'string', maxLength: 1 },
        typeId: { type: 'string', maxLength: 3 },
        statutId: { type: 'string', maxLength: 3 },
        references: { type: 'json' },
        substancesTitreEtapeId: { type: 'string', maxLength: 128 },
        pointsTitreEtapeId: { type: 'string', maxLength: 128 },
        titulairesTitreEtapeId: { type: 'string', maxLength: 128 },
        amodiatairesTitreEtapeId: { type: 'string', maxLength: 128 },
        administrationsTitreEtapeId: { type: 'string', maxLength: 128 },
        surfaceTitreEtapeId: { type: 'string', maxLength: 128 },
        volumeTitreEtapeId: { type: 'string', maxLength: 128 }
      }
    }
  }

  static get relationMappings() {
    return {
      domaine: {
        relation: Model.BelongsToOneRelation,
        modelClass: Domaines,
        join: {
          from: 'titres.domaineId',
          to: 'domaines.id'
        }
      },
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Types,
        join: {
          from: 'titres.typeId',
          to: 'types.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: Statuts,
        join: {
          from: 'titres.statutId',
          to: 'statuts.id'
        }
      },
      demarches: {
        relation: Model.HasManyRelation,
        modelClass: TitresDemarches,
        join: {
          from: 'titres.id',
          to: 'titresDemarches.titreId'
        }
      },
      // fix: faire remonter uniquement la valeur
      surfaceEtape: {
        relation: Model.BelongsToOneRelation,
        modelClass: TitresEtapes,
        join: {
          from: 'titres.surfaceTitreEtapeId',
          to: 'titresEtapes.id'
        }
      },
      volumeEtape: {
        relation: Model.BelongsToOneRelation,
        modelClass: TitresEtapes,
        join: {
          from: 'titres.volumeTitreEtapeId',
          to: 'titresEtapes.id'
        }
      },
      substances: {
        relation: Model.ManyToManyRelation,
        modelClass: Substances,
        join: {
          from: 'titres.substancesTitreEtapeId',
          through: {
            from: 'titresSubstances.titreEtapeId',
            to: 'titresSubstances.substanceId',
            extra: ['ordre', 'connexe']
          },
          to: 'substances.id'
        }
      },
      points: {
        relation: Model.HasManyRelation,
        modelClass: TitresPoints,
        join: {
          from: 'titres.pointsTitreEtapeId',
          to: 'titresPoints.titreEtapeId'
        }
      },
      titulaires: {
        relation: Model.ManyToManyRelation,
        modelClass: Entreprises,
        join: {
          from: 'titres.titulairesTitreEtapeid',
          through: {
            from: 'titresTitulaires.titreEtapeId',
            to: 'titresTitulaires.entrepriseId'
          },
          to: 'entreprises.id'
        }
      },
      amodiataires: {
        relation: Model.ManyToManyRelation,
        modelClass: Entreprises,
        join: {
          from: 'titres.amodiatairesTitreEtapeid',
          through: {
            from: 'titresAmodiataires.titreEtapeId',
            to: 'titresAmodiataires.entrepriseId'
          },
          to: 'entreprises.id'
        }
      },
      administrations: {
        relation: Model.ManyToManyRelation,
        modelClass: Administrations,
        join: {
          from: 'titres.administrationsTitreEtapeid',
          through: {
            from: 'titresAdministrations.titreEtapeId',
            to: 'titresAdministrations.administrationId'
          },
          to: 'administrations.id'
        }
      }
    }
  }
}

module.exports = Titres
