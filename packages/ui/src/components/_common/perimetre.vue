<template>
  <div>
    <div class="tablet-blobs tablet-flex-direction-reverse">
      <div class="tablet-blob-1-2 flex">
        <Download
          v-if="points.length && titreId"
          :section="`titres/${titreId}`"
          format="geojson"
          class="btn-border small pill pl pr-m py-s flex-right"
        >
          geojson
        </Download>
      </div>

      <div class="tablet-blob-1-2 flex">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="mr-xs"
          :class="{ active: tabId === tab.id }"
        >
          <button
            v-if="tabId !== tab.id"
            class="p-m btn-tab rnd-t-s"
            @click="tabUpdate(tab.id)"
          >
            <Icon :name="tab.icon" size="M" />
          </button>
          <div v-else class="p-m span-tab rnd-t-s">
            <Icon :name="tab.icon" size="M" />
          </div>
        </div>
      </div>
    </div>

    <div class="line-neutral" :class="{ 'width-full': isMain }" />

    <CaminoMap
      v-if="points && geojsonMultiPolygon && tabId === 'carte'"
      :class="{ 'width-full': isMain }"
      :geojson="geojsonMultiPolygon"
      :points="points"
      :domaineId="domaineId"
      :titreTypeId="titreTypeId"
      :isMain="isMain"
    />

    <div
      v-if="points && tabId === 'points'"
      class="points bg-alt"
      :class="{ 'width-full': isMain }"
    >
      <div class="bg-bg py" :class="{ container: isMain }">
        <Points :points="points" />
      </div>
    </div>

    <div class="line mb" :class="{ 'width-full': isMain }" />
  </div>
</template>

<script>
import CaminoMap from './map.vue'
import Points from './points.vue'
import Download from './download.vue'
import Icon from '@/components/_ui/icon.vue'

export default {
  components: {
    Icon,
    CaminoMap,
    Points,
    Download
  },

  props: {
    points: { type: Array, required: true },
    geojsonMultiPolygon: { type: Object, required: true },
    domaineId: { type: String, required: true },
    titreTypeId: { type: String, required: true },
    titreId: { type: String, default: '' },
    isMain: { type: Boolean, default: false },
    tabId: { type: String, default: 'carte' }
  },

  emits: ['tab-update'],

  data() {
    return {
      tabs: [
        { id: 'carte', nom: 'Carte', icon: 'globe' },
        { id: 'points', nom: 'Points', icon: 'list' }
      ]
    }
  },

  methods: {
    tabUpdate(tabId) {
      this.$emit('tab-update', tabId)
    }
  }
}
</script>
