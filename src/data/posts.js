import { posts, postLoaders, blogPostErrors, loadSearchIndex } from 'virtual:goldstone/posts'
import { createDetailLoader } from '../lib/detailLoader.js'
export { posts, blogPostErrors, loadSearchIndex }
export const loadPostDetails = createDetailLoader(postLoaders)
