import titre from './titre'
import * as api from '../api/titres'
import { createApp } from 'vue'
import { createStore } from 'vuex'

jest.mock('../router', () => ({
  push: () => {}
}))

jest.mock('../api/titres', () => ({
  titreMetas: jest.fn(),
  titre: jest.fn(),
  titreCreer: jest.fn(),
  titreModifier: jest.fn(),
  titreSupprimer: jest.fn(),
  utilisateurTitreAbonner: jest.fn()
}))

console.info = jest.fn()

describe('état du titre sélectionné', () => {
  let store
  let actions
  let mutations

  beforeEach(() => {
    titre.state = {
      element: null,
      metas: {
        referencesTypes: [],
        domaines: []
      },
      opened: {
        etapes: {},
        activites: { 'activite-id': false },
        travaux: {}
      }
    }

    actions = {
      pageError: jest.fn(),
      apiError: jest.fn(),
      reload: jest.fn(),
      messageAdd: jest.fn()
    }

    mutations = {
      loadingAdd: jest.fn(),
      loadingRemove: jest.fn(),
      popupLoad: jest.fn(),
      popupMessagesRemove: jest.fn(),
      popupClose: jest.fn(),
      popupMessageAdd: jest.fn()
    }

    store = createStore({
      modules: { titre },
      actions,
      mutations
    })

    const app = createApp({})
    app.use(store)
  })

  test('retourne un titre', async () => {
    const apiMock = api.titre.mockResolvedValue({ id: 83, nom: 'marne' })
    await store.dispatch('titre/get', 83)

    expect(apiMock).toHaveBeenCalledWith({ id: 83 })
    expect(store.state.titre.element).toEqual({ id: 83, nom: 'marne' })
  })

  test("affiche une page d'erreur si l'id du titre retourne null", async () => {
    const apiMock = api.titre.mockResolvedValue(null)
    await store.dispatch('titre/get', 27)

    expect(apiMock).toHaveBeenCalledWith({ id: 27 })
    expect(actions.pageError).toHaveBeenCalled()
  })

  test("retourne une erreur si de l'api ne répond pas lors d'une requête sur un titre", async () => {
    api.titre.mockRejectedValue(new Error("erreur de l'api"))
    await store.dispatch('titre/get', 83)

    expect(store.state.titre.element).toEqual(null)
    expect(actions.apiError).toHaveBeenCalled()
  })

  test('crée un titre', async () => {
    api.titreCreer.mockResolvedValue({ id: 83, nom: 'marne' })
    await store.dispatch('titre/add', { id: 83, nom: 'marne' })

    expect(mutations.popupClose).toHaveBeenCalled()
  })

  test("retourne une erreur si l'API retourne une erreur lors de la création dun titre", async () => {
    api.titreCreer.mockRejectedValue(new Error('erreur api'))
    await store.dispatch('titre/add', { id: 83, nom: 'marne' })

    expect(mutations.popupMessageAdd).toHaveBeenCalled()
  })

  test('met à jour un titre', async () => {
    store = createStore({ modules: { titre }, actions, mutations })
    api.titreModifier.mockResolvedValue({ id: 83, nom: 'marne' })
    await store.dispatch('titre/update', { id: 83, nom: 'marne' })

    expect(mutations.popupClose).toHaveBeenCalled()
    expect(actions.reload).toHaveBeenCalled()
  })

  test("retourne une erreur si l'API retourne une erreur lors de la mise à jour d'un titre", async () => {
    api.titreModifier.mockRejectedValue(new Error('erreur api'))
    await store.dispatch('titre/update', { id: 83, nom: 'marne' })

    expect(mutations.popupMessageAdd).toHaveBeenCalled()
  })

  test('supprime un titre', async () => {
    const apiMock = api.titreSupprimer.mockResolvedValue(true)
    await store.dispatch('titre/remove', 83)

    expect(apiMock).toHaveBeenCalledWith({ id: 83 })
  })

  test("retourne une erreur si l'API retourne une erreur lors de la suppression d'un titre", async () => {
    const apiMock = api.titreSupprimer.mockRejectedValue(
      new Error("error de l'api")
    )
    await store.dispatch('titre/remove', 83)

    expect(apiMock).toHaveBeenCalledWith({ id: 83 })
    expect(mutations.popupMessageAdd).toHaveBeenCalled()
  })

  test('supprime le titre courant', () => {
    store.commit('titre/set', 83)
    store.commit('titre/reset')

    expect(store.state.titre.element).toBeNull()
  })

  test('ouvre et ferme une section', () => {
    store.commit('titre/open', { section: 'etapes', id: 'etape-id' })

    expect(store.state.titre.opened.etapes['etape-id']).toBeTruthy()

    store.commit('titre/open', { section: 'etapes', id: 'etape-id' })

    expect(store.state.titre.opened.etapes['etape-id']).toBeTruthy()

    store.commit('titre/close', { section: 'etapes', id: 'etape-id' })

    expect(store.state.titre.opened.etapes['etape-id']).toBeFalsy()

    store.commit('titre/close', { section: 'etapes', id: 'etape-id' })

    expect(store.state.titre.opened.etapes['etape-id']).toBeFalsy()
  })

  test("permute l'ouverture une section", () => {
    expect(store.state.titre.opened.activites['activite-id']).toBeFalsy()
    store.commit('titre/toggle', { section: 'activites', id: 'activite-id' })

    expect(store.state.titre.opened.activites['activite-id']).toBeTruthy()

    store.commit('titre/toggle', { section: 'activites', id: 'activite-id' })

    expect(store.state.titre.opened.activites['activite-id']).toBeFalsy()
  })

  test('une seule tab est visible par défaut', () => {
    expect(store.getters['titre/tabs']).toMatchObject([{ id: 'demarches' }])
  })

  test('la tab des activités est visible si il existe au moins une activité', () => {
    store.state.titre.element = { activites: [{}], demarches: [] }
    expect(store.getters['titre/tabs']).toMatchObject([
      { id: 'demarches' },
      { id: 'activites' }
    ])
  })

  test('la tab des travaux est visible si il existe au moins un travaux', () => {
    store.state.titre.element = {
      demarches: [{ type: { travaux: true } }]
    }
    expect(store.getters['titre/tabs']).toMatchObject([
      { id: 'demarches' },
      { id: 'travaux' }
    ])
  })
})
