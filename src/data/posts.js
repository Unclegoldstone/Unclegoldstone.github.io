import { loadBlogPosts } from '../lib/loadBlogPosts.js'
import { createBlogImageResolver } from '../lib/blogImages.js'

const documents = import.meta.glob('../blogs/posts/**/*.md', { eager: true, query: '?raw', import: 'default' })
const assets = import.meta.glob('../blogs/posts/assets/**/*.{png,jpg,jpeg,webp,gif,svg,avif}', { eager: true, query: '?url', import: 'default' })
const loaded = loadBlogPosts(documents, createBlogImageResolver(assets, import.meta.env.BASE_URL))
export const posts = loaded.posts
export const blogPostErrors = loaded.errors
if (blogPostErrors.length) console.warn('[Blog] 部分文章加载失败：', blogPostErrors)
export function getLatestBlogPosts(count = 3) { return posts.slice(0, count) }