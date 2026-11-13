import { loadBlogPosts } from '../lib/loadBlogPosts.js'

const documents = import.meta.glob('../blogs/posts/**/*.md', { eager: true, query: '?raw', import: 'default' })
const assets = import.meta.glob('../blogs/posts/**/*.{png,jpg,jpeg,webp,gif,svg,avif}', { eager: true, query: '?url', import: 'default' })
function normalize(path) {
  const parts = []
  for (const part of path.split('/')) {
    if (part === '..') parts.pop()
    else if (part && part !== '.') parts.push(part)
  }
  return parts.join('/')
}
const imageUrls = Object.fromEntries(Object.entries(assets).map(([key, value]) => [normalize(key), value]))
const loaded = loadBlogPosts(documents, (filename, src) => {
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('/')) return import.meta.env.BASE_URL + src.replace(/^\/+/, '')
  const key = normalize(filename.slice(0, filename.lastIndexOf('/') + 1) + decodeURI(src))
  const url = imageUrls[key]
  if (!url) throw new Error(`${filename}: 找不到图片 ${src}，请检查相对路径。`)
  return url
})
export const posts = loaded.posts
export const blogPostErrors = loaded.errors
if (blogPostErrors.length) console.warn('[Blog] 部分文章加载失败：', blogPostErrors)
export function getLatestBlogPosts(count = 3) { return posts.slice(0, count) }