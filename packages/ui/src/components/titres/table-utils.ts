import { markRaw } from 'vue'
import TagList from '../_ui/tag-list.vue'
import List from '../_ui/list.vue'
import CaminoDomaine from '../_common/domaine.vue'
import TitreNom from '../_common/titre-nom.vue'
import TitreTypeTypeNom from '../_common/titre-type-type-nom.vue'
import CoordonneesIcone from '../_common/coordonnees-icone.vue'
import ActivitesPills from '../_common/pills.vue'
import Statut from '../_common/statut.vue'
import { DomaineId } from 'camino-common/src/static/domaines'
import {
  TitresTypesTypes,
  TitreTypeTypeId
} from 'camino-common/src/static/titresTypesTypes'
import {
  Column,
  ComponentColumnData,
  TableAutoRow,
  TextColumnData
} from '@/components/_ui/table-auto.type'
import {
  DepartementId,
  Departements
} from 'camino-common/src/static/departement'
import { onlyUnique } from 'camino-common/src/typescript-tools'
import { Regions } from 'camino-common/src/static/region'
import {
  SubstanceLegaleId,
  SubstancesLegale
} from 'camino-common/src/static/substancesLegales'
import {
  sortedTitresStatuts,
  TitresStatuts,
  TitreStatutId
} from 'camino-common/src/static/titresStatuts'
import {
  ReferencesTypes,
  ReferenceTypeId
} from 'camino-common/src/static/referencesTypes'
import { TitreReference } from 'camino-common/src/titres-references'

interface Titulaire {
  id: string
  nom: string
}
export interface TitreEntreprise {
  id: string
  slug: string
  nom: string
  communes?: { departementId: DepartementId }[]
  references?: TitreReference[]
  domaineId: DomaineId
  domaine: { id: DomaineId; nom: string }
  coordonnees?: { x: number; y: number }
  // id devrait être une union
  type: {
    id: string
    typeId: string
    domaineId: DomaineId
    type: { id: TitreTypeTypeId; nom: string }
  }
  titreStatutId: TitreStatutId
  substances: SubstanceLegaleId[]
  titulaires: Titulaire[]
  activitesAbsentes: number | null
  activitesEnConstruction: number | null
}

const ordreStatut: { [key in TitreStatutId]: number } = {
  dmi: 0,
  mod: 1,
  val: 2,
  dmc: 3,
  ech: 4,
  ind: 5
}

const ordreFromStatut = (entry: string) => {
  const titreStatut = sortedTitresStatuts.find(({ nom }) => nom === entry)
  if (titreStatut) {
    return ordreStatut[titreStatut.id]
  }
  return -1
}

const isTitreStatut = (
  entry: string | number | string[] | undefined
): entry is string => {
  return sortedTitresStatuts.some(({ nom }) => nom === entry)
}

export const nomColumn: Column<'nom'> = {
  id: 'nom',
  name: 'Nom',
  class: ['min-width-8']
}
export const domaineColumn: Column<'domaine'> = {
  id: 'domaine',
  name: ''
}
export const typeColumn: Column<'type'> = {
  id: 'type',
  name: 'Type',
  class: ['min-width-8']
}

export const activiteColumn: Column<'activites'> = {
  id: 'activites',
  name: 'Activités',
  class: ['min-width-5'],
  sort: (statut1: TableAutoRow, statut2: TableAutoRow) => {
    const row1Statut = statut1.columns.activites.value
    const row2Statut = statut2.columns.activites.value
    if (typeof row1Statut === 'number' && typeof row2Statut === 'number') {
      return row1Statut - row2Statut
    }
    return 0
  }
}

export const statutColumn: Column<'statut'> = {
  id: 'statut',
  name: 'Statut',
  class: ['nowrap', 'min-width-5'],
  sort: (statut1: TableAutoRow, statut2: TableAutoRow) => {
    const row1Statut = statut1.columns.statut.value
    const row2Statut = statut2.columns.statut.value
    if (isTitreStatut(row1Statut) && isTitreStatut(row2Statut)) {
      return ordreFromStatut(row1Statut) - ordreFromStatut(row2Statut)
    }
    return 0
  }
}
export const referencesColumn: Column<'references'> = {
  id: 'references',
  name: 'Références',
  class: ['min-width-8'],
  noSort: true
}
export const titulairesColumn: Column<'titulaires'> = {
  id: 'titulaires',
  name: 'Titulaires',
  class: ['min-width-10']
}
export const titresColonnes: Column[] = [
  nomColumn,
  domaineColumn,
  typeColumn,
  statutColumn,
  activiteColumn,
  {
    id: 'substances',
    name: 'Substances',
    class: ['min-width-6'],
    noSort: true
  },
  {
    id: 'coordonnees',
    name: 'Carte'
  },
  titulairesColumn,
  {
    id: 'regions',
    name: 'Régions',
    class: ['min-width-8'],
    noSort: true
  },
  {
    id: 'departements',
    name: 'Départements',
    class: ['min-width-8'],
    noSort: true
  },
  referencesColumn
]

