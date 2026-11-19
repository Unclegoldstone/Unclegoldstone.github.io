import { loadWorks } from '../lib/loadWorks.js'
import { createBlogImageResolver } from '../lib/blogImages.js'

const documents = import.meta.glob('../works/*/index.md', { eager: true, query: '?raw', import: 'default' })
const assets = import.meta.glob('../works/**/*.{png,jpg,jpeg,webp,gif,svg,avif}', { eager: true, query: '?url', import: 'default' })
const loaded = loadWorks(documents, createBlogImageResolver(assets, import.meta.env.BASE_URL))
export const projects = loaded.projects
export const homeProjects = projects.filter(project => project.featured)
export const workErrors = loaded.errors
if (workErrors.length) console.warn('[Works] 部分作品未能加载：', workErrors)
