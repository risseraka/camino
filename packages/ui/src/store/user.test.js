import { createStore } from 'vuex'
import { createApp } from 'vue'
import * as api from '../api/utilisateurs'
import { Administrations } from 'camino-common/src/static/administrations'

import user from './user'
import tiles from '../utils/map-tiles'

jest.mock('../api/utilisateurs', () => ({
  utilisateurConnecter: jest.fn(),
  utilisateurDeconnecter: jest.fn(),
  utilisateurCerbereUrlObtenir: jest.fn(),
  utilisateurCerbereTokenCreer: jest.fn(),
  moi: jest.fn(),
  utilisateurMotDePasseInitialiser: jest.fn(),
  utilisateurMotDePasseMessageEnvoyer: jest.fn(),
  utilisateurCreationMessageEnvoyer: jest.fn(),
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
  let motDePasse
  let ticket

  beforeEach(() => {
    email = 'rene@la.taupe'
    motDePasse = 'mignon'
    ticket = 'ti-cket'

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

  test("retourne une erreur de l'api lors de l'obtention de l'utilisateur", async () => {
    const apiMock = api.moi.mockRejectedValue(new Error("erreur dans l'api"))
    store.commit('user/set', userInfo)
    await store.dispatch('user/identify', { email, motDePasse })

    expect(apiMock).toHaveBeenCalled()
    expect(store.state.user.element).toBeNull()
  })

  test('connecte un utilisateur', async () => {
    const apiMock = api.utilisateurConnecter.mockResolvedValue(userInfo)

    await store.dispatch('user/login', { email, motDePasse })

    expect(apiMock).toHaveBeenCalledWith({ email, motDePasse })
    expect(mutations.popupClose).toHaveBeenCalled()
    expect(actions.messageAdd).toHaveBeenCalled()
    expect(store.state.user.element).toEqual({
      id: 66,
      prenom: 'rene',
      nom: 'lataupe',
      email: 'rene@la.taupe',
      role: 'admin',
      entreprise: 'macdo'
    })
  })

  test("retourne une erreur de l'api lors de la connection d'un utilisateur", async () => {
    store.commit('user/set', userInfo)
    const apiMock = api.utilisateurConnecter.mockRejectedValue(
      new Error("erreur dans l'api")
    )
    await store.dispatch('user/login', { email, motDePasse })

    expect(apiMock).toHaveBeenCalledWith({ email, motDePasse })
    expect(store.state.user.element).toBeNull()
    expect(mutations.popupMessageAdd).toHaveBeenCalled()
  })

  test("obtient l'url de login Cerbère", async () => {
    const url = encodeURIComponent('http://camino.test')
    const returnUrl = `https://url-cerbere.tld/login?TARGET=${url}`

    const apiMock =
      api.utilisateurCerbereUrlObtenir.mockResolvedValue(returnUrl)

    const cerbereUrl = await store.dispatch('user/cerbereUrlGet', url)

    expect(apiMock).toHaveBeenCalledWith({ url })

    expect(cerbereUrl).toBe(returnUrl)
  })

  test("retourne une erreur de l'api lors de l'obtention de l'url Cerbère", async () => {
    const url = 'http://camino.test'
    const apiMock = api.utilisateurCerbereUrlObtenir.mockRejectedValue(
      new Error("erreur dans l'api")
    )

    await store.dispatch('user/cerbereUrlGet', url)

    expect(apiMock).toHaveBeenCalledWith({ url })
    expect(mutations.popupMessageAdd).toHaveBeenCalled()
  })

  test('connecte un utilisateur avec Cerbère', async () => {
    const apiMock = api.utilisateurCerbereTokenCreer.mockResolvedValue(userInfo)

    await store.dispatch('user/cerbereLogin', { ticket })

    expect(apiMock).toHaveBeenCalledWith({ ticket })
    expect(actions.messageAdd).toHaveBeenCalled()
    expect(store.state.user.element).toEqual({
      id: 66,
      prenom: 'rene',
      nom: 'lataupe',
      email: 'rene@la.taupe',
      role: 'admin',
      entreprise: 'macdo'
    })
  })

  test("retourne une erreur de l'api lors de la connection d'un utilisateur avec Cerbère", async () => {
    store.commit('user/set', userInfo)
    const apiMock = api.utilisateurCerbereTokenCreer.mockRejectedValue(
      new Error("erreur dans l'api")
    )

    await store.dispatch('user/cerbereLogin', { ticket })

    expect(apiMock).toHaveBeenCalledWith({ ticket })
    expect(store.state.user.element).toBeNull()
  })

  test('déconnecte un utilisateur', async () => {
    const apiMock = api.utilisateurDeconnecter.mockResolvedValue()

    store.commit('user/set', userInfo)
    await store.dispatch('user/logout')

    expect(apiMock).toHaveBeenCalled()
    expect(mutations.menuClose).toHaveBeenCalled()
    expect(actions.messageAdd).toHaveBeenCalled()
    expect(store.state.user.element).toBeNull()
  })

  test('ajoute un email', async () => {
    const apiMock =
      api.utilisateurCreationMessageEnvoyer.mockResolvedValue(email)
    await store.dispatch('user/addEmail', email)

    expect(apiMock).toHaveBeenCalledWith({ email })
    expect(mutations.popupClose).toHaveBeenCalled()
    expect(actions.messageAdd).toHaveBeenCalled()
  })

  test("retourne une erreur de l'api lors de l'ajout d'un email", async () => {
    const apiMock = api.utilisateurCreationMessageEnvoyer.mockRejectedValue(
      new Error("erreur dans l'api")
    )
    await store.dispatch('user/addEmail', email)

    expect(apiMock).toHaveBeenCalledWith({ email })
    expect(mutations.popupClose).not.toHaveBeenCalled()
    expect(mutations.popupMessageAdd).toHaveBeenCalled()
  })

  test('ajoute un utilisateur', async () => {
    const loginMock = jest.fn()
    user.actions.login = loginMock
    store = createStore({ modules: { user, map }, actions, mutations })
    const apiMock = api.utilisateurCreer.mockResolvedValue(userInfo)
    await store.dispatch('user/add', { utilisateur: userInfo, token: 'token' })

    expect(apiMock).toHaveBeenCalledWith({
      utilisateur: userInfo,
      token: 'token'
    })
    expect(actions.messageAdd).toHaveBeenCalled()
    expect(loginMock).toHaveBeenCalled()
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
    const loginMock = jest.fn()
    user.actions.login = loginMock
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
    expect(loginMock).not.toHaveBeenCalled()
  })

  test("crée l'email d'un utilisateur", async () => {
    const apiMock =
      api.utilisateurMotDePasseMessageEnvoyer.mockResolvedValue(userInfo)
    await store.dispatch('user/passwordInitEmail', email)

    expect(apiMock).toHaveBeenCalledWith({ email })
    expect(mutations.popupClose).toHaveBeenCalled()
    expect(actions.messageAdd).toHaveBeenCalled()
  })

  test("retourne une erreur api dans la création de l'email de l'utilisateur", async () => {
    const apiMock = api.utilisateurMotDePasseMessageEnvoyer.mockRejectedValue(
      new Error("erreur dans l'api")
    )
    await store.dispatch('user/passwordInitEmail', email)

    expect(apiMock).toHaveBeenCalledWith({ email })
    expect(mutations.popupMessageAdd).toHaveBeenCalled()
    expect(actions.messageAdd).not.toHaveBeenCalled()
  })

  test("initialise le mot de passe d'un utilisateur", async () => {
    store = createStore({ modules: { user, map }, actions, mutations })
    const apiMock =
      api.utilisateurMotDePasseInitialiser.mockResolvedValue(userInfo)
    await store.dispatch('user/passwordInit', {
      motDePasse1: motDePasse,
      motDePasse2: motDePasse
    })

    expect(apiMock).toHaveBeenCalledWith({
      motDePasse1: motDePasse,
      motDePasse2: motDePasse
    })
    expect(actions.messageAdd).toHaveBeenCalledTimes(2)
  })

  test("retourne une erreur api dans la création du mot de passe de l'utilisateur", async () => {
    const motDePasse1 = 'mignon'
    const motDePasse2 = 'mignon'
    const loginMock = jest.fn()
    user.actions.login = loginMock
    store = createStore({ modules: { user, map }, actions, mutations })
    const apiMock = api.utilisateurMotDePasseInitialiser.mockRejectedValue(
      new Error("erreur dans l'api")
    )
    const res = await store.dispatch('user/passwordInit', {
      motDePasse1,
      motDePasse2,
      email
    })

    expect(apiMock).toHaveBeenCalledWith({ motDePasse1, motDePasse2 })
    expect(actions.messageAdd).toHaveBeenCalled()
    expect(loginMock).not.toHaveBeenCalled()
    expect(res).toBeUndefined()
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
