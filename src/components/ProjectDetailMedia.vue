<script setup>
import { computed, ref, watch } from 'vue'
import PixelScene from '../PixelScene.vue'

const props = defineProps({ project: { type: Object, required: true } })
const images = computed(() => props.project.detailImages?.length
  ? props.project.detailImages
  : props.project.cover ? [props.project.cover] : [])
const activeIndex = ref(0)
const multiple = computed(() => images.value.length > 1)
watch([() => props.project, images], () => { activeIndex.value = 0 })

function move(direction) {
  if (multiple.value) activeIndex.value = (activeIndex.value + direction + images.value.length) % images.value.length
}

let touchStart
let suppressClick = false
function onPointerDown(event) {
  suppressClick = false
  if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY }
}
function onPointerUp(event) {
  if (!touchStart || event.pointerType !== 'touch') return
  const dx = event.clientX - touchStart.x
  const dy = event.clientY - touchStart.y
  touchStart = undefined
  if (multiple.value && Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
    suppressClick = true
    move(dx < 0 ? 1 : -1)
  }
}
function onClick(event) {
  if (suppressClick) { event.preventDefault(); suppressClick = false }
}
</script>

<template>
  <section v-if="images.length" class="project-detail-images" role="region" :aria-label="`${project.title} 详情图片`" :aria-roledescription="multiple ? '轮播图' : undefined" :tabindex="multiple ? 0 : undefined" @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)">
    <figure class="image-frame">
      <div class="image-viewport" @pointerdown="onPointerDown" @pointerup="onPointerUp" @pointercancel="touchStart = undefined" @click.capture="onClick">
        <a :href="images[activeIndex]" target="_blank" rel="noopener noreferrer" :aria-label="`查看 ${project.title} 详情原图 ${activeIndex + 1}`" draggable="false">
          <img :src="images[activeIndex]" :alt="`${project.title} 详情图 ${activeIndex + 1}`" draggable="false">
        </a>
      </div>
      <figcaption>
        <span class="image-counter" aria-live="polite" aria-atomic="true">{{ activeIndex + 1 }} / {{ images.length }}</span>
        <span>点击图片查看原图 ↗</span>
      </figcaption>
    </figure>
    <div v-if="multiple" class="carousel-controls" aria-label="图片切换">
      <button class="carousel-arrow" type="button" aria-label="上一张图片" @click="move(-1)">←</button>
      <div class="carousel-pages">
        <button v-for="(_, index) in images" :key="index" type="button" :class="{ selected: activeIndex === index }" :aria-pressed="activeIndex === index" :aria-label="`查看第 ${index + 1} 张图片`" @click="activeIndex = index">{{ index + 1 }}</button>
      </div>
      <button class="carousel-arrow" type="button" aria-label="下一张图片" @click="move(1)">→</button>
    </div>
  </section>
  <div v-else-if="project.scene" class="image-frame scene-frame"><PixelScene :variant="project.scene" /></div>
</template>

<style scoped>
.project-detail-images{display:grid;gap:14px}
.image-frame{margin:0;border:2px solid var(--subtle);padding:10px;background:var(--bg);box-shadow:4px 4px 0 var(--line)}
.image-viewport{width:100%;aspect-ratio:2/1;max-height:48dvh;background:var(--panel2);overflow:hidden;touch-action:pan-y pinch-zoom}
.image-viewport a{display:block;width:100%;height:100%}
.image-viewport img{display:block;width:100%;height:100%;object-fit:contain;image-rendering:auto;user-select:none}
figcaption{display:flex;justify-content:space-between;gap:12px;padding:10px 2px 0;border-top:1px solid var(--line);margin-top:10px;color:var(--muted);font-size:11px;line-height:1.7}
.image-counter{font-family:Consolas,monospace;color:var(--accent);white-space:nowrap}
.carousel-controls{display:flex;align-items:center;justify-content:center;gap:12px;padding:4px}
.carousel-pages{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}
.carousel-controls button{display:grid;place-items:center;min-width:36px;height:36px;border:1px solid var(--line);background:var(--bg);color:var(--muted);font:13px Consolas,monospace;padding:0 8px}
.carousel-controls .carousel-arrow{flex-shrink:0;width:42px;font-size:20px}
.carousel-controls button:hover{border-color:var(--accent);color:var(--accent)}
.carousel-controls button.selected{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.project-detail-images:focus-visible{outline:2px solid var(--accent);outline-offset:6px}
@media(max-width:600px){.image-frame{padding:6px;box-shadow:3px 3px 0 var(--line)}figcaption{font-size:9px;gap:6px;margin-top:6px;padding-top:7px}.carousel-controls{gap:8px}}
</style>
