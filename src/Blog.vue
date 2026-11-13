<script setup>
import BlogLoadNotice from './components/BlogLoadNotice.vue'
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { posts } from './data/posts.js'
import avatar from './assets/profile-gourd-pixel.png'
import DayScene from './components/DayScene.vue'
import MarkdownArticle from './components/MarkdownArticle.vue'

const category = ref('全部'), query = ref(''), light = ref(false), slug = ref('')
const categories = ['全部', ...new Set(posts.flatMap(post => post.categories))]
const article = computed(() => posts.find(post => post.slug === slug.value))
const filtered = computed(() => posts.filter(post => (category.value === '全部' || post.categories.includes(category.value)) && `${post.title} ${post.excerpt} ${post.categories.join(' ')} ${post.text}`.toLowerCase().includes(query.value.trim().toLowerCase())))
const archives = computed(() => [...new Set(posts.map(post => post.publishedAt.slice(0, 7)))])
const readingTime = post => Math.max(1, Math.ceil(post.text.length / 350))
function selectCategory(tag) {
  category.value = tag; query.value = ''; slug.value = ''
  history.replaceState(null, '', './blog.html')
  document.title = 'Blog · Goldstone 的文字角落'
  window.scrollTo({ top: 0, behavior: 'instant' })
}
function syncRoute() {
  try { slug.value = decodeURIComponent(location.hash.slice(1)) } catch { slug.value = '' }
  window.scrollTo({ top: 0, behavior: 'instant' })
}
watch(article, value => { document.title = value ? `${value.title} · Goldstone Blog` : 'Blog · Goldstone 的文字角落' })
onMounted(() => { syncRoute(); window.addEventListener('hashchange', syncRoute) })
onBeforeUnmount(() => window.removeEventListener('hashchange', syncRoute))
</script>

