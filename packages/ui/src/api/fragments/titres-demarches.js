import gql from 'graphql-tag'

import { fragmentDemarchesTitre } from './titre'
import { fragmentDemarcheType } from './metas'

export const fragmentDemarches = gql`
  fragment demarches on Demarche {
    id
    slug
    ordre
    titre {
      ...demarchesTitre
    }
    type {
      ...demarcheType
    }
    statutId
    phase {
      dateDebut
      dateFin
      phaseStatutId
    }

    modification
    suppression
  }

  ${fragmentDemarcheType}
  ${fragmentDemarchesTitre}
`
