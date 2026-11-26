<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { pageTransition as config } from '../transitions/config.js'
import { worldLocations, worldRoutes, findWorldRoute } from '../transitions/routes.js'
import smithyUrl from '../assets/transitions/works-smithy.png'
import mapUrl from '../assets/transitions/world-map-transparent.png'
import sheetUrl from '../assets/transitions/traveler-walk.png'

const visible = ref(false), mode = ref('map'), progress = ref(0), small = ref(false), waitingAssets = ref(false)
const source = ref('home'), target = ref('blog'), pathElement = ref(null), overlay = ref(null)
const x = ref(1078), y = ref(516), row = ref(2), frame = ref(1)
const sheetWidth = ref(1254), sheetHeight = ref(1254)
const names = Object.fromEntries(Object.entries(worldLocations).map(([id, value]) => [id, value.name]))
const activeRoute = ref(worldRoutes[0])
const inactiveRoutes = computed(() => worldRoutes.filter(route => route.id !== activeRoute.value.id))
const smithy = worldLocations.works.icon
const spriteViewBox = computed(() => `${frame.value * sheetWidth.value / 4} ${row.value * sheetHeight.value / 4} ${sheetWidth.value / 4} ${sheetHeight.value / 4}`)
let animation, fallbackTimer, assetRequest, assetsReady = false, savedOverflow = '', previousFocus, navigationId = 0
const directory = new URL('./', location.href).pathname
const app = () => document.querySelector('#app')

