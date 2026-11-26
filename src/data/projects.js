import { projects, workLoaders, workErrors } from 'virtual:goldstone/works'
import { createDetailLoader } from '../lib/detailLoader.js'
export { projects, workErrors }
export const loadWorkDetails = createDetailLoader(workLoaders)
