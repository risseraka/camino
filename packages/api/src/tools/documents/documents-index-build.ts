import { IDocument } from '../../types'
import { IndexFile } from './_types'

import { documentsGet } from '../../database/queries/documents'
import { userSuper } from '../../database/user-super'
import { documentRepertoireFind } from './document-repertoire-find'

const documentPathGet = (document: IDocument) => {
  let path = documentRepertoireFind(document)

  if (!path) {
    console.error(`le repertoire est absent ${document}`)
  }

  if (path === 'demarches') {
    path += `/${document.titreEtapeId}`
  } else if (path === 'entreprises') {
    path += `/${document.entrepriseId}`
  } else if (path === 'activites') {
    path += `/${document.titreActiviteId}`
  }

  return `${path}/${document.id}.${document.fichierTypeId}`
}

export const documentsIndexBuild = async () => {
  const documents = await documentsGet({}, {}, userSuper)

  return documents.reduce((res: IndexFile, document) => {
    if (document.fichier) {
      res[document.id] = { document, path: documentPathGet(document) }
    }

    return res
  }, {})
}
