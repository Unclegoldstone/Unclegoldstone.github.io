import { workLoaders } from 'virtual:goldstone/home'
import { createDetailLoader } from '../lib/detailLoader.js'
export { latestPosts, homeProjects, postCount, projectCount, blogPostErrors, workErrors } from 'virtual:goldstone/home'
export const loadWorkDetails = createDetailLoader(workLoaders)
