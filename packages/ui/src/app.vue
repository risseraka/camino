<template>
  <div class="page relative">
    <Transition name="slide" mode="out-in">
      <component :is="menu.component" v-if="menu.component" />
    </Transition>

    <header class="header">
      <div class="container">
        <PageHeader :loaded="loaded" />
      </div>
    </header>

    <main class="main">
      <div class="container">
        <Error v-if="error" :message="error" />
        <RouterView v-else-if="loaded" />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <PageFooter />
      </div>
    </footer>

    <div class="messages">
      <Messages id="cmn-app-messages" :messages="messages" />
    </div>

    <Transition name="fade">
      <div
        v-if="!!popup.component"
        class="absolute full bg-inverse-alpha z-2"
      />
    </Transition>

    <Transition name="slide-top">
      <component
        :is="popup.component"
        v-bind="popup.props"
        v-if="popup.component"
      />
    </Transition>

    <Transition name="fade">
      <template v-if="loading || fileLoading.total">
        <div class="loaders fixed p">
          <div v-if="loading" class="loader" />
          <div v-if="fileLoading.total">
            <div class="relative loader-file">
              <div
                class="loader-file-bar"
                :style="{
                  right: `${
                    100 - 100 * (fileLoading.loaded / fileLoading.total)
                  }%`
                }"
              />
            </div>
          </div>
        </div>
      </template>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import Messages from './components/_ui/messages.vue'
import PageHeader from './components/page/header.vue'
import PageFooter from './components/page/footer.vue'
import Error from './components/error.vue'
import { computed, inject } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const matomo = inject('matomo', null)

const user = computed(() => store.state.user.element)

const loaded = computed(() => store.state.user.loaded)

const error = computed(() => store.state.error)

const messages = computed(() => store.state.messages)

const popup = computed(() => store.state.popup)

const menu = computed(() => store.state.menu)

const loading = computed(() => store.state.loading.length > 0)

const fileLoading = computed(() => store.state.fileLoading)

if (matomo) {
  // @ts-ignore
  matomo.customVariableVisitUser(user)
  // @ts-ignore
  matomo.trackPageView()
}
</script>
