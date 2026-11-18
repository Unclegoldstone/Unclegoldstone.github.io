// Accept editor-generated <img> tags without enabling arbitrary article HTML.
export function htmlImageCompat(md) {
  md.inline.ruler.before('html_inline', 'blog_image_tag', (state, silent) => {
    if (state.src[state.pos] !== '<') return false
    const match = /^<img\b(?:[^"'<>]|"[^"]*"|'[^']*')*\/?>/i.exec(state.src.slice(state.pos))
    if (!match) return false
    const attrs = {}
    const pattern = /([a-zA-Z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
    for (const attr of match[0].slice(4).replace(/\/?\s*>$/, '').matchAll(pattern)) {
      const value = attr[2] ?? attr[3] ?? attr[4] ?? ''
      // Decode HTML entities, keeping Windows path separators literal.
      attrs[attr[1].toLowerCase()] = value.replace(/&(?:#\d+|#x[\da-f]+|[a-z][\da-z]+);/gi, entity => md.utils.unescapeAll(entity))
    }
    if (!attrs.src || !md.validateLink(attrs.src)) return false
    if (!silent) {
      const token = state.push('image', 'img', 0)
      token.attrs = [['src', attrs.src], ['alt', attrs.alt || '']]
      token.content = attrs.alt || ''
      const text = new state.Token('text', '', 0)
      text.content = token.content
      token.children = [text]
      if (attrs.title) token.attrSet('title', attrs.title)
      for (const name of ['width', 'height']) {
        if (/^\d+(?:px)?$/i.test(attrs[name] || '')) token.attrSet(name, attrs[name].replace(/px$/i, ''))
      }
      // Only extract numeric zoom. Never pass through arbitrary CSS or events.
      const zoomMatch = /(?:^|;)\s*zoom\s*:\s*(\d+(?:\.\d+)?|\.\d+)\s*(%)?\s*(?:;|$)/i.exec(attrs.style || '')
      if (zoomMatch) {
        const zoom = Number(zoomMatch[1]) / (zoomMatch[2] ? 100 : 1)
        if (Number.isFinite(zoom) && zoom > 0) {
          // CSS zoom scales intrinsic dimensions; compensate the width cap so
          // a large image is limited AFTER scaling, rather than shrunk twice.
          token.attrSet('style', `zoom:${zoom};max-width:${100 / zoom}%`)
        }
      }
    }
    state.pos += match[0].length
    return true
  })
}
