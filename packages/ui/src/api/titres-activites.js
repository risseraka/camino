import gql from 'graphql-tag'
import { apiGraphQLFetch } from './_client'

import { fragmentActivites, fragmentActivite } from './fragments/titre-activite'

const activiteModifier = apiGraphQLFetch(gql`
  mutation ActiviteModifier($activite: InputActiviteModification!) {
    activiteModifier(activite: $activite) {
      id
    }
  }
`)

const activiteDeposer = apiGraphQLFetch(gql`
  mutation ActiviteDeposer($id: ID!) {
    activiteDeposer(id: $id) {
      id
    }
  }
`)

const activiteSupprimer = apiGraphQLFetch(gql`
  mutation ActiviteSupprimer($id: ID!) {
    activiteSupprimer(id: $id) {
      id
    }
  }
`)

const activites = apiGraphQLFetch(
  gql`
    query Activites(
      $intervalle: Int
      $page: Int
      $colonne: String
      $ordre: String
      $typesIds: [ID]
      $statutsIds: [ID]
      $annees: [Int]
      $titresTypesIds: [ID]
      $titresDomainesIds: [ID]
      $titresStatutsIds: [ID]
      $titresIds: [String]
      $titresEntreprisesIds: [String]
      $titresSubstancesIds: [String]
      $titresReferences: String
      $titresTerritoires: String
    ) {
      activites(
        intervalle: $intervalle
        page: $page
        colonne: $colonne
        ordre: $ordre
        typesIds: $typesIds
        statutsIds: $statutsIds
        annees: $annees
        titresTypesIds: $titresTypesIds
        titresDomainesIds: $titresDomainesIds
        titresStatutsIds: $titresStatutsIds
        titresIds: $titresIds
        titresEntreprisesIds: $titresEntreprisesIds
        titresSubstancesIds: $titresSubstancesIds
        titresReferences: $titresReferences
        titresTerritoires: $titresTerritoires
      ) {
        elements {
          ...activites
        }
        total
      }
    }

    ${fragmentActivites}
  `
)

const activite = apiGraphQLFetch(
  gql`
    query Activite($id: ID!) {
      activite(id: $id) {
        ...activite
      }
    }

    ${fragmentActivite}
  `
)

export {
  activite,
  activites,
  activiteModifier,
  activiteSupprimer,
  activiteDeposer
}