<template>
  <div class="site blog-site" :class="{ light }">
    <header class="blog-header">
      <a class="brand" href="./index.html"><span class="brand-mark">G</span><span>GOLDSTONE<span class="brand-sub">每个像素都有自己的可能</span></span></a>
      <nav aria-label="Blog 导航"><a href="./index.html">小站首页 ↗</a><a href="./blog.html" class="current" aria-current="page">BLOG</a><button type="button" :aria-label="light ? '切换深色主题' : '切换浅色主题'" @click="light = !light">{{ light ? '☾' : '☼' }}</button></nav>
    </header>

    <div class="blog-shell"><BlogLoadNotice />
      <div class="blog-breadcrumb"><a href="./index.html">小站入口</a><span>/</span><a href="./blog.html">文字角落</a><span v-if="article">/ 阅读</span><span class="blog-coordinate">WORDS / IDEAS / EVERYDAY</span></div>
      <template v-if="!slug">
        <section class="blog-intro">
          <div class="blog-intro-copy"><p class="blog-kicker"><span class="status-dot"></span> THE JOURNAL OF GOLDSTONE</p><h1>把日子写下来，<br><em>让想法慢慢生长。</em></h1><p class="blog-lead">关于代码、设计，以及生活里的小小发现。<br>这里是我的文字角落，也是一些想法的起点。</p><div class="blog-intro-meta"><span>✦ 保持好奇，持续记录</span><span>{{ String(posts.length).padStart(2, '0') }} 篇文字</span></div></div>
          <div class="blog-intro-art"><DayScene /><span class="blog-art-note">A QUIET PLACE TO THINK.</span></div>
        </section>
      </template>
      <a v-else class="blog-back" href="./blog.html">← 返回全部文章</a>

      <div class="blog-columns">
        <main class="blog-main">
          <template v-if="!slug">
            <div class="blog-section-title"><h2><span>01 /</span> 最近的文字</h2><span>按发布时间排序</span></div>
            <div class="blog-tools"><div class="blog-tabs" aria-label="文章分类"><button v-for="tag in categories" :key="tag" type="button" :aria-pressed="category === tag" :class="{ active: category === tag }" @click="category = tag">{{ tag }} <small>{{ tag === '全部' ? posts.length : posts.filter(p => p.categories.includes(tag)).length }}</small></button></div><label class="blog-search"><span aria-hidden="true">⌕</span><input v-model="query" type="search" aria-label="搜索文章" placeholder="找一篇文字…"></label></div>
            <p v-if="!filtered.length" class="blog-empty" role="status">没有找到对应的文章，换一个关键词试试吧。</p>
            <article v-for="(post, index) in filtered" :key="post.slug" class="blog-post">
              <div class="blog-post-meta"><time :datetime="post.publishedAt">{{ post.publishedAt }}</time><span v-for="tag in post.categories" :key="tag" class="blog-category">{{ tag }}</span><span v-if="index === 0 && category === '全部' && !query" class="blog-new">最新</span><span class="blog-readtime">{{ readingTime(post) }} 分钟阅读</span></div>
              <h2><a :href="`#${post.slug}`">{{ post.title }}<span aria-hidden="true">↗</span></a></h2><p>{{ post.excerpt }}</p><a class="blog-read" :href="`#${post.slug}`">继续阅读 <span>→</span></a>
            </article>
            <p class="blog-end">— 暂时写到这里，新的故事正在路上 —</p>
          </template>
          <article v-else-if="article" class="blog-reading">
            <div class="blog-post-meta"><span v-for="tag in article.categories" :key="tag" class="blog-category">{{ tag }}</span><time :datetime="article.publishedAt">{{ article.publishedAt }}</time><span>{{ readingTime(article) }} 分钟阅读</span></div>
            <h1>{{ article.title }}</h1><div class="blog-byline"><img :src="avatar" alt="" width="30" height="30"><span>Goldstone <small>记录一点自己的痕迹。</small></span></div>
            <MarkdownArticle :key="article.slug" :article="article" />
            <div class="blog-reading-end"><span>✦ 感谢读到这里。</span><a href="./blog.html">回到文字角落 →</a></div>
            <aside class="blog-related"><p class="blog-kicker">接着读 / MORE WORDS</p><a v-for="post in posts.filter(p => p.slug !== article.slug).slice(0, 2)" :key="post.slug" :href="`#${post.slug}`">{{ post.title }} <span>→</span></a></aside>
          </article>
          <div v-else class="blog-empty"><h1>这篇文字还没有找到。</h1><a href="./blog.html">返回文章列表 →</a></div>
        </main>
        <aside class="blog-aside" aria-label="博客资料">
          <div class="blog-author"><img :src="avatar" alt="Goldstone 的像素葫芦头像" width="60" height="60"><p class="blog-kicker">BEHIND THE WORDS</p><h2>你好，我是 Goldstone。</h2><p>写一点代码，做一点有趣的东西。<br>也认真收藏日常里的微小闪光。</p><a href="./index.html#about">认识一下我 ↗</a></div>
          <div class="blog-side-section"><p class="blog-kicker">文章分类 / CATEGORIES</p><a v-for="tag in categories.filter(c => c !== '全部')" :key="tag" href="./blog.html" @click.prevent="selectCategory(tag)">{{ tag }}<span>{{ String(posts.filter(p => p.categories.includes(tag)).length).padStart(2, '0') }}</span></a></div>
          <div class="blog-side-section"><p class="blog-kicker">时光归档 / ARCHIVE</p><p v-for="month in archives" :key="month" class="blog-archive">{{ month.replace('-', ' / ') }}<span>{{ posts.filter(p => p.publishedAt.startsWith(month)).length }} 篇</span></p></div>
          <blockquote>“每一段记录，<br>都是留给未来自己的回声。”<small>LEAVE A LITTLE TRACE.</small></blockquote>
          <p class="blog-sample">当前文章为示例内容，等待真实故事填满。</p>
        </aside>
      </div>
      <footer class="blog-footer"><span>© {{ new Date().getFullYear() }} GOLDSTONE · 文字角落</span><a href="./index.html">回到我的像素小站 ↗</a></footer>
    </div>
  </div>
</template>

