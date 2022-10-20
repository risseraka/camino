import { createStore } from 'vuex'
import { createApp } from 'vue'
import * as api from '../api/utilisateurs'
import { Administrations } from 'camino-common/src/static/administrations'

import user from './user'
import tiles from '../utils/map-tiles'

jest.mock('../api/utilisateurs', () => ({
  moi: jest.fn(),
  utilisateurCreer: jest.fn(),
  userMetas: jest.fn()
}))

console.info = jest.fn()

jest.mock('../router', () => [])

describe("état de l'utilisateur connecté", () => {
  let store
  let actions
  let mutations
  let userInfo
  let map
  let email

  beforeEach(() => {
    email = 'rene@la.taupe'

    userInfo = {
      id: 66,
      prenom: 'rene',
      nom: 'lataupe',
      role: 'admin',
      entreprise: 'macdo',
      email: 'rene@la.taupe'
    }

    user.state = {
      element: null,
      metas: {
        domaines: [],
        version: null,
        versionUi: null,
        tiles
      },
      preferences: {
        carte: { tilesId: 'osm-fr' }
      }
    }

    actions = {
      messageAdd: jest.fn(),
      errorRemove: jest.fn(),
      apiError: jest.fn()
    }

    mutations = {
      popupMessagesRemove: jest.fn(),
      loadingAdd: jest.fn(),
      popupClose: jest.fn(),
      popupMessageAdd: jest.fn(),
      loadingRemove: jest.fn(),
      menuClose: jest.fn()
    }

    map = { state: { tiles: [{ id: 'osm-fr' }, { id: 'geoportail' }] } }

    store = createStore({
      modules: { user, map },
      actions,
      mutations
    })

    const app = createApp({})
    app.use(store)
  })

  test("initialise les métas de l'utilisateur connecté", async () => {
    const apiMock = api.userMetas.mockResolvedValue({
      version: '1.1.1'
    })

    await store.dispatch('user/init')

    expect(apiMock).toHaveBeenCalled()
    expect(store.state.user.metas).toEqual({
      domaines: [],
      version: '1.1.1',
      versionUi: null,
      tiles
    })
    expect(mutations.loadingRemove).toHaveBeenCalled()
  })

  test("retourne une erreur si l'api ne répond pas", async () => {
    const apiMock = api.userMetas.mockRejectedValue(
      new Error("erreur de l'api")
    )

    await store.dispatch('user/init')

    expect(apiMock).toHaveBeenCalled()
    expect(mutations.loadingRemove).toHaveBeenCalled()
    expect(actions.apiError).toHaveBeenCalled()
    expect(store.state.user.metas.version).toBeNull()
  })

  test("identifie l'utilisateur si un token valide est présent", async () => {
    const apiMock = api.moi.mockResolvedValue(userInfo)

    store = createStore({ modules: { user, map }, actions, mutations })

    await store.dispatch('user/identify')

    expect(store.state.user.element).toEqual({
      id: 66,
      prenom: 'rene',
      nom: 'lataupe',
      email: 'rene@la.taupe',
      role: 'admin',
      entreprise: 'macdo'
    })
    expect(apiMock).toHaveBeenCalled()
  })

  test('ajoute un utilisateur', async () => {
    store = createStore({ modules: { user, map }, actions, mutations })
    const apiMock = api.utilisateurCreer.mockResolvedValue(userInfo)
    await store.dispatch('user/add', { utilisateur: userInfo, token: 'token' })

    expect(apiMock).toHaveBeenCalledWith({
      utilisateur: userInfo,
      token: 'token'
    })
    expect(actions.messageAdd).toHaveBeenCalled()
  })

  test("n'ajoute pas d'utilisateur", async () => {
    const apiMock = api.utilisateurCreer.mockResolvedValue(null)
    await store.dispatch('user/add', { utilisateur: userInfo, token: 'token' })

    expect(apiMock).toHaveBeenCalledWith({
      utilisateur: userInfo,
      token: 'token'
    })
    expect(actions.messageAdd).not.toHaveBeenCalled()
  })

  test("retourne une erreur api lors de l'ajout d'un utilisateur", async () => {
    store = createStore({ modules: { user, map }, actions, mutations })
    const apiMock = api.utilisateurCreer.mockRejectedValue(
      new Error("erreur dans l'api")
    )
    await store.dispatch('user/add', { utilisateur: userInfo, token: 'token' })

    expect(apiMock).toHaveBeenCalledWith({
      utilisateur: userInfo,
      token: 'token'
    })
    expect(actions.messageAdd).toHaveBeenCalled()
  })

  test("initialise les preferences de l'utilisateur", async () => {
    const section = 'conditions'
    const value = 'conditionValue'
    const params = { value }
    await store.dispatch('user/preferencesSet', { section, params })

    expect(localStorage.getItem('conditions')).toEqual(value)
  })

  test('initialise les preferences de filtre', async () => {
    const section = 'carte'
    const params = { tilesId: 'ign' }
    await store.dispatch('user/preferencesSet', { section, params })

    expect(store.state.user.preferences.carte.tilesId).toEqual('ign')
  })

  test('retourne le fond de carte actif', () => {
    expect(store.getters['user/tilesActive']).toEqual({
      id: 'osm-fr',
      name: 'OSM / fr',
      type: 'tiles',
      url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
      attribution:
        '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
  })

  test("retourne true si l'utilisateur est connecté", () => {
    user.state.element = {}
    store = createStore({ modules: { user } })

    expect(store.getters['user/preferencesConditions']).toBeTruthy()
  })

  test('ne recupere pas les preferences sauvegardées: vieilles de plus de 3 jours', () => {
    localStorage.setItem('conditions', '3')
    expect(store.getters['user/preferencesConditions']).toBeFalsy()
  })

  test('recupere les preferences sauvegardées', () => {
    localStorage.setItem('conditions', new Date().getTime().toString())
    expect(store.getters['user/preferencesConditions']).toBeTruthy()
  })

  test("initialise le statut de l'user sans entreprises", () => {
    store.commit('user/set', {
      id: 66,
      prenom: 'rene',
      nom: 'lataupe',
      role: 'admin'
    })

    expect(store.state.user.element).toEqual({
      id: 66,
      prenom: 'rene',
      nom: 'lataupe',
      role: 'admin'
    })
    expect(store.state.user.element.entreprise).toBeUndefined()
  })

  test.each`
    role            | isAdmin  | administrationId
    ${'super'}      | ${true}  | ${undefined}
    ${'admin'}      | ${true}  | ${Administrations['dea-guadeloupe-01'].id}
    ${'editeur'}    | ${true}  | ${Administrations['dea-guadeloupe-01'].id}
    ${'entreprise'} | ${false} | ${undefined}
    ${undefined}    | ${false} | ${undefined}
  `(
    'ajoute un utilisateur au store avec le role $role et vérifie si il est admin $isAdmin',
    ({ role, isAdmin, administrationId }) => {
      store.commit('user/set', {
        id: 66,
        prenom: 'rene',
        nom: 'lataupe',
        role,
        administrationId
      })
      expect(store.getters['user/userIsAdmin']).toEqual(isAdmin)
    }
  )
})
