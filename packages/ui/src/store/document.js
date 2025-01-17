import {
  documentMetas,
  documentCreer,
  documentModifier,
  documentSupprimer
} from '../api/documents'
import { uploadCall } from '../api/_upload'

const state = {
  metas: {
    documentsTypes: []
  }
}

const actions = {
  async init({ commit }, options) {
    try {
      commit('loadingAdd', 'documentInit', { root: true })

      const data = await documentMetas(options)

      commit('metasSet', data)
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'documentInit', { root: true })
    }
  },

  async upsert({ commit, dispatch }, { document, route, action }) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('popupLoad', null, { root: true })

      const isTemporary = document.id === document.typeId
      if (isTemporary) {
        delete document.id
      }

      // Il faut envoyer les données de "document" sans sa propriété "fichierNouveau"
      // pour ne pas téléverser le fichier via GQL. Mais transformer "document" ici altère
      // le rendu de la UI. Elle pointe vers la référence de "document.fichierNouveau"
      // pour afficher le nom du fichier. On en crée donc une copie.
      const documentToSend = Object.assign({}, document)
      delete documentToSend.fichierNouveau

      let uploadURL
      let documentReturned

      if (document.fichierNouveau) {
        uploadURL = await uploadCall(document.fichierNouveau, progress => {
          commit('fileLoad', { loaded: progress, total: 100 }, { root: true })
        })
      }

      const nomTemporaire = uploadURL
        ? uploadURL.substring(uploadURL.lastIndexOf('/') + 1)
        : null

      const idOld = document.id
      try {
        if (!document.id) {
          documentReturned = await documentCreer({
            document: { ...documentToSend, nomTemporaire }
          })
        } else {
          delete documentToSend.typeId
          documentReturned = await documentModifier({
            document: { ...documentToSend, nomTemporaire }
          })
        }

        dispatch(
          'messageAdd',
          { value: `le document a été mis à jour`, type: 'success' },
          { root: true }
        )

        dispatch('refreshAfterUpsert', {
          route,
          idOld,
          titreEtapeId: document.titreEtapeId,
          document: documentReturned,
          action
        })

        // Ne ferme la popup automatiquement que si tout s'est passé sans erreur
        commit('popupClose', null, { root: true })
      } catch (e) {
        commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
      }
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('fileLoad', { loaded: 0, total: 0 }, { root: true })
    }
  },

  async refreshAfterUpsert(
    { commit, dispatch },
    { route, idOld, titreEtapeId, document, action }
  ) {
    if (route) {
      await dispatch('reload', route, { root: true })

      if (route.name === 'titre') {
        const section = route.section
        let id

        if (section === 'etapes') id = titreEtapeId

        commit('titre/open', { section, id }, { root: true })
      }
    } else if (action) {
      const params = { ...action.params, document }

      if (idOld) {
        params.idOld = idOld
      }

      await dispatch(action.name, params, { root: true })
    }
  },

  async remove({ commit, dispatch }, { id, route }) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('loadingAdd', 'documentRemove', { root: true })
      if (route) {
        commit('popupLoad', null, { root: true })
      }

      await documentSupprimer({ id })

      if (route) {
        commit('popupClose', null, { root: true })

        dispatch(
          'messageAdd',
          { value: `le document a été supprimé`, type: 'success' },
          { root: true }
        )
        await dispatch('reload', route, { root: true })
      }
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'documentRemove', { root: true })
    }
  }
}

const mutations = {
  metasSet(state, data) {
    state.metas.documentsTypes = data
  },

  uploadProgress(state, progress) {
    state.upload.progress = progress
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
