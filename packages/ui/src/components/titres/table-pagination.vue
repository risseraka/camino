<template>
  <UiTable
    :column="preferences.colonne"
    :columns="colonnes"
    :order="preferences.ordre"
    :page="preferences.page"
    :range="preferences.intervalle"
    :rows="lignes"
    :total="total"
    @params-update="preferencesUpdate"
  />
</template>

<script>
import UiTable from '../_ui/table-pagination.vue'

import { titresColonnes, titresLignesBuild } from './table-utils'

export default {
  name: 'Titres',

  components: { UiTable },

  props: {
    titres: { type: Array, required: true },
    total: { type: Number, required: true }
  },

  computed: {
    preferences() {
      return this.$store.state.titres.params.table
    },

    activitesCol() {
      const user = this.$store.state.user.element

      return user && user.sections.activites
    },

    colonnes() {
      return titresColonnes.filter(({ id }) =>
        this.activitesCol ? true : id !== 'activites'
      )
    },

    lignes() {
      return titresLignesBuild(this.titres, this.activitesCol)
    },

    pages() {
      const pages = Math.ceil(this.lignes.length / this.preferences.intervalle)
      return pages || 0
    }
  },

  methods: {
    preferencesUpdate(params) {
      if (params.range) {
        params.intervalle = params.range
        delete params.range
      }

      if (params.column) {
        params.colonne = params.column
        delete params.column
      }

      if (params.order) {
        params.ordre = params.order
        delete params.order
      }

      this.$store.dispatch('titres/paramsSet', {
        section: 'table',
        params
      })
    },

    pageUpdate(page) {
      this.preferencesUpdate({ page })
    },

    intervalleUpdate(range) {
      this.preferencesUpdate({ range, page: 1 })
    }
  }
}
</script>