function pageFor(url) {
  if (url.origin !== location.origin) return null
  if (url.pathname === `${directory}blog.html`) return 'blog'
  if (url.pathname === `${directory}works.html`) return 'works'
  if (url.pathname === directory || url.pathname === `${directory}index.html`) return 'home'
  return null
}
// Warm map images on navigation intent, rather than on every page's first load.
function warmAssets() {
  if (!assetRequest) {
    const map = new Image(), sheet = new Image(), smithyImage = new Image()
    map.src = mapUrl; sheet.src = sheetUrl; smithyImage.src = smithyUrl
    assetRequest = Promise.all([map.decode(),sheet.decode(),smithyImage.decode()]).then(()=>{
      sheetWidth.value=sheet.naturalWidth; sheetHeight.value=sheet.naturalHeight; assetsReady=true
      return true
    }).catch(()=>{assetRequest=null;return false})
  }
  return assetRequest
}
function navigationIntent(event) {
  if (config.style !== 'map' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const link=event.target instanceof Element?event.target.closest('a[href]'):null
  if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return
  const from=pageFor(new URL(location.href)),to=pageFor(new URL(link.href,location.href))
  if (from && to && from!==to) warmAssets()
}
function reset() {
  navigationId++
  waitingAssets.value = false
  cancelAnimationFrame(animation)
  clearTimeout(fallbackTimer)
  if (visible.value) {
    document.body.style.overflow = savedOverflow
    if (app()) { app().inert = false; app().removeAttribute('aria-busy') }
    previousFocus?.focus({ preventScroll: true })
  }
  visible.value = false
}
function navigate(url) {
  // 原始 URL（含文章或首页锚点）完整保留。
  location.assign(url.href)
}
async function handleClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self') || link.dataset.transition === 'none') return
  const url = new URL(link.href, location.href)
  const from = pageFor(new URL(location.href)), to = pageFor(url)
  if (!from || !to || from === to || !['map', 'fade'].includes(config.style)) return
  event.preventDefault()
  if (visible.value) return
  const request = ++navigationId
  source.value = from; target.value = to
  activeRoute.value = findWorldRoute(from, to)
  progress.value = 0
  mode.value = config.style === 'map' && activeRoute.value && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'map' : 'fade'
  waitingAssets.value = mode.value === 'map' && !assetsReady
  savedOverflow = document.body.style.overflow
  previousFocus = document.activeElement
  visible.value = true
  document.body.style.overflow = 'hidden'
  if (app()) { app().inert = true; app().setAttribute('aria-busy', 'true') }
  // 若动画意外中断，也不会把用户留在遮罩上。
  fallbackTimer = setTimeout(() => navigate(url), config.durationMs + 8300)
  await nextTick()
  overlay.value?.focus({ preventScroll: true })
  if (mode.value === 'map' && !assetsReady) {
    let timeout
    const ready = await Promise.race([warmAssets(),new Promise(resolve=>{timeout=setTimeout(()=>resolve(false),8000)})])
    clearTimeout(timeout)
    if (request !== navigationId) return
    waitingAssets.value=false
    if (!ready) mode.value='fade'
    await nextTick()
  }
  if (mode.value === 'fade') {
    clearTimeout(fallbackTimer)
    fallbackTimer = setTimeout(() => navigate(url), 120)
    return
  }
  clearTimeout(fallbackTimer)
  fallbackTimer = setTimeout(() => navigate(url), config.durationMs + 300)
  const path = pathElement.value, length = path.getTotalLength()
  const reverse = activeRoute.value.reverse
  const duration = Math.max(1, config.durationMs - config.openingMs - config.arrivalMs)
  const started = performance.now()
  function tick(now) {
    const elapsed = now - started
    const t = Math.max(0, Math.min(1, (elapsed - config.openingMs) / duration))
    const distance = length * (reverse ? 1 - t : t)
    const p = path.getPointAtLength(distance)
    const q = path.getPointAtLength(Math.max(0, Math.min(length, distance + (reverse ? -3 : 3))))
    const dx = q.x - p.x, dy = q.y - p.y
    x.value = Math.round(p.x); y.value = Math.round(p.y)
    if (Math.abs(dx) + Math.abs(dy) > 0.01) row.value = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0)
    frame.value = t === 0 || t === 1 ? 1 : Math.floor((elapsed - config.openingMs) / 1000 * config.walkFps) % 4
    progress.value = t
    if (elapsed >= config.durationMs) { clearTimeout(fallbackTimer); navigate(url) }
    else animation = requestAnimationFrame(tick)
  }
  // 首次绘制立即定位在当前地点，避免返回时闪到路线另一端。
  tick(started)
}
function resize() { small.value = innerWidth < 600 }
function restoreFromHistory() { reset() }
onMounted(() => {
  resize()
  document.addEventListener('click', handleClick)
  document.addEventListener('pointerover',navigationIntent)
  document.addEventListener('focusin',navigationIntent)
  window.addEventListener('resize', resize)
  window.addEventListener('pageshow', restoreFromHistory)
})
onBeforeUnmount(() => {
  reset()
  document.removeEventListener('click', handleClick)
  document.removeEventListener('pointerover',navigationIntent)
  document.removeEventListener('focusin',navigationIntent)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pageshow', restoreFromHistory)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" ref="overlay" class="world-transition" :class="`world-transition--${mode}`" tabindex="-1" role="status" aria-live="polite" :aria-label="`正在从${names[source]}前往${names[target]}`">
      <template v-if="mode === 'map'">
        <div class="world-transition__heading"><span>GOLDSTONE / WORLD MAP</span><p>{{ names[source] }} <b aria-hidden="true">→</b> {{ names[target] }}</p></div>
        <p v-if="waitingAssets" class="world-transition__loading" role="status">正在展开地图…</p><svg v-else class="world-transition__map" :viewBox="small ? activeRoute.mobileViewBox : '0 0 1672 941'" :data-route="activeRoute.id" :data-from="source" :data-to="target" :style="{ '--opening-duration': `${config.openingMs}ms` }" aria-hidden="true">
          <image :href="mapUrl" width="1672" height="941" />
          <path v-for="route in inactiveRoutes" :key="route.id" :d="route.path" fill="none" stroke="#986438" stroke-width="4" stroke-dasharray="12 11" opacity="0.45" />
          <path ref="pathElement" :d="activeRoute.path" fill="none" stroke="#986438" stroke-width="5" stroke-dasharray="12 11" />
          <image :href="smithyUrl" :x="smithy.x" :y="smithy.y" :width="smithy.width" :height="smithy.height" />
          <svg :x="x - 48" :y="y - 90" width="96" height="96" :viewBox="spriteViewBox" overflow="hidden" class="world-transition__traveler">
            <image :href="sheetUrl" :width="sheetWidth" :height="sheetHeight" />
          </svg>
        </svg>
        <div class="world-transition__footer"><span>{{ waitingAssets ? '正在准备前往下一个角落' : progress < 1 ? '沿着像素小路，去下一个角落' : '已经抵达，即将展开新的故事' }}</span><div class="world-transition__progress"><i :style="{ transform: `scaleX(${progress})` }"></i></div></div>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.world-transition{--transition-bg:#142527;--transition-text:#e9e2cf;--transition-muted:#aebba9;--transition-accent:#b8da86;--transition-track:#3d5148;position:fixed;inset:0;z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--transition-bg);color:var(--transition-text);outline:none;padding:20px;cursor:progress;isolation:isolate}
.world-transition__heading{text-align:center;flex-shrink:0}.world-transition__heading>span{font:10px Consolas,monospace;letter-spacing:3px;color:var(--transition-accent)}.world-transition__heading p{font-size:20px;margin:12px 0 0}.world-transition__heading b{font-weight:400;color:var(--transition-accent);margin:0 14px}
.world-transition__map{display:block;width:min(1100px,100%);max-height:70dvh;min-height:0;flex:0 1 auto;margin:12px 0;animation:unroll var(--opening-duration,160ms) ease-out both}
.world-transition__traveler{image-rendering:pixelated}.world-transition__footer{text-align:center;flex-shrink:0;font-size:12px;color:var(--transition-muted)}.world-transition__progress{width:180px;height:4px;background:var(--transition-track);margin:16px auto 0}.world-transition__progress i{height:100%;display:block;background:var(--transition-accent);transform-origin:left}
:global(html[data-theme='light'] .world-transition){--transition-bg:#f1efe5;--transition-text:#263a32;--transition-muted:#576b5c;--transition-accent:#476736;--transition-track:#c5cbbc}
.world-transition__loading{display:grid;place-items:center;min-height:220px;color:var(--transition-muted);font-size:13px}
.world-transition--fade{animation:appear .12s ease-out both}
@keyframes unroll{from{clip-path:inset(0 48%)}to{clip-path:inset(0)}}@keyframes appear{from{opacity:0}to{opacity:1}}
@media(max-width:599px){.world-transition{padding:20px 0}.world-transition__map{width:100%;margin:26px 0}.world-transition__heading p{font-size:18px}.world-transition__footer{font-size:11px;padding:0 16px}}
@media(prefers-reduced-motion:reduce){.world-transition{animation:none}}
</style>
