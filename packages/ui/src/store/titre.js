import { titre, titreCreer, titreModifier, titreSupprimer } from '../api/titres'

import router from '../router'
import { utilisateurTitreAbonner } from '../api/utilisateurs-titres'

const state = {
  element: null,
  opened: {
    etapes: {},
    activites: {},
    travaux: {}
  },
  tabId: 'demarches'
}

const getters = {
  tabId(state, getters) {
    const tabIds = getters.tabs.map(({ id }) => id)

    if (!tabIds.includes(state.tabId)) {
      return tabIds[0]
    }

    return state.tabId
  },

  tabs(state, getters, rootState, rootGetters) {
    const tabs = [{ id: 'demarches', nom: 'Droits miniers' }]

    if (state.element?.activites?.length) {
      tabs.push({ id: 'activites', nom: 'Activités' })
    }

    if (getters.travaux.length || state.element?.travauxCreation) {
      tabs.push({ id: 'travaux', nom: 'Travaux' })
    }

    if (rootGetters['user/userIsSuper']) {
      tabs.push({ id: 'journaux', nom: 'Journaux' })
    }

    return tabs
  },

  demarches(state) {
    return state.element?.demarches?.filter(d => !d.type.travaux) || []
  },

  travaux(state) {
    return state.element?.demarches?.filter(d => d.type.travaux) || []
  }
}

const actions = {
  async get({ commit, dispatch }, id) {
    try {
      commit('loadingAdd', 'titre', { root: true })

      const data = await titre({ id })

      if (data) {
        commit('set', data)
        // remplace l’id de l’url par le slug
        history.replaceState({}, null, data.slug)
      } else {
        dispatch('pageError', null, { root: true })
      }
    } catch (e) {
      dispatch('apiError', e, { root: true })
    } finally {
      commit('loadingRemove', 'titre', { root: true })
    }
  },

  async add({ commit, dispatch }, titre) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('popupLoad', null, { root: true })
      commit('loadingAdd', 'titreAdd', { root: true })

      const data = await titreCreer({ titre })

      commit('popupClose', null, { root: true })
      router.push({ name: 'titre', params: { id: data.slug } })
      dispatch(
        'messageAdd',
        {
          value: 'le titre a été créé',
          type: 'success'
        },
        { root: true }
      )
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'titreAdd', { root: true })
    }
  },

  async update({ commit, dispatch }, titre) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('popupLoad', null, { root: true })
      commit('loadingAdd', 'totreUpdate', { root: true })

      const data = await titreModifier({ titre })

      commit('popupClose', null, { root: true })
      await dispatch('reload', { name: 'titre', id: data.slug }, { root: true })
      dispatch(
        'messageAdd',
        { value: 'le titre a été mis à jour', type: 'success' },
        { root: true }
      )
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'totreUpdate', { root: true })
    }
  },

  async remove({ commit, dispatch }, id) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('popupLoad', null, { root: true })
      commit('loadingAdd', 'titreRemove', { root: true })

      await titreSupprimer({ id })

      commit('popupClose', null, { root: true })
      dispatch(
        'messageAdd',
        {
          value: `le titre a été supprimé`,
          type: 'success'
        },
        { root: true }
      )
      router.push({ name: 'titres' })
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'titreRemove', { root: true })
    }
  },

  async subscribe({ state, commit, dispatch }, { titreId, abonner }) {
    try {
      commit('loadingAdd', 'titreSubscribe', { root: true })

      await utilisateurTitreAbonner({ titreId, abonner })

      state.element.abonnement = abonner
      commit('set', state.element)

      dispatch(
        'messageAdd',
        {
          value: `Vous êtes ${abonner ? 'abonné' : 'désabonné'} à ce titre`,
          type: 'success'
        },
        { root: true }
      )
    } catch (e) {
      dispatch('apiError', e, { root: true })
    } finally {
      commit('loadingRemove', 'titreSubscribe', { root: true })
    }
  }
}

const mutations = {
  set(state, titre) {
    state.element = titre
  },

  reset(state) {
    state.element = null
  },

  open(state, { section, id }) {
    if (!state.opened[section][id]) {
      state.opened[section][id] = true
    }

    state.tabId = section
  },

  close(state, { section, id }) {
    if (state.opened[section][id]) {
      state.opened[section][id] = false
    }
  },

  toggle(state, { section, id }) {
    state.opened[section][id] = !state.opened[section][id]
  },

  openTab(state, tabId) {
    state.tabId = tabId
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