<style scoped>
.blog-site{min-height:100dvh}.blog-header{height:82px;padding:0 max(28px,calc((100vw - 1280px)/2));display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:20}.blog-header nav{display:flex;align-items:center;gap:28px;font:12px Consolas,"Microsoft YaHei",monospace;color:var(--muted)}.blog-header nav .current{color:var(--accent);border-bottom:2px solid var(--accent);padding:12px 0}.blog-header nav button{background:var(--panel);color:var(--accent);width:34px;height:34px;font-size:22px;border:1px solid var(--line)}.blog-shell{max-width:1280px;margin:auto;padding:30px 28px 0}.blog-breadcrumb{display:flex;gap:12px;font-size:11px;color:var(--muted);margin-bottom:30px}.blog-coordinate{margin-left:auto;font:9px Consolas,monospace;letter-spacing:2px}.blog-intro{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);background:var(--panel);margin-bottom:48px;overflow:hidden}.blog-intro-copy{padding:36px}.blog-kicker{font:10px Consolas,"Microsoft YaHei",monospace;letter-spacing:1.6px;color:var(--accent);display:flex;gap:8px;align-items:center}.blog-intro h1{font-weight:500;font-size:32px;line-height:1.65;margin:22px 0 16px}.blog-intro h1 em{font-style:normal;color:var(--accent)}.blog-lead{font-size:12px;line-height:2;color:var(--muted)}.blog-intro-meta{display:flex;justify-content:space-between;gap:10px;margin-top:28px;font-size:10px;color:var(--subtle)}.blog-intro-art{position:relative;display:flex;align-items:end;background:var(--bg);border-left:1px solid var(--line)}.blog-intro-art :deep(.hero-art){margin:0;width:100%}.blog-intro-art :deep(.pixel-scene){min-height:260px;max-height:none;object-fit:cover}.blog-intro-art :deep(.scene-caption){font-size:8px}.blog-art-note{position:absolute;top:30px;left:28px;color:var(--muted);font:10px Consolas,monospace;letter-spacing:2px}.blog-columns{display:grid;grid-template-columns:minmax(0,1fr) 255px;gap:55px}main.blog-main{padding:0;margin:0;max-width:none;min-width:0;width:100%}.blog-section-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}.blog-section-title h2{font-size:18px;font-weight:500}.blog-section-title h2 span{font:11px Consolas,monospace;color:var(--accent);margin-right:10px}.blog-section-title>span{font-size:10px;color:var(--muted)}.blog-tools{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;padding-bottom:20px;border-bottom:1px solid var(--line)}.blog-tabs{display:flex;gap:5px;flex-wrap:wrap}.blog-tabs button{font-size:11px;color:var(--muted);background:transparent;border:1px solid var(--line);padding:8px 10px}.blog-tabs button.active{color:var(--bg);background:var(--accent);border-color:var(--accent)}.blog-tabs small{font:9px Consolas,monospace;margin-left:4px;opacity:.7}.blog-search{display:flex;align-items:center;gap:8px;border:1px solid var(--line);padding:0 10px;color:var(--muted)}.blog-search input{width:120px;padding:8px 0;font:11px inherit;background:transparent;color:var(--text);border:0;min-width:0}.blog-post{padding:28px 0;border-bottom:1px solid var(--line)}.blog-post-meta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:10px;color:var(--muted)}.blog-post-meta time{font-family:Consolas,monospace}.blog-post-meta>span:first-of-type{color:var(--accent)}.blog-post-meta .blog-new{border:1px solid var(--line);padding:2px 5px;font-size:9px}.blog-readtime{margin-left:auto}.blog-post h2{margin:18px 0 13px;font-size:21px;line-height:1.6;font-weight:500}.blog-post h2 a{display:flex;align-items:center;justify-content:space-between;gap:15px}.blog-post h2 a span{font-size:19px;color:var(--muted)}.blog-post h2 a:hover{color:var(--accent)}.blog-post>p{font-size:13px;line-height:2;color:var(--muted)}.blog-read{display:inline-flex;gap:28px;margin-top:20px;font-size:11px;color:var(--accent)}.blog-end{padding:30px 0;text-align:center;font-size:11px;color:var(--muted)}.blog-aside{border-left:1px solid var(--line);padding-left:28px}.blog-author img{background:#fff;padding:4px;border:1px solid var(--line);image-rendering:pixelated;margin-bottom:22px}.blog-author h2{font-size:16px;margin:15px 0;font-weight:500}.blog-author>p:not(.blog-kicker){font-size:11px;line-height:2;color:var(--muted)}.blog-author>a{display:inline-block;font-size:11px;color:var(--accent);margin-top:20px}.blog-side-section{border-top:1px solid var(--line);margin-top:28px;padding-top:24px}.blog-side-section>a,.blog-archive{display:flex;justify-content:space-between;font-size:11px;padding-top:18px;color:var(--subtle)}.blog-side-section span{color:var(--muted);font-family:Consolas,monospace}.blog-aside blockquote{margin:28px 0 0;padding:20px;background:var(--panel);border:1px solid var(--line);font-size:12px;line-height:2;color:var(--subtle)}.blog-aside blockquote small{display:block;font:8px Consolas,monospace;margin-top:18px;color:var(--muted)}.blog-sample{font-size:10px;line-height:1.9;color:var(--muted);margin-top:20px}.blog-footer{margin-top:30px;padding:26px 0;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:10px}.blog-back{display:inline-block;font-size:12px;color:var(--accent);margin:0 0 30px}.blog-reading h1{font-size:32px;font-weight:500;line-height:1.6;margin:24px 0}.blog-byline{display:flex;gap:12px;align-items:center;font:12px Consolas,monospace;padding-bottom:28px;border-bottom:1px solid var(--line)}.blog-byline img{background:white;padding:2px;image-rendering:pixelated}.blog-byline small{display:block;font-size:10px;color:var(--muted);margin-top:5px}.blog-prose{padding:20px 0}.blog-prose p{font-size:15px;line-height:2.25;margin:24px 0;white-space:pre-line;overflow-wrap:anywhere}.blog-reading-end{display:flex;justify-content:space-between;gap:16px;border-top:1px solid var(--line);padding-top:24px;font-size:12px;color:var(--accent)}.blog-related{margin:44px 0}.blog-related a{display:flex;justify-content:space-between;padding:20px 0;border-bottom:1px solid var(--line);font-size:13px}.blog-empty{padding:35px 10px;color:var(--muted);font-size:13px;line-height:2}.blog-empty h1{font-size:22px}.blog-empty a{color:var(--accent)}
@media(max-width:900px){.blog-columns{grid-template-columns:minmax(0,1fr) 215px;gap:28px}.blog-aside{padding-left:20px}.blog-intro-copy{padding:28px}.blog-intro h1{font-size:26px}}
@media(max-width:650px){.blog-header{height:70px;padding:0 16px}.blog-header .brand{font-size:14px}.blog-header .brand-sub{font-size:8px;letter-spacing:0}.blog-header nav{gap:14px;font-size:10px}.blog-header nav>a:first-child{display:none}.blog-shell{padding:24px 18px 0}.blog-coordinate{display:none}.blog-breadcrumb{font-size:10px}.blog-intro{grid-template-columns:1fr;margin-bottom:30px}.blog-intro-copy{padding:25px 22px}.blog-intro h1{font-size:26px}.blog-intro-art{border-left:0;border-top:1px solid var(--line)}.blog-intro-art :deep(.pixel-scene){min-height:160px;max-height:180px}.blog-art-note{display:none}.blog-columns{grid-template-columns:1fr;gap:24px}.blog-aside{border-left:0;border-top:1px solid var(--line);padding:26px 0 0}.blog-author img{float:left;margin:0 18px 20px 0}.blog-author .blog-kicker{padding-top:3px;font-size:9px}.blog-author>p:not(.blog-kicker){clear:both}.blog-side-section,.blog-aside blockquote{display:none}.blog-post h2{font-size:19px}.blog-post>p{font-size:12px}.blog-tools{gap:12px}.blog-search{width:100%}.blog-search input{width:100%}.blog-post-meta{gap:10px}.blog-reading h1{font-size:27px}.blog-prose p{font-size:14px}.blog-footer{font-size:9px;flex-wrap:wrap}.blog-readtime{margin-left:0}}
.blog-post-meta>.blog-category{color:var(--accent);border:1px solid var(--line);padding:2px 6px}
</style>
