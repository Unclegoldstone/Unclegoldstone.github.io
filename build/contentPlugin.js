import fs from 'node:fs'
import path from 'node:path'
import { parse as yaml } from 'yaml'
import { parsePost } from '../src/lib/markdown.js'
import { loadWorks } from '../src/lib/loadWorks.js'

const prefix = 'virtual:goldstone/'
const slash = value => value.replaceAll('\\', '/')
function files(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? files(filename) : [filename]
  })
}

// Markdown/YAML are parsed by Vite in Node, never shipped to the browser.
export function contentPlugin() {
  let root, cache, server, reloadTimer
  const contentRoots = () => ['src/blogs/posts', 'src/works'].map(dir => path.join(root, dir))
  function isContent(filename) { return contentRoots().some(dir => path.resolve(filename).startsWith(dir + path.sep)) }
  function collect(context) {
    if (cache) return cache
    const posts = [], works = [], postErrors = [], workErrors = [], slugs = new Set()
    for (const [kind, directory] of contentRoots().entries()) {
      context.addWatchFile(directory)
      for (const file of files(directory).sort()) {
        if (!file.endsWith('.md') || (kind === 1 && (path.basename(file) !== 'index.md' || path.basename(path.dirname(file)) === 'template'))) continue
        context.addWatchFile(file)
        const filename = slash(file), assets = new Map()
        try {
          const raw = fs.readFileSync(file, 'utf8')
          const header = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw.replace(/^\uFEFF/, ''))
          if (header && yaml(header[1])?.draft === true) continue
          function image(src) {
            if (typeof src !== 'string' || !src.trim()) throw new Error('图片路径不能为空')
            if (/^https?:\/\//i.test(src)) return src
            const source = decodeURI(src).replaceAll('\\', '/')
            if (source.startsWith('/')) {
              const key = `__GS_ASSET_${assets.size}__`
              assets.set(key, { public: source.replace(/^\/+/, '') })
              return key
            }
            const resolved = path.resolve(path.dirname(file), source)
            if (!resolved.startsWith(directory + path.sep) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) throw new Error(`找不到图片 ${src}，请检查相对于 Markdown 的路径。`)
            if (!/\.(?:png|jpe?g|webp|gif|svg|avif)$/i.test(resolved)) throw new Error(`图片格式不支持：${src}`)
            context.addWatchFile(resolved)
            const key = `__GS_ASSET_${assets.size}__`
            assets.set(key, { filename: resolved })
            return key
          }
          if (kind === 0) {
            const data = parsePost(raw, filename, image)
            if (slugs.has(data.slug)) throw new Error(`文章 slug 重复：${data.slug}`)
            slugs.add(data.slug)
            const { html, toc, text, draft, ...meta } = data
            meta.readingMinutes = Math.max(1, Math.ceil(text.length / 350))
            posts.push({ id: data.slug, meta, detail: { ...meta, html, toc }, text, assets })
          } else {
            const result = loadWorks({ [filename]: raw }, (_file, src) => image(src))
            if (result.errors.length) throw new Error(result.errors[0].message)
            if (!result.projects.length) continue
            const { body, bodyHtml, detailImages, downloadUrl, ...meta } = result.projects[0]
            works.push({ id: meta.id, meta, detail: { ...meta, bodyHtml, detailImages, downloadUrl }, assets })
          }
        } catch (error) {
          (kind === 0 ? postErrors : workErrors).push({ filename: slash(path.relative(root, file)), message: error.message })
        }
      }
    }
    posts.sort((a,b) => b.meta.publishedAt.localeCompare(a.meta.publishedAt))
    works.sort((a,b) => a.meta.order - b.meta.order || a.id.localeCompare(b.id))
    return cache = { posts, works, postErrors, workErrors }
  }
  function importsFor(value, assets, namespace = 'asset') {
    const serialized = JSON.stringify(value), imports = [], variables = new Map()
    for (const [token, asset] of assets) {
      if (!serialized.includes(token)) continue
      const variable = `${namespace}${variables.size}`
      variables.set(token, variable)
      if (asset.public) {
        imports.push(`const ${variable}=import.meta.env.BASE_URL+${JSON.stringify(asset.public)};`)
      } else {
        const url = '/' + slash(path.relative(root, asset.filename)) + '?url'
        imports.push(`import ${variable} from ${JSON.stringify(url)};`)
      }
    }
    let needsEscape = false
    function expressionFor(item, html = false) {
      if (Array.isArray(item)) return '[' + item.map(entry => expressionFor(entry, html)).join(',') + ']'
      if (item && typeof item === 'object') return '{' + Object.entries(item).map(([key, entry]) => JSON.stringify(key) + ':' + expressionFor(entry, key === 'html' || key === 'bodyHtml')).join(',') + '}'
      let expression = JSON.stringify(item)
      if (typeof item === 'string') for (const [token, variable] of variables) {
        if (!item.includes(token)) continue
        if (html) needsEscape = true
        expression = expression.replaceAll(token, `"+${html ? `escapeAssetUrl(${variable})` : variable}+"`)
      }
      return expression
    }
    const expression = expressionFor(value)
    // URL fields remain raw; URLs inserted into rendered HTML retain attribute escaping.
    if (needsEscape) imports.push(`const escapeAssetUrl=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');`)
    return { imports: imports.join('\n'), expression }
  }
  function metadataModule(records, exportName) {
    const parts = records.map((record,index) => {
      const { imports, expression } = importsFor(record.meta, record.assets, `${exportName}${index}asset`)
      return `${imports}\nconst ${exportName}${index}=${expression};`
    })
    return parts.join('\n') + `\nexport const ${exportName}=[${records.map((_r,i)=>`${exportName}${i}`).join(',')}];\n`
  }
  function loaders(records, kind) {
    return `const loaders={${records.map(record => `${JSON.stringify(record.id)}:()=>import(${JSON.stringify(prefix+kind+'/'+encodeURIComponent(record.id))})`).join(',')}};\n`
  }
  function invalidate(filename) {
    if (!isContent(filename)) return
    cache = null
    clearTimeout(reloadTimer)
    reloadTimer = setTimeout(() => {
      for (const module of server.moduleGraph.idToModuleMap.values()) if (module.id?.startsWith('\0'+prefix)) server.moduleGraph.invalidateModule(module)
      server.ws.send({ type: 'full-reload' })
    }, 60)
  }
  return {
    name: 'goldstone-content',
    configResolved(config) { root = config.root },
    buildStart() { cache = null },
    resolveId(id) { if (id.startsWith(prefix)) return '\0'+id },
    load(id) {
      if (!id.startsWith('\0'+prefix)) return
      const data = collect(this), name = id.slice(('\0'+prefix).length)
      if (name === 'home') {
        return metadataModule(data.posts.slice(0,3), 'latestPosts') + metadataModule(data.works.filter(w=>w.meta.featured), 'homeProjects') +
          loaders(data.works.filter(w=>w.meta.featured), 'work') +
          `export const postCount=${data.posts.length},projectCount=${data.works.length};\nexport const blogPostErrors=${JSON.stringify(data.postErrors)};\nexport const workErrors=${JSON.stringify(data.workErrors)};\nexport const workLoaders=loaders;`
      }
      if (name === 'posts') return metadataModule(data.posts,'posts') + loaders(data.posts,'post') + `export const postLoaders=loaders;export const blogPostErrors=${JSON.stringify(data.postErrors)};\nexport const loadSearchIndex=()=>import('${prefix}search').then(m=>m.default);`
      if (name === 'works') return metadataModule(data.works,'projects') + loaders(data.works,'work') + `export const workLoaders=loaders;export const workErrors=${JSON.stringify(data.workErrors)};`
      if (name === 'search') return `export default ${JSON.stringify(data.posts.map(p=>({slug:p.id,text:p.text})))};`
      const [kind, encoded] = name.split('/')
      if (!['post', 'work'].includes(kind)) throw new Error(`未知内容类型：${kind}`)
      const record = (kind === 'post' ? data.posts : data.works).find(record=>record.id===decodeURIComponent(encoded || ''))
      if (!record) throw new Error(`未找到内容：${name}`)
      const { imports, expression } = importsFor(record.detail, record.assets)
      return `${imports}\nexport default ${expression};`
    },
    configureServer(value) {
      server = value
      server.watcher.add(contentRoots())
      for (const event of ['add','change','unlink']) server.watcher.on(event,invalidate)
      server.httpServer?.once('close',()=>{clearTimeout(reloadTimer);for(const event of ['add','change','unlink'])server.watcher.off(event,invalidate)})
    },
  }
}
