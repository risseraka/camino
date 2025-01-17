import { markRaw } from 'vue'

import FiltresDomaines from '../_common/filtres/domaines.vue'
import FiltresStatuts from '../_common/filtres/statuts.vue'
import FiltresTypes from '../_common/filtres/types.vue'

import { elementsFormat } from '../../utils/index'
import { titresFiltres, titresRechercherByNom } from '@/api/titres'
import { SubstancesLegales } from 'camino-common/src/static/substancesLegales'
import { sortedDomaines } from 'camino-common/src/static/domaines'

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
    id: 'entreprisesIds',
    type: 'autocomplete',
    value: [],
    name: 'Entreprises',
    elementsFormat
  },
  {
    id: 'substancesIds',
    type: 'autocomplete',
    value: [],
    elements: SubstancesLegales,
    name: 'Substances'
  },
  {
    id: 'references',
    type: 'input',
    value: '',
    name: 'Références',
    placeholder: 'Référence DGEC, DEAL, DEB, BRGM, Ifremer, …'
  },
  {
    id: 'territoires',
    type: 'input',
    value: '',
    name: 'Territoires',
    placeholder: 'Commune, département, région, …'
  },
  {
    id: 'domainesIds',
    name: 'Domaines',
    type: 'checkboxes',
    value: [],
    elements: sortedDomaines,
    component: markRaw(FiltresDomaines)
  },
  {
    id: 'typesIds',
    name: 'Types',
    type: 'checkboxes',
    value: [],
    elements: [],
    component: markRaw(FiltresTypes),
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
  }
]

export default filtres
