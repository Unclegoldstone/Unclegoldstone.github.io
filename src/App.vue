<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import ProjectDetailMedia from './components/ProjectDetailMedia.vue'
import CatCompanion from './CatCompanion.vue'
import profileAvatar from './assets/profile-gourd-pixel.png'
import SidebarActions from './SidebarActions.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import NotesSection from './components/NotesSection.vue'
import HomeTyping from './components/HomeTyping.vue'
import DayScene from './components/DayScene.vue'
import { projects } from './data/projects.js'
import { notes } from './data/notes.js'
import { useActiveSection } from './composables/useActiveSection.js'

const leftOpen = ref(false), rightOpen = ref(false), compact = ref(false)
const active = ref('home'), light = ref(false), selected = ref(null)
const dialog = ref(null)
const level = new Date().getFullYear() - 2003 + 1
let returnFocus
const links = [{ id: 'home', icon: '⌂', name: '首页', en: 'HOME' }, { id: 'projects', icon: '▦', name: '我的作品', en: 'PROJECTS' }, { id: 'notes', icon: '≡', name: '随笔记录', en: 'JOURNAL' }, { id: 'about', icon: '☺', name: '关于我', en: 'ABOUT' }]

useActiveSection(active, links.map(link => link.id))

function syncLayout() {
  const nextCompact = window.innerWidth < 1100
  if (nextCompact !== compact.value) { compact.value = nextCompact; leftOpen.value = !nextCompact; rightOpen.value = !nextCompact }
}
function toggle(side) {
  if (side === 'left') { leftOpen.value = !leftOpen.value; if (compact.value) rightOpen.value = false }
  else { rightOpen.value = !rightOpen.value; if (compact.value) leftOpen.value = false }
}
function closeSides() { leftOpen.value = false; rightOpen.value = false }
function go(id) { active.value = id; if (compact.value) closeSides(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
async function openDetail(item) { returnFocus = document.activeElement; selected.value = item; await nextTick(); dialog.value.showModal() }
function closeDetail() { dialog.value.close() }
function onDialogClose() { selected.value = null; returnFocus?.focus() }
function onKey(e) { if (e.key === 'Escape' && compact.value) closeSides() }
watch([leftOpen, rightOpen, compact], () => { document.body.classList.toggle('drawer-open', compact.value && (leftOpen.value || rightOpen.value)) })
onMounted(() => { compact.value = window.innerWidth < 1100; leftOpen.value = !compact.value; rightOpen.value = !compact.value; window.addEventListener('resize', syncLayout); window.addEventListener('keydown', onKey) })
onUnmounted(() => { window.removeEventListener('resize', syncLayout); window.removeEventListener('keydown', onKey); document.body.classList.remove('drawer-open') })
</script>

<template>
  <div class="site" :class="{ light, 'left-open': leftOpen, 'right-open': rightOpen }">
    <header class="topbar">
      <a class="brand" href="#home" @click.prevent="go('home')"><span class="brand-mark">G</span><span>GOLDSTONE<span class="brand-sub">每个像素都有自己的可能</span></span></a>
      <div class="header-center"><span class="status-dot"></span> PERSONAL SPACE <span class="header-slash">/</span> EST. 2026</div>
      <div class="header-actions"><button class="icon-button" :aria-expanded="leftOpen" aria-controls="left-sidebar" aria-label="切换导航侧栏" @click="toggle('left')">☰</button><button class="icon-button theme-button" :aria-label="light ? '切换深色主题' : '切换浅色主题'" @click="light = !light">{{ light ? '☾' : '☼' }}</button><button class="icon-button" :aria-expanded="rightOpen" aria-controls="right-sidebar" aria-label="切换个人信息侧栏" @click="toggle('right')">▥</button></div>
    </header>

    <button v-if="compact && (leftOpen || rightOpen)" class="backdrop" aria-label="关闭侧栏" @click="closeSides"></button>

    <div class="layout">
      <aside v-if="leftOpen" id="left-sidebar" class="sidebar left-sidebar" aria-label="网站导航">
        <div class="sidebar-heading"><span>探索小站</span><button class="small-button" aria-label="收起导航侧栏" @click="toggle('left')">←</button></div>
        <nav><a v-for="link in links" :key="link.id" :href="`#${link.id}`" :class="{ active: active === link.id }" :aria-current="active === link.id ? 'location' : undefined" @click.prevent="go(link.id)"><span class="nav-icon">{{ link.icon }}</span><span>{{ link.name }}<small>{{ link.en }}</small></span><span v-if="active === link.id" class="nav-arrow">›</span></a></nav>
        <div class="sidebar-divider"></div>
        <p class="tiny-label">THE LITTLE THINGS</p>
        <a class="quiet-link" href="#notes" @click.prevent="go('notes')"><span>✧</span> 灵感与日常 <span class="count">{{ String(notes.length).padStart(2, '0') }}</span></a>
        <a class="quiet-link" href="#projects" @click.prevent="go('projects')"><span>◇</span> 创作实验室 <span class="count">{{ String(projects.length).padStart(2, '0') }}</span></a>
        <div class="sidebar-bottom"><div class="pixel-sprout">♧</div><p>慢慢探索，<br>这里总有新的故事。</p><span class="tiny-label">STAY CURIOUS, KEEP BUILDING.</span><SidebarActions /></div>
      </aside>

      <main id="main-content">
        <section id="home" class="welcome-section">
          <div class="breadcrumb">小站入口 <span>/</span> <b class="welcome-breadcrumb">Welcome to my World</b><span class="page-number">PAGE 001</span></div>
          <div class="hero">
            <div class="hero-copy"><HomeTyping /><h1>在数字世界里，<br>留下一点<span>自己的痕迹。</span></h1><p>你好，我是 Goldstone。<br>这里收藏我的作品、想法，以及日常里的微小闪光。</p><button class="primary-button" @click="go('projects')">探索我的作品 <span>↗</span></button><button class="text-button" @click="go('about')">认识一下我 →</button></div>
            <DayScene />
          </div>
          <div class="welcome-note"><span class="note-icon">✦</span><span>欢迎路过我的像素小站。找个舒服的位置，随便看看吧。</span><span class="note-end">MAKE YOURSELF AT HOME</span></div>
        </section>

        <ProjectsSection :projects="projects" @open-detail="openDetail" />

        <NotesSection :notes="notes" @open-detail="openDetail" />

        <section id="about" class="about-panel"><div class="about-symbol">✳</div><div><span class="eyebrow">A LITTLE ABOUT ME</span><h2>保持好奇，持续创造。</h2><p>我希望把这里变成一个长期生长的个人空间：写一点文字，做一点有趣的东西，也认真记录生活。</p><span class="demo-label">当前个人介绍、作品与随笔均为示例，等待你的故事填满。</span></div></section>
        <footer class="footer"><span>© 2026 GOLDSTONE</span><span>用好奇心构建 <b>✦</b> 用像素点缀</span><button @click="go('home')">回到顶部 ↑</button></footer>
      </main>

      <aside v-if="rightOpen" id="right-sidebar" class="sidebar right-sidebar" aria-label="个人信息">
        <div class="sidebar-heading"><span>这个小站的主人</span><button class="small-button" aria-label="收起个人信息侧栏" @click="toggle('right')">→</button></div>
        <div class="profile"><div class="avatar"><img :src="profileAvatar" alt="Goldstone 的像素葫芦头像" width="58" height="58"><span class="avatar-badge">✦</span></div><h2>Goldstone<span>Lv. {{ level }}</span></h2><p>探索 · 记录 · 创造</p><span class="profile-status"><span class="status-dot"></span> 正在构建自己的小世界</span></div>
        <div class="sidebar-divider"></div>
        <div class="currently"><p class="tiny-label">NOW / 此刻</p><div><span>⌘</span><p>正在折腾<small>我的第一个像素网站</small></p></div><div><span>♬</span><p>今日氛围<small>Lo-fi & 一杯热咖啡</small></p></div><div><span>✧</span><p>一点提醒<small>进步可以慢一点</small></p></div></div>
        <div class="quote"><span>“</span><p>每一个大大的世界，<br>都从一个小小的像素开始。</p><small>ONE PIXEL AT A TIME.</small></div><div class="right-bottom"><span class="status-dot"></span> 很高兴在这里遇见你。</div>
        <CatCompanion />
      </aside>
    </div>

    <dialog ref="dialog" class="detail-dialog" :class="{ 'image-detail': selected?.detailImages?.length || selected?.cover }" @close="onDialogClose" @click="(e) => { if (e.target === dialog) closeDetail() }"><template v-if="selected"><div class="dialog-top"><template v-if="selected.type"><time v-if="selected.publishedAt" class="tiny-label" :datetime="selected.publishedAt">发布于 {{ selected.publishedAt }}</time><span v-else class="tiny-label">发布日期待补充</span></template><span v-else class="tiny-label">GOLDSTONE / JOURNAL</span><button class="icon-button" aria-label="关闭详情" @click="closeDetail">×</button></div><ProjectDetailMedia :project="selected" /><h2>{{ selected.title }}</h2><p class="detail-body">{{ selected.body }}</p><p v-if="selected.downloadUrl" class="detail-download">下载链接：<a :href="selected.downloadUrl" target="_blank" rel="noopener noreferrer">{{ selected.downloadUrl }} ↗</a></p><span v-if="selected.isExample !== false" class="demo-label">示例内容 · 可在项目源文件中替换</span></template></dialog>
  </div>
</template>
