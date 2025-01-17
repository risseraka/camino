import gql from 'graphql-tag'
import { apiGraphQLFetch } from './_client'

import { fragmentAdministration } from './fragments/administration'

const administrationMetas = apiGraphQLFetch(
  gql`
    query AdministrationMetas {
      activitesTypes {
        id
        nom
      }
    }
  `
)

const administrationPermissionsMetas = apiGraphQLFetch(
  gql`
    query AdministrationPermissionsMetas {
      domaines {
        id
        nom
        titresTypes {
          id
          type {
            id
            nom
          }
        }
      }

      statuts {
        id
        nom
      }

      etapesTypes {
        id
        nom
      }
    }
  `
)

const administration = apiGraphQLFetch(gql`
  query Administration($id: ID!) {
    administration(id: $id) {
      ...administration
    }

    administrationActivitesTypesEmails(id: $id) {
      email
      activiteTypeId
    }
  }

  ${fragmentAdministration}
`)

const administrationActiviteTypeUpdate = apiGraphQLFetch(gql`
  mutation AdministrationActiviteTypeModifier(
    $administrationActiviteType: InputAdministrationActiviteType!
  ) {
    administrationActiviteTypeModifier(
      administrationActiviteType: $administrationActiviteType
    ) {
      ...administration
    }
  }

  ${fragmentAdministration}
`)

const administrationActiviteTypeEmailUpdate = apiGraphQLFetch(gql`
  mutation AdministrationActiviteTypeEmailCreer(
    $administrationActiviteTypeEmail: InputAdministrationActiviteTypeEmail!
  ) {
    administrationActiviteTypeEmailCreer(
      administrationActiviteTypeEmail: $administrationActiviteTypeEmail
    ) {
      id
    }
  }
`)

const administrationActiviteTypeEmailDelete = apiGraphQLFetch(gql`
  mutation AdministrationActiviteTypeEmailSupprimer(
    $administrationActiviteTypeEmail: InputAdministrationActiviteTypeEmail!
  ) {
    administrationActiviteTypeEmailSupprimer(
      administrationActiviteTypeEmail: $administrationActiviteTypeEmail
    ) {
      id
    }
  }
`)

const administrationTitreTypeTitreStatutUpdate = apiGraphQLFetch(gql`
  mutation AdministrationTitreTypeTitreStatutModifier(
    $administrationTitreTypeTitreStatut: InputAdministrationTitreTypeTitreStatut!
  ) {
    administrationTitreTypeTitreStatutModifier(
      administrationTitreTypeTitreStatut: $administrationTitreTypeTitreStatut
    ) {
      ...administration
    }
  }

  ${fragmentAdministration}
`)

const administrationTitreTypeEtapeTypeUpdate = apiGraphQLFetch(gql`
  mutation AdministrationTitreTypeEtapeTypeModifier(
    $administrationTitreTypeEtapeType: InputAdministrationTitreTypeEtapeType!
  ) {
    administrationTitreTypeEtapeTypeModifier(
      administrationTitreTypeEtapeType: $administrationTitreTypeEtapeType
    ) {
      ...administration
    }
  }

  ${fragmentAdministration}
`)

export {
  administrationMetas,
  administration,
  administrationTitreTypeTitreStatutUpdate,
  administrationTitreTypeEtapeTypeUpdate,
  administrationActiviteTypeUpdate,
  administrationActiviteTypeEmailUpdate,
  administrationActiviteTypeEmailDelete,
  administrationPermissionsMetas
}
