<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import PixelScene from '../PixelScene.vue'

const props = defineProps({ projects: { type: Array, required: true } })
const emit = defineEmits(['open-detail'])
const filter = ref('全部')
const filters = ['全部', '个人项目', '合作项目', '小工具']
const projectStrip = ref(null)
const projectsRegion = ref(null)
onMounted(() => projectsRegion.value?.addEventListener('wheel', scrollProjects, { passive: false }))
onBeforeUnmount(() => projectsRegion.value?.removeEventListener('wheel', scrollProjects))
watch(filter, () => { if (projectStrip.value) projectStrip.value.scrollLeft = 0 }, { flush: 'post' })
const visibleProjects = computed(() => props.projects.filter(project => filter.value === '全部' || project.type === filter.value))
const projectCount = computed(() => String(props.projects.length).padStart(2, '0'))

function scrollProjects(event) {
  // Wheel input also works on touch-screen computers; touch swipes stay native.
  if (event.ctrlKey || event.metaKey) return
  if (!event.cancelable || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
  const strip = projectStrip.value
  if (!strip) return
  const maxScroll = strip.scrollWidth - strip.clientWidth
  if (maxScroll <= 1) return
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? strip.clientWidth : 1
  const delta = event.deltaY * unit
  const position = strip.scrollLeft
  if ((delta > 0 && position >= maxScroll - 1) || (delta < 0 && position <= 1)) return
  event.preventDefault()
  strip.scrollLeft = Math.max(0, Math.min(maxScroll, position + delta))
}
</script>

<template>
  <section ref="projectsRegion" id="projects" class="content-section">
    <div class="section-heading">
      <div>
        <span class="section-index">01 /</span>
        <h2>我的作品</h2>
        <span class="section-en">MY PROJECTS</span>
      </div>
      <span class="section-count">{{ projectCount }} 件小小创作</span>
    </div>
    <div class="filters" aria-label="筛选作品">
      <button v-for="tag in filters" :key="tag" :class="{ selected: filter === tag }" :aria-pressed="filter === tag" @click="filter = tag">
        {{ tag }}<span v-if="tag === '全部'"> {{ projectCount }}</span>
      </button>
      <span class="filter-note">I just accept  what's in front of me</span>
    </div>
    <p v-if="visibleProjects.length === 0" class="projects-empty" role="status">这个分类暂时还没有作品，敬请期待。</p>
    <div ref="projectStrip" class="project-grid" role="region" aria-label="作品卡片，可水平滚动" tabindex="0">
      <button v-for="project in visibleProjects" :key="project.no" class="project-card" @click="emit('open-detail', project)">
        <div class="project-art">
          <PixelScene :variant="project.scene" />
          <span class="project-number">PROJECT_{{ project.no }}</span>
          <span class="art-arrow">↗</span>
        </div>
        <div class="project-copy">
          <div class="tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div>
          <h3>{{ project.title }}</h3>
          <p>{{ project.desc }}</p>
          <div class="project-footer"><span>查看作品介绍</span><span>→</span></div>
        </div>
      </button>
    </div>
  </section>
</template>
