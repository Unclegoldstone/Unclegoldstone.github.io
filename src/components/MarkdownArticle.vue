<script setup>
defineProps({ article: { type: Object, required: true } })
function jump(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function onClick(event) {
  const anchor = event.target.closest('a')
  if (!anchor?.getAttribute('href')?.startsWith('#section-')) return
  event.preventDefault()
  jump(anchor.getAttribute('href').slice(1))
}
</script>

<template>
  <div class="markdown-article">
    <nav v-if="article.toc.length" class="markdown-toc" aria-label="文章目录">
      <p>本篇目录 / CONTENTS</p>
      <button v-for="item in article.toc" :key="item.id" type="button" :style="{ paddingLeft: `${Math.max(0, item.level - 1) * 12}px` }" @click="jump(item.id)">{{ item.text }}</button>
    </nav>
    <div class="markdown-body" @click="onClick" v-html="article.html"></div>
  </div>
</template>

<style scoped>
.markdown-article{padding:24px 0;min-width:0}.markdown-toc{border:1px solid var(--line);padding:18px 22px;background:var(--panel);margin-bottom:30px}.markdown-toc p{font:10px Consolas,"Microsoft YaHei",monospace;letter-spacing:1px;color:var(--accent);margin-bottom:12px}.markdown-toc button{display:block;background:transparent;color:var(--subtle);font-size:12px;text-align:left;line-height:1.8;margin:8px 0}.markdown-toc button:hover{color:var(--accent)}.markdown-body{font-size:15px;line-height:2.15;overflow-wrap:anywhere}.markdown-body :deep(p){margin:20px 0}.markdown-body :deep(h1),.markdown-body :deep(h2),.markdown-body :deep(h3),.markdown-body :deep(h4){scroll-margin-top:110px;line-height:1.6;color:var(--text);margin:30px 0 16px;font-weight:600}.markdown-body :deep(h1){font-size:27px}.markdown-body :deep(h2){font-size:23px;padding-bottom:10px;border-bottom:1px solid var(--line)}.markdown-body :deep(h3){font-size:19px}.markdown-body :deep(ul),.markdown-body :deep(ol){padding-left:26px;margin:18px 0}.markdown-body :deep(li){padding:3px 0}.markdown-body :deep(a){color:var(--accent);text-decoration:underline;text-underline-offset:4px}.markdown-body :deep(blockquote){margin:24px 0;border-left:3px solid var(--accent);padding:1px 20px;background:var(--panel);color:var(--subtle)}.markdown-body :deep(pre){overflow-x:auto;max-width:100%;padding:20px;border:1px solid var(--line);background:var(--panel);line-height:1.8;font-size:13px}.markdown-body :deep(code){font-family:Consolas,"Courier New",monospace;background:var(--panel2);padding:2px 5px;font-size:.9em}.markdown-body :deep(pre code){padding:0;background:none;font-size:inherit}.markdown-body :deep(img){display:block;max-width:100%;height:auto;margin:24px auto;border:1px solid var(--line);padding:6px;background:var(--panel)}.markdown-body :deep(.markdown-image-link){display:block}.markdown-body :deep(table){display:block;max-width:100%;overflow-x:auto;border-collapse:collapse;margin:24px 0;font-size:13px}.markdown-body :deep(th),.markdown-body :deep(td){border:1px solid var(--line);padding:10px 15px;text-align:left}.markdown-body :deep(th){background:var(--panel);color:var(--accent)}.markdown-body :deep(hr){border:0;border-top:1px solid var(--line);margin:32px 0}@media(max-width:650px){.markdown-body{font-size:14px}.markdown-body :deep(h2){font-size:21px}.markdown-body :deep(pre){padding:14px;font-size:12px}.markdown-body :deep(img){padding:3px}.markdown-toc{padding:16px}}
</style>
