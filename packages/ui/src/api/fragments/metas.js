import gql from 'graphql-tag'

const fragmentTitreTypeType = gql`
  fragment titreTypeType on TitreTypeType {
    id
    nom
    description
    ordre
  }
`

const fragmentTitreStatut = gql`
  fragment titreStatut on TitreStatut {
    id
    nom
    description
    couleur
    ordre
  }
`

const fragmentTitreType = gql`
  fragment titreType on TitreType {
    id
    typeId
    domaineId
    type {
      ...titreTypeType
    }
    domaine {
      id
      nom
    }
    contenuIds
  }
  ${fragmentTitreTypeType}
`

const fragmentDemarcheType = gql`
  fragment demarcheType on DemarcheType {
    id
    nom
    description
    ordre
    duree
    points
    substances
    titulaires
    exception
    renouvelable
    demarchesCreation
    titreTypeId
    travaux
  }
`

const fragmentDocumentType = gql`
  fragment documentType on DocumentType {
    id
    nom
    optionnel
    description
  }
`

const fragmentEtapeType = gql`
  fragment etapeType on EtapeType {
    id
    parentId
    nom
    description
    ordre
    sections
    legalLien
    legalRef
    dateDebut
    dateFin
    fondamentale
    unique
    acceptationAuto
    publicLecture
    entreprisesLecture
    etapesCreation
    documentsTypes {
      ...documentType
    }
    justificatifsTypes {
      ...documentType
    }
  }

  ${fragmentDocumentType}
`

const fragmentTitreTypeTitreStatut = gql`
  fragment titreTypeTitreStatut on TitreTypeTitreStatut {
    titreTypeId
    titreStatutId
    publicLecture
  }
`

const fragmentTitreTypeDemarcheType = gql`
  fragment titreTypeDemarcheType on TitreTypeDemarcheType {
    titreTypeId
    demarcheTypeId
    dureeMax
    acceptationImplicite
    delaiImplicite
    delaiRecours
    legalRef
    legaleLien
    dateDebut
    dateFin
  }
`

const fragmentTitreTypeDemarcheTypeEtapeType = gql`
  fragment titreTypeDemarcheTypeEtapeType on TitreTypeDemarcheTypeEtapeType {
    titreTypeId
    demarcheTypeId
    etapeTypeId
    ordre
    sections
  }
`

const fragmentTitreTypeDemarcheTypeEtapeTypeDocumentType = gql`
  fragment titreTypeDemarcheTypeEtapeTypeDocumentType on TitreTypeDemarcheTypeEtapeTypeDocumentType {
    titreTypeId
    demarcheTypeId
    etapeTypeId
    documentTypeId
    optionnel
    description
  }
`

const fragmentEtapeTypeDocumentType = gql`
  fragment etapeTypeDocumentType on EtapeTypeDocumentType {
    etapeTypeId
    documentTypeId
    optionnel
    description
  }
`

const fragmentEtapeTypeJustificatifType = gql`
  fragment etapeTypeJustificatifType on EtapeTypeJustificatifType {
    etapeTypeId
    documentTypeId
    optionnel
    description
  }
`

export {
  fragmentTitreTypeType,
  fragmentTitreStatut,
  fragmentEtapeType,
  fragmentDemarcheType,
  fragmentTitreType,
  fragmentDocumentType,
  fragmentTitreTypeTitreStatut,
  fragmentTitreTypeDemarcheType,
  fragmentTitreTypeDemarcheTypeEtapeType,
  fragmentTitreTypeDemarcheTypeEtapeTypeDocumentType,
  fragmentEtapeTypeDocumentType,
  fragmentEtapeTypeJustificatifType
}
