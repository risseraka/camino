<template>
  <div>
    <h2>Activité</h2>
    <Loader v-if="!loaded" />
    <div v-else>
      <h6>
        <router-link
          :to="{ name: 'titre', params: { id: activite.titre.slug } }"
          class="cap-first"
        >
          {{ activite.titre.nom }}
        </router-link>
      </h6>
      <h5>
        {{ dateFormat(activite.date) }} |
        <span class="cap-first"
          ><span v-if="activite.periodeId && activite.type.frequenceId"
            >{{ getPeriodeVue(activite.type.frequenceId, activite.periodeId) }}
          </span>
          {{ activite.annee }}</span
        >
      </h5>

      <div class="flex">
        <h3 class="mb-s">
          <span class="cap-first">{{ activite.type.nom }}</span>
        </h3>

        <HelpTooltip v-if="shouldDisplayHelp" class="ml-m">
          Tous les champs doivent être remplis même s’il n’y a pas eu
          d’extraction. Le cas échéant, indiquer seulement 0, puis enregistrer.
        </HelpTooltip>
      </div>

      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="activite.type.description"
        class="h6"
        v-html="activite.type.description"
      />

      <div class="p-s bg-info color-bg mb">
        Besoin d'aide pour remplir ce rapport ?
        <router-link
          to="/contacts"
          target="_blank"
          class="p-s bg-info color-bg mb"
          >Contactez-nous
        </router-link>
      </div>
      <div v-if="shouldDisplayFiscaliteHelp" class="p-s bg-info color-bg mb">
        Les données déclarées sur Camino/Activités permettent de calculer une
        estimation de votre fiscalité minière, consultable sur
        <router-link
          :to="entrepriseUrl"
          target="_blank"
          class="bg-info color-bg mb"
          >votre page entreprise
        </router-link>
      </div>

      <SectionsEdit
        :contenu="activite.contenu"
        :sections="activite.sections"
        @contenu-update="activite.contenu = $event"
        @complete-update="sectionsComplete = $event"
      />

      <DocumentsEdit
        v-model:documents="activite.documents"
        :addAction="{ name: 'titreActiviteEdition/documentAdd' }"
        :removeAction="{ name: 'titreActiviteEdition/documentRemove' }"
        repertoire="activites"
        documentPopupTitle="documentPopupTitle"
        :parentTypeId="activite.type.id"
        :documentsTypes="activite.type.documentsTypes"
        @complete-update="documentsComplete = $event"
      />

      <div class="tablet-blobs mb">
        <div class="tablet-blob-1-3" />
        <div class="tablet-blob-1-3">
          <button class="btn btn-secondary" @click="save">Enregistrer</button>
        </div>
        <div class="tablet-blob-1-3">
          <button
            ref="save-button"
            class="btn btn-primary"
            :disabled="!sectionsComplete || !documentsComplete"
            @click="activiteDepotPopupOpen"
          >
            Enregistrer et déposer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat } from '@/utils'
import Loader from './_ui/loader.vue'
import HelpTooltip from './_ui/help-tooltip.vue'
import SectionsEdit from './_common/sections-edit.vue'
import DocumentsEdit from './document/multi-edit.vue'
import DeposePopup from './activite/depose-popup.vue'
import router from '@/router'
import { getPeriode } from 'camino-common/src/static/frequence'

export default {
  components: { Loader, SectionsEdit, DocumentsEdit, HelpTooltip },

  data() {
    return {
      events: { saveKeyUp: true },
      documentsComplete: false,
      sectionsComplete: false
    }
  },

  computed: {
    loaded() {
      return !this.$store.state.loading.includes('activiteEditionInit')
    },

    user() {
      return this.$store.state.user.element
    },

    activiteId() {
      return this.$route.params.id
    },

    activite() {
      return this.$store.state.titreActiviteEdition.element
    },

    shouldDisplayHelp() {
      return ['grp', 'gra'].includes(this.activite.type.id)
    },

    loading() {
      return false
    },

    isPopupOpen() {
      return !!this.$store.state.popup.component
    },
    shouldDisplayFiscaliteHelp() {
      return (
        ['grp', 'gra', 'grx'].includes(this.activite.type.id) &&
        this.entrepriseUrl !== null
      )
    },
    entrepriseUrl() {
      let entreprise = null
      if (this.activite.titre.amodiataires.length === 1) {
        entreprise = this.activite.titre.amodiataires[0]
      } else if (this.activite.titre.titulaires.length === 1) {
        entreprise = this.activite.titre.titulaires[0]
      } else {
        console.warn(
          `l'activité ${this.activite.id} du titre ${this.activite.titre.slug} possède plusieurs titulaires`
        )
      }

      return entreprise !== null ? `/entreprises/${entreprise.id}` : null
    }
  },

  watch: {
    user: 'init'
  },

  async created() {
    await this.init()

    document.addEventListener('keyup', this.keyUp)
  },

  beforeUnmount() {
    document.removeEventListener('keyup', this.keyUp)
  },

  unmounted() {
    this.$store.commit('titreActiviteEdition/reset')
  },

  methods: {
    getPeriodeVue(frequenceId, periodeId) {
      return getPeriode(frequenceId, periodeId)
    },
    async activiteDepotPopupOpen() {
      if (this.documentsComplete && this.sectionsComplete) {
        await this.$store.dispatch('titreActiviteEdition/update', this.activite)

        this.$store.commit('popupOpen', {
          component: DeposePopup,
          props: {
            activite: this.activite,
            onDepotDone: () => {
              this.$router.back()
              this.eventTrack({
                categorie: 'titre-activite',
                action: 'titre-activite_depot',
                nom: this.$route.params.id
              })
            }
          }
        })
      }
    },
    async init() {
      await this.$store.dispatch('titreActiviteEdition/init', this.activiteId)
    },

    async save() {
      await this.$store.dispatch('titreActiviteEdition/update', this.activite)

      this.eventTrack({
        categorie: 'activite',
        action: 'activite-enregistrer',
        nom: this.activite.nom
      })

      await router.back()
    },

    eventTrack(event) {
      if (this.$matomo) {
        this.$matomo.trackEvent(event.categorie, event.action, event.nom)
      }
    },

    keyUp(e) {
      if (
        (e.which || e.keyCode) === 13 &&
        this.events.saveKeyUp &&
        !this.isPopupOpen &&
        !this.loading
      ) {
        this.$refs['save-button'].focus()
        this.save()
      }
    },

    dateFormat(date) {
      return dateFormat(date)
    }
  }
}
</script>
