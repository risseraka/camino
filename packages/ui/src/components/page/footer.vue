<template>
  <PureFooter :version="version" :displayNewsletter="displayNewsletter" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PureFooter from './pure-footer.vue'
import { useStore } from 'vuex'

const store = useStore()
const version = computed(() => {
  /* global applicationVersion */
  // @ts-ignore
  return applicationVersion
})
const displayNewsletter = computed(() => {
  return !store.state.user.element
})
</script>
