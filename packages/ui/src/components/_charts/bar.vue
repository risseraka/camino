<template>
  <canvas ref="myCanvas" />
</template>

<script setup lang="ts">
import {
  Chart,
  LinearScale,
  BarController,
  CategoryScale,
  BarElement,
  LineController,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip
} from 'chart.js'
import { withDefaults, ref, onMounted, onUnmounted } from 'vue'

Chart.register(
  LinearScale,
  BarController,
  CategoryScale,
  BarElement,
  LineController,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip
)

const props = withDefaults(
  defineProps<{
    // TODO 2022-09-29: Type this, this should be generic
    data: any
    aspectRatio?: number
    suggestedMax?: number
  }>(),
  { aspectRatio: 2, suggestedMax: 0 }
)

const myCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null
onMounted(() => {
  const context = myCanvas.value?.getContext('2d')
  if (!context) {
    console.error('le canvas ne devrait pas être null')
  } else {
    chart = new Chart(context, {
      type: 'bar',
      data: props.data,
      options: {
        locale: 'fr-FR',
        aspectRatio: props.aspectRatio,
        responsive: true,
        scales: {
          bar: { min: 0, suggestedMax: props.suggestedMax },
          line: { min: 0, position: 'right' }
        },
        plugins: {
          legend: {
            reverse: true
          }
        }
      }
    })
  }
})

onUnmounted(() => {
  if (chart !== null) {
    chart.destroy()
    chart = null
  }
})
</script>