export const nomCell = (titre: { nom: string }): ComponentColumnData => ({
  component: markRaw(TitreNom),
  props: { nom: titre.nom },
  value: titre.nom
})
export const statutCell = (titre: {
  titreStatutId: TitreStatutId
}): ComponentColumnData => {
  const statut = TitresStatuts[titre.titreStatutId]
  return {
    component: markRaw(Statut),
    props: {
      color: statut.couleur,
      nom: statut.nom
    },
    value: statut.nom
  }
}

export const referencesCell = (titre: {
  references?: { nom: string; referenceTypeId: ReferenceTypeId }[]
}) => {
  const references = titre.references?.map(
    ref => `${ReferencesTypes[ref.referenceTypeId].nom} : ${ref.nom}`
  )

  return {
    component: List,
    props: {
      elements: references,
      mini: true
    },
    class: 'mb--xs',
    value: references
  }
}
export const titulairesCell = (titre: { titulaires?: { nom: string }[] }) => ({
  component: markRaw(List),
  props: {
    elements: titre.titulaires?.map(({ nom }) => nom),
    mini: true
  },
  class: 'mb--xs',
  value: titre.titulaires?.map(({ nom }) => nom).join(', ')
})
export const domaineCell = (titre: { domaineId: DomaineId }) => ({
  component: markRaw(CaminoDomaine),
  props: { domaineId: titre.domaineId },
  value: titre.domaineId
})

export const typeCell = (titre: { typeId: TitreTypeTypeId }) => ({
  component: markRaw(TitreTypeTypeNom),
  props: { nom: TitresTypesTypes[titre.typeId].nom },
  value: TitresTypesTypes[titre.typeId].nom
})
export const activitesCell = (titre: {
  activitesAbsentes: number | null
  activitesEnConstruction: number | null
}) => ({
  component: markRaw(ActivitesPills),
  props: {
    activitesAbsentes: titre.activitesAbsentes,
    activitesEnConstruction: titre.activitesEnConstruction
  },
  value: (titre?.activitesAbsentes ?? 0) + (titre?.activitesEnConstruction ?? 0)
})
export const titresLignesBuild = (
  titres: TitreEntreprise[],
  activitesCol: boolean,
  ordre = 'asc'
): TableAutoRow[] =>
  titres.map(titre => {
    const departements =
      titre.communes
        ?.map(({ departementId }) => Departements[departementId])
        .filter(onlyUnique) ?? []
    const departementNoms: string[] = departements.map(({ nom }) => nom)
    const regionNoms: string[] = departements
      .map(({ regionId }) => Regions[regionId].nom)
      .filter(onlyUnique)

    const columns: { [key in string]: ComponentColumnData | TextColumnData } = {
      nom: nomCell(titre),
      domaine: domaineCell({ domaineId: titre.domaine.id }),
      coordonnees: {
        component: markRaw(CoordonneesIcone),
        props: { coordonnees: titre.coordonnees },
        value: titre.coordonnees ? '·' : ''
      },
      type: typeCell({ typeId: titre.type.type.id }),
      statut: statutCell(titre),
      substances: {
        component: markRaw(TagList),
        props: {
          elements: titre.substances?.map(
            substanceId => SubstancesLegale[substanceId].nom
          )
        },
        class: 'mb--xs',
        value: titre.substances
          ?.map(substanceId => SubstancesLegale[substanceId].nom)
          .join(', ')
      },
      titulaires: titulairesCell(titre),
      regions: {
        component: markRaw(List),
        props: {
          elements: regionNoms,
          mini: true
        },
        class: 'mb--xs',
        value: regionNoms
      },
      departements: {
        component: markRaw(List),
        props: {
          elements: departementNoms,
          mini: true
        },
        class: 'mb--xs',
        value: departementNoms
      },
      references: referencesCell(titre)
    }

    if (activitesCol) {
      columns.activites = activitesCell(titre)
    }

    return {
      id: titre.id,
      link: { name: 'titre', params: { id: titre.slug } },
      columns
    }
  })
