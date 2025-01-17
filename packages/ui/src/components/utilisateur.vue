<template>
  <div v-if="!loaded">
    <Loader />
  </div>
  <div v-else>
    <h5>Utilisateur</h5>
    <div class="flex">
      <h1>
        {{
          utilisateur
            ? `${utilisateur.prenom || '–'} ${utilisateur.nom || '–'}`
            : '–'
        }}
      </h1>

      <button
        v-if="user && user.id === utilisateur.id"
        id="cmn-user-menu-button-deconnexion"
        class="btn-menu text-decoration-none bold p-0 flex-right"
        @click="logout"
      >
        Déconnexion
      </button>
    </div>

    <Accordion class="mb" :slotSub="true" :slotButtons="true">
      <template #title>
        <span class="cap-first"> Profil </span>
      </template>

      <template v-if="utilisateur.modification" #buttons>
        <button
          v-if="(user && user.id === utilisateur.id) || isSuper(user)"
          id="cmn-utilisateur-button-password-popup"
          class="btn-alt py-s px-m"
          title="changer de mot de passe"
          @click="passwordPopupOpen"
        >
          <Icon size="M" name="key" />
        </button>

        <button
          v-if="user && user.id === utilisateur.id"
          id="cmn-utilisateur-button-email-popup"
          class="btn-alt py-s px-m"
          title="changer d'email"
          @click="emailPopupOpen"
        >
          <Icon size="M" name="at" />
        </button>

        <button
          id="cmn-utilisateur-button-popup-editer"
          class="btn-alt py-s px-m"
          title="modifier le compte utilisateur"
          @click="editPopupOpen"
        >
          <Icon size="M" name="pencil" />
        </button>

        <button
          id="cmn-utilisateur-button-popup-supprimer"
          class="btn-alt py-s px-m"
          title="supprimer le compte utilisateur"
          @click="removePopupOpen"
        >
          <Icon size="M" name="delete" />
        </button>
      </template>

      <template #sub>
        <div class="px-m pt-m">
          <div class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>Prénom</h5>
            </div>
            <div class="tablet-blob-3-4">
              <p>{{ utilisateur.prenom || '–' }}</p>
            </div>
          </div>

          <div class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>Nom</h5>
            </div>
            <div class="tablet-blob-3-4">
              <p>{{ utilisateur.nom || '–' }}</p>
            </div>
          </div>

          <div class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>Email</h5>
            </div>
            <div class="tablet-blob-3-4">
              <p>{{ utilisateur.email || '–' }}</p>
            </div>
          </div>

          <div class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>Téléphone fixe</h5>
            </div>
            <div class="tablet-blob-3-4">
              <p>{{ utilisateur.telephoneFixe || '–' }}</p>
            </div>
          </div>

          <div class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>Téléphone mobile</h5>
            </div>
            <div class="tablet-blob-3-4">
              <p>{{ utilisateur.telephoneMobile || '–' }}</p>
            </div>
          </div>

          <div v-if="utilisateur.permissionModification" class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>Permissions</h5>
            </div>
            <div class="tablet-blob-3-4">
              <Pill v-if="utilisateur.role" class="mb">
                {{ utilisateur.role }}
              </Pill>
              <p v-else>–</p>
            </div>
          </div>

          <div class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>Newsletter</h5>
            </div>
            <div class="tablet-blob-3-4">
              <p v-if="subscription.newsletter">Inscrit</p>
              <p v-else>–</p>
            </div>
          </div>

          <div v-if="utilisateur.entreprises.length" class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>
                Entreprise{{ utilisateur.entreprises.length > 1 ? 's' : '' }}
              </h5>
            </div>

            <div class="tablet-blob-3-4">
              <ul class="list-inline">
                <li
                  v-for="e in utilisateur.entreprises"
                  :key="e.id"
                  class="mb-xs"
                >
                  <router-link
                    :to="{ name: 'entreprise', params: { id: e.id } }"
                    class="btn-border small p-s rnd-xs mr-xs"
                  >
                    {{ e.legalSiren ? `${e.nom} (${e.legalSiren})` : e.nom }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="administration" class="tablet-blobs">
            <div class="tablet-blob-1-4">
              <h5>Administration</h5>
            </div>

            <div class="tablet-blob-3-4">
              {{
                `${administration.abreviation}${
                  administration.service ? ` - ${administration.service}` : ''
                }`
              }}
            </div>
          </div>

          <QgisToken :generateTokenCall="generateToken" />
        </div>
      </template>
    </Accordion>
  </div>
</template>

<script>
import { cloneAndClean } from '../utils/index'
import Accordion from './_ui/accordion.vue'
import Pill from './_ui/pill.vue'
import Loader from './_ui/loader.vue'
import UtilisateurEditPopup from './utilisateur/edit-popup.vue'
import UtilisateurRemovePopup from './utilisateur/remove-popup.vue'
import UtilisateurPasswordPopup from './utilisateur/password-popup.vue'
import UtilisateurEmailPopup from './utilisateur/email-popup.vue'
import { isAdministration, isSuper } from 'camino-common/src/roles'
import { Administrations } from 'camino-common/src/static/administrations'
import Icon from './_ui/icon.vue'
import QgisToken from './utilisateur/pure-qgis-token.vue'
import { CaminoRestRoutes } from 'camino-common/src/rest'
import { fetchWithJson } from '@/api/client-rest'

export default {
  components: {
    Icon,
    Accordion,
    Pill,
    Loader,
    QgisToken
  },
  data: () => ({
    userUnwatch: null,
    subscription: { newsletter: false },
    generateToken: async () =>
      fetchWithJson(CaminoRestRoutes.generateQgisToken, {}, 'post')
  }),
  computed: {
    utilisateur() {
      return this.$store.state.utilisateur.element
    },

    administration() {
      return isAdministration(this.utilisateur)
        ? Administrations[this.utilisateur.administrationId]
        : null
    },
    user() {
      return this.$store.state.user.element
    },

    loaded() {
      return !!this.utilisateur
    }
  },

  async created() {
    this.userUnwatch = this.$watch('user', this.get)
    this.$watch('$route.params.id', function (id) {
      if (this.$route.name === 'utilisateur' && id) {
        this.get()
      }
    })
    await this.get()
  },

  beforeUnmount() {
    this.$store.commit('utilisateur/reset')
  },

  methods: {
    async logout() {
      this.eventTrack('deconnexion')
      this.userUnwatch()
      await this.$store.dispatch('user/logout')
      await this.$router.push({ name: 'homepage', force: true })
    },
    eventTrack(id) {
      if (this.$matomo) {
        this.$matomo.trackEvent('menu-utilisateur', 'menu-utilisateur', id)
      }
    },

    async get() {
      const utilisateurId = this.$route.params.id
      await this.$store.dispatch('utilisateur/get', utilisateurId)
      await new Promise(resolve => setTimeout(resolve, 2000))

      this.subscription.newsletter = await (
        await fetch(`/apiUrl/utilisateurs/${utilisateurId}/newsletter`, {
          headers: { 'Content-Type': 'application/json' }
        })
      ).json()
    },

    editPopupOpen() {
      const utilisateur = cloneAndClean(this.utilisateur)

      utilisateur.entreprises = utilisateur.entreprises.map(({ id }) => ({
        id
      }))

      delete utilisateur.sections
      delete utilisateur.modification
      delete utilisateur.suppression

      this.$store.commit('popupOpen', {
        component: UtilisateurEditPopup,
        props: {
          utilisateur,
          action: 'edit',
          subscription: this.subscription
        }
      })
    },

    removePopupOpen() {
      this.$store.commit('popupOpen', {
        component: UtilisateurRemovePopup,
        props: {
          utilisateur: cloneAndClean(this.utilisateur)
        }
      })
    },

    passwordPopupOpen() {
      this.$store.commit('popupOpen', {
        component: UtilisateurPasswordPopup,
        props: {
          utilisateur: cloneAndClean(this.utilisateur)
        }
      })
    },

    emailPopupOpen() {
      this.$store.commit('popupOpen', {
        component: UtilisateurEmailPopup
      })
    },

    isSuper(user) {
      return isSuper(user)
    }
  }
}
</script>
