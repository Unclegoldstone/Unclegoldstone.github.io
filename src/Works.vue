<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { projects, workErrors } from './data/projects.js'
import ProjectDetailMedia from './components/ProjectDetailMedia.vue'
import MarkdownArticle from './components/MarkdownArticle.vue'
import PageTransition from './components/PageTransition.vue'

const category=ref('全部'),query=ref(''),sort=ref('default'),light=ref(false),selected=ref(null),dialog=ref(null)
const development=import.meta.env.DEV
const categories=['全部','个人项目','合作项目','小工具']
const visibleProjects=computed(()=>{
  const result=projects.filter(p=>(category.value==='全部'||p.type===category.value)&&`${p.title} ${p.desc} ${p.tags.join(' ')}`.toLowerCase().includes(query.value.toLowerCase()))
  return sort.value==='newest'?[...result].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)):result
})
let returnFocus,previousOverflow=''
async function open(project){returnFocus=document.activeElement;previousOverflow=document.body.style.overflow;selected.value=project;await nextTick();dialog.value.showModal();document.body.style.overflow='hidden'}
function closed(){selected.value=null;document.body.style.overflow=previousOverflow;returnFocus?.focus()}
function toggleTheme(){light.value=!light.value;document.body.classList.toggle('light',light.value)}
onBeforeUnmount(()=>{document.body.classList.remove('light');if(selected.value)document.body.style.overflow=previousOverflow})
</script>
<template>
  <PageTransition />
  <header><a class="brand" href="./index.html"><b>G</b><span>GOLDSTONE<small>每个像素都有自己的可能</small></span></a><nav aria-label="网站导航"><a class="nav-other" href="./index.html">首页 ↗</a><a href="./works.html" aria-current="page">WORKS</a><a class="nav-other" href="./blog.html">BLOGS ↗</a><button id="theme" :aria-label="light?'切换深色主题':'切换浅色主题'" @click="toggleTheme">{{light?'☾':'☼'}}</button></nav></header>
  <main id="top">
    <div class="breadcrumb"><a href="./index.html">小站入口</a><span>/</span>创作陈列室<small>WORKS / GOLDSTONE</small></div>
    <section class="intro"><div><p class="eyebrow">THE WORKS OF GOLDSTONE</p><h1>让想法落地，<br>也让好奇心<span>有处安放。</span></h1><p class="intro-text">一些解决小问题的工具，一些认真做过的尝试。<br>把每一次创造，都留在这里。</p></div><div class="index-card"><span class="index-symbol" aria-hidden="true">✳</span><p>BUILD SMALL.<br>MAKE IT MATTER.</p><div><span>持续创造中 <i></i></span><span>EST. 2026</span></div></div></section>
    <aside v-if="development&&workErrors.length" class="work-errors" role="alert"><strong>部分作品未能加载</strong><p v-for="error in workErrors" :key="error.filename">{{error.filename}}：{{error.message}}</p></aside>
    <section id="collection" aria-labelledby="collection-title"><div class="section-top"><div><span class="eyebrow">01 / COLLECTION</span><h2 id="collection-title">我的作品 <small>{{String(visibleProjects.length).padStart(2,'0')}}</small></h2></div><p>I just accept what's in front of me</p></div>
      <div class="toolbar"><div class="filters" role="group" aria-label="筛选作品"><button v-for="item in categories" :key="item" :aria-pressed="category===item" @click="category=item">{{item}}<small>{{String(projects.filter(p=>item==='全部'||p.type===item).length).padStart(2,'0')}}</small></button></div><div class="tools"><label class="search"><span aria-hidden="true">⌕</span><input v-model="query" type="search" placeholder="找一个作品…" aria-label="搜索作品"></label><select v-model="sort" aria-label="作品排序"><option value="default">默认顺序</option><option value="newest">发布日期 · 最新</option></select></div></div>
      <div class="grid"><button v-for="project in visibleProjects" :key="project.id" class="card" :aria-label="`查看 ${project.title} 详情`" @click="open(project)"><div class="card-art"><img :src="project.cover" :alt="`${project.title} 缩略图`" loading="lazy"></div><div class="card-copy"><div class="card-meta"><span>{{project.type}}</span><time :datetime="project.publishedAt||undefined">{{project.publishedAt||'发布日期待补充'}}</time></div><h3>{{project.title}}</h3><p>{{project.desc}}</p><div class="tags"><span v-for="tag in project.tags" :key="tag">{{tag}}</span></div><div class="card-end"><span>查看作品介绍</span><span>↗</span></div></div></button><p v-if="!visibleProjects.length" class="empty">没有找到匹配的作品，换个分类或关键词试试。</p></div>
      <div class="collection-end"><span>✦</span><p>还有一些想法，正在慢慢成形。</p><small>MORE LITTLE THINGS ARE ON THE WAY.</small></div>
    </section>
    <footer><span>© {{new Date().getFullYear()}} GOLDSTONE · 创作陈列室</span><a href="./blog.html">去文字角落看看 ↗</a><a href="#top">回到顶部 ↑</a></footer>
  </main>
  <dialog ref="dialog" aria-labelledby="detail-title" @close="closed" @click="event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()}}">
    <template v-if="selected"><div class="dialog-top"><time class="eyebrow" :datetime="selected.publishedAt||undefined">{{selected.publishedAt?`发布于 ${selected.publishedAt}`:'发布日期待补充'}}</time><button id="close" aria-label="关闭作品详情" @click="dialog.close()">×</button></div><ProjectDetailMedia :project="selected"/><div class="detail-info"><span class="category-label">{{selected.type}}</span><h2 id="detail-title">{{selected.title}}</h2><div class="tags"><span v-for="tag in selected.tags" :key="tag">{{tag}}</span></div><MarkdownArticle :article="{html:selected.bodyHtml,toc:[]}"/><a v-if="selected.downloadUrl" id="github" :href="selected.downloadUrl" target="_blank" rel="noopener noreferrer">GitHub link <span>↗</span></a><small v-if="selected.isExample" id="example-note">示例项目</small></div></template>
  </dialog>
</template>
