<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { getDayScene } from '../data/dayScenes.js'

const hour = ref(new Date().getHours())
const scene = computed(() => getDayScene(hour.value))
let clockTimer

function syncClock() {
  hour.value = new Date().getHours()
}

onMounted(() => {
  syncClock()
  clockTimer = window.setInterval(syncClock, 60_000)
  document.addEventListener('visibilitychange', syncClock)
  window.addEventListener('pageshow', syncClock)
  window.addEventListener('focus', syncClock)
})

onBeforeUnmount(() => {
  window.clearInterval(clockTimer)
  document.removeEventListener('visibilitychange', syncClock)
  window.removeEventListener('pageshow', syncClock)
  window.removeEventListener('focus', syncClock)
})
</script>

<template>
  <div class="hero-art">
    <img class="pixel-scene" :src="scene.src" :alt="`${scene.name}的像素山谷、松林与小屋`" width="640" height="260">
    <div class="scene-caption">
      <span>坐标：我的精神角落</span>
      <span>✦ {{ scene.name }}</span>
    </div>
  </div>
</template>
