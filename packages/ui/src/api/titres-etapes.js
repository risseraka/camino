import gql from 'graphql-tag'
import { apiGraphQLFetch } from './_client'

import { fragmentEtape, fragmentEtapeHeritage } from './fragments/titre-etape'
import { fragmentEtapeMetasEntreprises } from './fragments/entreprises'

const titreEtapeEtapesTypes = apiGraphQLFetch(
  gql`
    query TitreEtapeEtapesTypes(
      $titreDemarcheId: ID!
      $date: String!
      $id: ID
    ) {
      etapesTypes(
        titreDemarcheId: $titreDemarcheId
        titreEtapeId: $id
        date: $date
      ) {
        id
        nom
        description
        fondamentale
        etapesCreation
      }
    }
  `
)

const titreEtapeMetas = apiGraphQLFetch(
  gql`
    query TitreEtapeMetas($titreDemarcheId: ID!, $id: ID) {
      demarche(id: $titreDemarcheId) {
        id
        description
        type {
          travaux
          nom
        }
        titre {
          id
          slug
          nom
          domaine {
            id
          }
          type {
            id
            type {
              id
            }
          }
        }
      }

      entreprises(archive: false, etapeId: $id) {
        elements {
          ...etapeMetasEntreprises
        }
      }
    }

    ${fragmentEtapeMetasEntreprises}
  `
)

const etape = apiGraphQLFetch(gql`
  query Etape($id: ID!) {
    etape(id: $id) {
      ...etape
    }
  }

  ${fragmentEtape}
`)

const etapeHeritage = apiGraphQLFetch(gql`
  query EtapeHeritage($titreDemarcheId: ID!, $date: String!, $typeId: ID!) {
    etapeHeritage(
      titreDemarcheId: $titreDemarcheId
      date: $date
      typeId: $typeId
    ) {
      ...etapeHeritage
    }
  }

  ${fragmentEtapeHeritage}
`)

const etapeCreer = apiGraphQLFetch(gql`
  mutation EtapeCreer($etape: InputEtapeCreation!) {
    etapeCreer(etape: $etape) {
      id
    }
  }
`)

const etapeModifier = apiGraphQLFetch(gql`
  mutation EtapeModifier($etape: InputEtapeModification!) {
    etapeModifier(etape: $etape) {
      id
    }
  }
`)

const etapeSupprimer = apiGraphQLFetch(gql`
  mutation EtapeSupprimer($id: ID!) {
    etapeSupprimer(id: $id) {
      slug
    }
  }
`)

const etapeDeposer = apiGraphQLFetch(gql`
  mutation EtapeDeposer($id: ID!) {
    etapeDeposer(id: $id) {
      slug
    }
  }
`)

export {
  etape,
  etapeHeritage,
  titreEtapeMetas,
  titreEtapeEtapesTypes,
  etapeCreer,
  etapeModifier,
  etapeSupprimer,
  etapeDeposer
}
