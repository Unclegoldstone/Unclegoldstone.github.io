import { parse as parseYaml } from 'yaml'
import MarkdownIt from 'markdown-it'
import { htmlImageCompat } from './htmlImageCompat.js'

export function loadWorks(documents, resolveImage) {
  const projects = [], errors = []
  for (const [filename, raw] of Object.entries(documents)) {
    if (filename.split('/').slice(-2, -1)[0] === 'template') continue
    try {
      const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(raw.replace(/^\uFEFF/, ''))
      if (!match) throw new Error('缺少 YAML 信息区（---）')
      const meta = parseYaml(match[1])
      if (meta?.draft === true) continue
      if (!meta?.title || !meta.summary) throw new Error('请填写 title 和 summary')
      if (!['个人项目', '合作项目', '小工具'].includes(meta.category)) throw new Error('category 应为个人项目、合作项目或小工具')
      if (meta.featured !== undefined && typeof meta.featured !== 'boolean') throw new Error('featured 应为 true 或 false')
      const date = meta.date ? String(meta.date) : ''
      if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date)) throw new Error('date 应为有效的 YYYY-MM-DD 日期，或留空')
      if (meta.tags && (!Array.isArray(meta.tags) || meta.tags.some(tag => typeof tag !== 'string'))) throw new Error('tags 应为文字列表')
      if (meta.github && !/^https?:\/\//i.test(meta.github)) throw new Error('github 应为完整的 HTTP(S) 链接')
      const images = meta.images ?? [meta.cover]
      if (!Array.isArray(images) || !images.length) throw new Error('images 需要至少一张图片')
      const image = src => {
        if (typeof src !== 'string' || !src.trim()) throw new Error('请填写图片路径')
        return resolveImage(filename, src)
      }
      const md = new MarkdownIt({ html: false, linkify: true }).use(htmlImageCompat)
      const original = md.renderer.rules.image
      md.renderer.rules.image = (tokens, index, options, env, self) => {
        const token = tokens[index], url = image(token.attrGet('src'))
        token.attrSet('src', url); token.attrSet('loading', 'lazy'); token.attrSet('decoding', 'async')
        return `<a class="markdown-image-link" href="${md.utils.escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${original(tokens,index,options,env,self)}</a>`
      }
      const id = filename.split('/').slice(-2,-1)[0]
      projects.push({ id, no: id, title: String(meta.title), type: meta.category, publishedAt: date,
        desc: String(meta.summary), tags: meta.tags || [], cover: image(meta.cover),
        detailImages: images.map(image), body: match[2].trim(), bodyHtml: md.render(match[2]),
        downloadUrl: meta.github || '', featured: meta.featured === true,
        order: Number.isFinite(meta.order) ? meta.order : 100, isExample: meta.isExample === true,
      })
    } catch (error) { errors.push({ filename, message: error.message }) }
  }
  projects.sort((a,b) => a.order - b.order || a.id.localeCompare(b.id))
  return { projects, errors }
}
