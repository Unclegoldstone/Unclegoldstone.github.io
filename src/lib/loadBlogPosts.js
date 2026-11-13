import { parsePost } from './markdown.js'

// An invalid article must not prevent the rest of the site from mounting.
export function loadBlogPosts(documents, resolveImage = (_filename, src) => src) {
  const posts = [], errors = [], slugs = new Set()
  for (const [filename, source] of Object.entries(documents)) {
    try {
      const post = parsePost(source, filename, src => resolveImage(filename, src))
      if (post.draft) continue
      if (slugs.has(post.slug)) throw new Error(`文章 slug 重复：${post.slug}`)
      slugs.add(post.slug)
      posts.push(post)
    } catch (error) {
      errors.push({ filename, message: error instanceof Error ? error.message : String(error) })
    }
  }
  return { posts: posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)), errors }
}
