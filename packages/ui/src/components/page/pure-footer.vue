<template>
  <div class="tablet-blobs pt flex-align-items-stretch">
    <div class="tablet-blob-1 desktop-blob-1-3">
      <ul class="list-sans text-decoration-none li-sep mb-0">
        <li>
          <a href="https://economie.gouv.fr/"
            >Ministère de l'Économie, des Finances et de la Souveraineté
            industrielle et numérique</a
          >
        </li>
        <li>
          <a href="https://ecologie.gouv.fr/"
            >Ministère de la Transition écologique</a
          >
        </li>
        <li>
          <a href="https://onf.fr/">Office National des forêts</a>
        </li>
        <li>
          <div class="blobs">
            <div class="blob-1-3">
              <img
                class="sponsor"
                src="@/public/img/logo-fabriquenumerique.svg"
              />
            </div>
            <div class="blob-2-3">
              <p class="h6 mb-0">
                La Fabrique numérique du Ministère de la Transition écologique,
                membre du réseau
                <a href="http://beta.gouv.fr">beta.gouv.fr</a>.
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="tablet-blob-1-2 desktop-blob-1-3 flex flex-direction-column">
      <ul class="list-prefix text-decoration-none li-mb-s">
        <li>
          <router-link to="/contacts">Contact</router-link>
        </li>
        <li>
          <router-link to="/a-propos">À propos</router-link>
        </li>
        <li>
          <router-link to="/mentions-legales">Mentions légales</router-link>
        </li>
        <li>
          <router-link to="/cgu">CGU</router-link>
        </li>
        <li>
          <router-link to="/accessibilite"
            >Accessibilité : non conforme</router-link
          >
        </li>
        <li>
          <router-link to="/contribution">Contribution</router-link>
        </li>
      </ul>
    </div>

    <div class="tablet-blob-1-2 desktop-blob-1-3 flex flex-direction-column">
      <NewsletterForm v-if="displayNewsletter" class="mb-xxs" />
      <ul class="list-prefix text-decoration-none li-mb-s">
        <li>
          <a
            href="https://www.dailymotion.com/camino-le-cadastre-minier"
            target="_blank"
            rel="noopener noreferrer"
            >Tutoriels</a
          >
        </li>
        <li>
          <a
            href="https://docs.camino.beta.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            >Open data et documentation</a
          >
        </li>
        <li>
          <a
            href="http://www.mineralinfo.fr/"
            target="_blank"
            rel="noopener noreferrer"
            >MineralInfo
          </a>
        </li>
        <li>
          <a
            href="http://www.minergies.fr/"
            target="_blank"
            rel="noopener noreferrer"
            >Minergies
          </a>
        </li>
      </ul>

      <p class="h6 flex-bottom flex-self-end">
        <a
          href="https://github.com/MTES-MCT/camino/releases"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
          >Version {{ version }}
        </a>
      </p>
    </div>
    <div style="bottom: 20px; position: fixed; right: 16px; z-index: 10001">
      <a
        href="https://jedonnemonavis.numerique.gouv.fr/Demarches/3390?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=da03d611d9055a97a214b2623f034e40"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          style="max-width: 120px; width: calc(var(--unit) * 5)"
          src="@/public/img/je-donne-mon-avis.svg"
          alt="Je donne mon avis"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import NewsletterForm from './footer/newsletter-form.vue'

defineProps<{ version: string; displayNewsletter: boolean }>()
</script>
