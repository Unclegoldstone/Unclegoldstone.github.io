import MarkdownIt from 'markdown-it'
import { parse as parseYaml } from 'yaml'

const md = new MarkdownIt({ html: false, linkify: true, typographer: false })
const plain = value => value.replace(/<[^>]*>/g, '').replace(/[#*_`\[\]]/g, '').trim()
const originalImage = md.renderer.rules.image
md.renderer.rules.image = (tokens, index, options, env, self) => {
  const token = tokens[index]
  const source = token.attrGet('src')
  const resolved = env.resolveImage(source)
  token.attrSet('src', resolved)
  token.attrSet('loading', 'lazy')
  token.attrSet('decoding', 'async')
  return `<a class="markdown-image-link" href="${md.utils.escapeHtml(resolved)}" target="_blank" rel="noopener noreferrer">${originalImage(tokens, index, options, env, self)}</a>`
}
const originalLink = md.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options))
md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index]
  if (/^https?:\/\//i.test(token.attrGet('href') || '')) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return originalLink(tokens, index, options, env, self)
}

export function parsePost(source, filename, resolveImage = src => src) {
  const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/)
  if (!match) throw new Error(`${filename}: 缺少 YAML 文章头部（---）。`)
  const meta = parseYaml(match[1])
  const slug = meta?.slug || filename.split('/').pop().replace(/\.md$/, '')
  const date = String(meta?.date || '')
  if (!meta?.title || !/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(slug)) throw new Error(`${filename}: 请填写标题；文件名或 slug 可使用中文、英文字母、数字、短横线和下划线，不要包含空格或路径符号。`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error(`${filename}: date 必须是有效的 YYYY-MM-DD 日期。`)
  const categoryInput = meta.categories ?? meta.category ?? '随笔'
  const categoryValues = Array.isArray(categoryInput) ? categoryInput : [categoryInput]
  if (categoryValues.some(value => typeof value !== 'string')) throw new Error(`${filename}: 分类必须填写文字或文字列表。`)
  const categories = [...new Set(categoryValues.map(value => value.trim()).filter(Boolean))]
  if (!categories.length) categories.push('随笔')
  if (categories.includes('全部')) throw new Error(`${filename}: “全部”是筛选项，请使用其他分类名称。`)
  const env = { resolveImage }
  const tokens = md.parse(match[2], env)
  const toc = []
  let heading = 0
  for (let index = 0; index < tokens.length; index++) {
    if (tokens[index].type !== 'heading_open') continue
    const id = `section-${++heading}`
    tokens[index].attrSet('id', id)
    const level = Number(tokens[index].tag.slice(1))
    if (level <= 3) toc.push({ id, level, text: plain(tokens[index + 1].content) })
  }
  const text = tokens.filter(token => token.type === 'inline').map(token => plain(token.content)).join('\n')
  const firstParagraph = tokens.find((token, index) => token.type === 'inline' && tokens[index - 1]?.type === 'paragraph_open')
  return {
    slug, title: String(meta.title), publishedAt: date,
    categories, category: categories.join(' / '),
    excerpt: String(meta.excerpt || plain(firstParagraph?.content || text).slice(0, 140)),
    draft: meta.draft === true,
    text, toc, html: md.renderer.render(tokens, md.options, env),
  }
}
