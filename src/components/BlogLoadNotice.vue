<script setup>
import { blogPostErrors } from '../data/posts.js'
const development = import.meta.env.DEV
</script>
<template>
  <aside v-if="development && blogPostErrors.length" class="blog-load-notice" role="alert">
    <strong>{{ blogPostErrors.length }} 篇文章未能加载，其他内容可正常浏览。</strong>
    <ul><li v-for="error in blogPostErrors" :key="error.filename"><code>{{ error.filename }}</code><p>{{ error.message }}</p></li></ul>
    <p>修正文件并保存后，页面会自动重新加载。这条提示只在本地开发时显示。</p>
  </aside>
</template>
<style scoped>
.blog-load-notice{margin:20px;padding:18px;border:1px solid #bd9c65;background:var(--panel);color:var(--text);font-size:12px;line-height:1.9;overflow-wrap:anywhere}.blog-load-notice strong{color:#d5b681}.blog-load-notice ul{padding-left:20px}.blog-load-notice>p{color:var(--muted)}
</style>
