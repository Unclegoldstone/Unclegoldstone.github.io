<script setup>
defineProps({ posts: { type: Array, required: true } })
</script>

<template>
  <section id="notes" class="content-section">
    <div class="section-heading">
      <div>
        <span class="section-index">02 /</span>
        <h2>最近的碎碎念</h2>
        <span class="section-en">FIELD NOTES</span>
      </div>
      <a class="all-blog-posts" href="./blog.html">查看全部文章 ↗</a>
    </div>
    <div class="note-list">
      <a v-for="(post, index) in posts" :key="post.slug" class="home-blog-entry" :href="`./blog.html#${encodeURIComponent(post.slug)}`">
        <time class="note-date" :datetime="post.publishedAt">{{ post.publishedAt.slice(5).replace('-', '.') }}<small>{{ post.publishedAt.slice(0, 4) }}</small></time>
        <div class="home-blog-copy">
          <span class="note-category">{{ post.categories.join(' · ') }}</span>
          <h3>{{ post.title }}</h3>
          <p class="home-blog-excerpt">{{ post.excerpt }}</p>
        </div>
        <span class="note-order">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="note-arrow" aria-hidden="true">↗</span>
      </a>
      <p v-if="!posts.length" class="home-blog-empty">新的文字正在酝酿中，欢迎稍后来看看。</p>
    </div>
  </section>
</template>

<style scoped>
.all-blog-posts{font-size:10px;color:var(--accent);white-space:nowrap;padding:6px 0}
.all-blog-posts:hover{text-decoration:underline;text-underline-offset:4px}
.home-blog-entry{display:flex;align-items:center;gap:20px;padding:23px 0;border-bottom:1px solid var(--line)}
.home-blog-entry:hover{background:var(--panel)}
.home-blog-entry:hover h3{color:var(--accent)}
.home-blog-entry>.note-date{flex-shrink:0;font-size:19px}
.home-blog-copy{min-width:0;flex:1}
.home-blog-copy h3{font-size:14px;line-height:1.8;margin-top:6px;font-weight:500}
.note-category{line-height:1.8;overflow-wrap:anywhere}
.home-blog-excerpt{font-size:11px;line-height:1.9;color:var(--muted);margin-top:7px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.home-blog-entry>.note-order{flex-shrink:0}
.home-blog-entry>.note-arrow{flex-shrink:0}
.home-blog-empty{padding:25px 0;font-size:12px;color:var(--muted)}
@media(max-width:600px){.home-blog-entry{gap:13px;padding:20px 0}.home-blog-copy h3{font-size:12px}.home-blog-excerpt{font-size:10px}.home-blog-entry>.note-date{font-size:16px}.all-blog-posts{font-size:9px}}
</style>
