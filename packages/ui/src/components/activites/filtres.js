import FiltresStatuts from '../_common/filtres/statuts.vue'
import FiltresDomaines from '../_common/filtres/domaines.vue'
import FiltresTypes from '../_common/filtres/types.vue'
import { elementsFormat } from '../../utils/index'
import { markRaw } from 'vue'
import { SubstancesLegales } from 'camino-common/src/static/substancesLegales'
import { sortedDomaines } from 'camino-common/src/static/domaines'
import { titresFiltres, titresRechercherByNom } from '@/api/titres'

const filtres = [
  {
    id: 'titresIds',
    type: 'autocomplete',
    value: [],
    elements: [],
    name: 'Noms',
    lazy: true,
    search: value => titresRechercherByNom({ noms: value, intervalle: 100 }),
    load: value => titresFiltres({ titresIds: value })
  },
  {
    id: 'titresEntreprisesIds',
    type: 'autocomplete',
    value: [],
    name: 'Entreprises',
    elementsFormat
  },
  {
    id: 'titresSubstancesIds',
    type: 'autocomplete',
    value: [],
    name: 'Substances',
    elements: SubstancesLegales
  },
  {
    id: 'titresReferences',
    type: 'input',
    value: '',
    name: 'Références',
    placeholder: 'Référence DGEC, DEAL, DEB, BRGM, Ifremer, …'
  },
  {
    id: 'titresTerritoires',
    type: 'input',
    value: '',
    name: 'Territoires',
    placeholder: 'Commune, département, région, …'
  },
  {
    id: 'titresDomainesIds',
    name: 'Domaines',
    type: 'checkboxes',
    value: [],
    elements: sortedDomaines,
    component: markRaw(FiltresDomaines)
  },
  {
    id: 'titresTypesIds',
    name: 'Types de titre',
    type: 'checkboxes',
    value: [],
    elements: [],
    component: markRaw(FiltresTypes),
    elementsFormat
  },
  {
    id: 'titresStatutsIds',
    name: 'Statuts de titre',
    type: 'checkboxes',
    value: [],
    elements: [],
    component: markRaw(FiltresStatuts),
    elementsFormat
  },
  {
    id: 'typesIds',
    name: 'Types',
    type: 'checkboxes',
    value: [],
    elements: [],
    elementsFormat
  },
  {
    id: 'statutsIds',
    name: 'Statuts',
    type: 'checkboxes',
    value: [],
    elements: [],
    component: markRaw(FiltresStatuts),
    elementsFormat
  },
  {
    id: 'annees',
    name: 'Années',
    type: 'select',
    value: [],
    elements: [],
    elementName: 'nom',
    buttonAdd: 'Ajouter une année',
    isNumber: true,
    elementsFormat
  }
]

export default filtres
