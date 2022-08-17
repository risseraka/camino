import { Model } from 'objection'
import { ITitreTypeDemarcheTypeEtapeType } from '../../types'
import EtapesTypes from './etapes-types'
import DemarchesTypes from './demarches-types'
import TitresTypesDemarchesTypesEtapesTypesDocumentsTypes from './titres-types--demarches-types-etapes-types-documents-types'
import TitresTypesDemarchesTypesEtapesTypesJustificatifsTypes from './titres-types--demarches-types-etapes-types-justificatifs-types'

interface TitresTypesDemarchesTypesEtapesTypes
  extends ITitreTypeDemarcheTypeEtapeType {}

class TitresTypesDemarchesTypesEtapesTypes extends Model {
  public static tableName = 'titresTypes__demarchesTypes__etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'demarcheTypeId', 'etapeTypeId', 'ordre'],

    properties: {
      titreTypeId: { type: 'string', maxLength: 3 },
      demarcheTypeId: { type: 'string', maxLength: 3 },
      etapeTypeId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      sections: {}
    }
  }

  public static idColumn = ['titreTypeId', 'demarcheTypeId', 'etapeTypeId']

  static relationMappings = () => ({
    etapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: EtapesTypes,
      join: {
        from: 'titresTypes__demarchesTypes__etapesTypes.etapeTypeId',
        to: 'etapesTypes.id'
      }
    },

    demarcheType: {
      relation: Model.BelongsToOneRelation,
      modelClass: DemarchesTypes,
      join: {
        from: 'titresTypes__demarchesTypes__etapesTypes.demarcheTypeId',
        to: 'demarchesTypes.id'
      }
    },

    documentsTypes: {
      relation: Model.HasManyRelation,
      modelClass: TitresTypesDemarchesTypesEtapesTypesDocumentsTypes,
      join: {
        from: [
          'titresTypes__demarchesTypes__etapesTypes.titreTypeId',
          'titresTypes__demarchesTypes__etapesTypes.demarcheTypeId',
          'titresTypes__demarchesTypes__etapesTypes.etapeTypeId'
        ],
        to: 'titresTypes__demarchesTypes__etapesTypes__documentsTypes.documentTypeId'
      }
    },

    justificatifsTypes: {
      relation: Model.HasManyRelation,
      modelClass: TitresTypesDemarchesTypesEtapesTypesJustificatifsTypes,
      join: {
        from: [
          'titresTypes__demarchesTypes__etapesTypes.titreTypeId',
          'titresTypes__demarchesTypes__etapesTypes.demarcheTypeId',
          'titresTypes__demarchesTypes__etapesTypes.etapeTypeId'
        ],
        to: 'titresTypes__demarchesTypes__etapesTypes__justificatifsT.documentTypeId'
      }
    }
  })
}

export default TitresTypesDemarchesTypesEtapesTypes
