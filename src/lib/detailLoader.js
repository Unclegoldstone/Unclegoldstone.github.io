// Only successful detail requests are cached; a failed request can be retried.
export function createDetailLoader(loaders) {
  const cache = new Map()
  return function load(id) {
    if (!Object.hasOwn(loaders,id)) return Promise.reject(new Error('未找到这项内容'))
    if (!cache.has(id)) {
      const request = Promise.resolve().then(loaders[id]).then(module => module.default)
      cache.set(id,request)
      request.catch(()=>{if(cache.get(id)===request)cache.delete(id)})
    }
    return cache.get(id)
  }
}
