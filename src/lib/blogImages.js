// Markdown editors on Windows may emit backslashes or percent-encoded filenames.
function normalize(path) {
  const parts = []
  for (const part of path.replace(/\\/g, '/').split('/')) {
    if (part === '..') parts.pop()
    else if (part && part !== '.') parts.push(part)
  }
  return parts.join('/')
}

export function createBlogImageResolver(assets, baseUrl = '/') {
  const imageUrls = Object.fromEntries(Object.entries(assets).map(([key, value]) => [normalize(key), value]))
  return (filename, src) => {
    if (/^https?:\/\//i.test(src)) return src
    const source = decodeURI(src).replace(/\\/g, '/')
    if (source.startsWith('/')) return baseUrl + source.replace(/^\/+/, '')
    const key = normalize(filename.slice(0, filename.lastIndexOf('/') + 1) + source)
    const url = imageUrls[key]
    if (!url) throw new Error(`${filename}: 找不到图片 ${src}，请将图片放入 src/blogs/posts/assets 并检查相对路径。`)
    return url
  }
}
