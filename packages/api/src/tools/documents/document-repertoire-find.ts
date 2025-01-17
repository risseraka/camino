import { IDocument, IDocumentRepertoire } from '../../types'

export const documentRepertoireFind = (
  document: IDocument
): IDocumentRepertoire => {
  if (document.titreActiviteId) {
    return 'activites'
  }

  if (document.titreEtapeId) {
    return 'demarches'
  }

  if (document.entrepriseId) {
    return 'entreprises'
  }

  return 'tmp'
}
