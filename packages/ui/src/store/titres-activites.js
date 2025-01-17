import { activites } from '../api/titres-activites'
import { activitesMetas } from '../api/metas-activites'
import { listeActionsBuild, listeMutations } from './_liste-build'

export const anneesGet = currentYear => {
  const annees = []
  for (let i = currentYear; i >= 1997; i--) {
    annees.push({ id: i, nom: i })
  }

  return annees
}

const state = {
  elements: [],
  total: 0,
  metas: {
    types: [],
    annees: anneesGet(new Date().getFullYear()),
    statuts: [],
    titresTypes: [],
    titresStatuts: [],
    titresEntreprises: []
  },
  definitions: [
    { id: 'typesIds', type: 'strings', values: [] },
    { id: 'statutsIds', type: 'strings', values: [] },
    { id: 'annees', type: 'numbers', values: [] },
    { id: 'titresIds', type: 'strings', values: [] },
    { id: 'titresEntreprisesIds', type: 'strings', values: [] },
    { id: 'titresSubstancesIds', type: 'strings', values: [] },
    { id: 'titresReferences', type: 'string' },
    { id: 'titresTerritoires', type: 'string' },
    { id: 'titresTypesIds', type: 'strings', values: [] },
    { id: 'titresDomainesIds', type: 'strings', values: [] },
    { id: 'titresStatutsIds', type: 'strings', values: [] },
    { id: 'page', type: 'number', min: 0 },
    { id: 'intervalle', type: 'number', min: 10, max: 500 },
    {
      id: 'colonne',
      type: 'string',
      values: ['titreNom', 'titulaires', 'annee', 'periode', 'statut']
    },
    {
      id: 'ordre',
      type: 'string',
      values: ['asc', 'desc']
    }
  ],
  params: {
    table: {
      page: 1,
      intervalle: 200,
      ordre: 'asc',
      colonne: null
    },
    filtres: {
      typesIds: [],
      statutsIds: [],
      annees: [],
      titresIds: [],
      titresEntreprisesIds: [],
      titresSubstancesIds: [],
      titresReferences: '',
      titresTerritoires: '',
      titresTypesIds: [],
      titresDomainesIds: [],
      titresStatutsIds: []
    }
  },
  initialized: false
}

const actions = listeActionsBuild(
  'titresActivites',
  'activités',
  activites,
  activitesMetas
)

const mutations = Object.assign({}, listeMutations, {
  metasSet(state, data) {
    Object.keys(data).forEach(id => {
      let metaId
      let paramId

      if (id === 'activitesTypes') {
        metaId = 'types'
        paramId = 'typesIds'
      } else if (id === 'activitesStatuts') {
        metaId = 'statuts'
        paramId = 'statutsIds'
      } else if (id === 'types') {
        metaId = 'titresTypes'
        paramId = 'titresTypesIds'
      } else if (id === 'statuts') {
        metaId = 'titresStatuts'
        paramId = 'titresStatutsIds'
      } else if (id === 'entreprises') {
        metaId = 'titresEntreprises'
        paramId = 'titresEntreprisesIds'
        data[id] = data[id].elements
      }

      if (metaId) {
        const param = state.definitions.find(p => p.id === metaId)
        if (param && param.type && param.type === 'numbers') {
          state.metas[metaId] = data[id].map(annee => {
            return { id: annee, nom: annee }
          })
        } else {
          state.metas[metaId] = data[id]
        }
      }

      if (paramId) {
        const definition = state.definitions.find(p => p.id === paramId)
        if (definition && definition.type && definition.type === 'numbers') {
          definition.values = data[id]
        } else {
          definition.values = data[id].map(e => e.id)
        }
      }
    })
  }
})

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
